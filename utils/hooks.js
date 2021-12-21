import { parseURLSearchParams as parse } from "./config.js";

const once = (fn) => once.cache ??= fn(), fresh = (fn) => fn();

export const importResolve = (cdn, get = once) =>
  (id, parentUrl, resolve) => {
    const { imports } = get(importShim.getImportMap);
    return imports[id] || /^\.{0,2}\/{1}\w/.test(id)
      ? resolve(id, parentUrl) // relative path or declared in importmap
      : `https://${cdn}/${id}`; // else treat it as npm package name
  };

export const importTransform = (...configs) =>
  !configs.length ? undefined : async (url, options) => {
    const { origin, pathname, searchParams } = new URL(url),
      response = await fetch(origin + pathname, options);

    if (!response.ok) return response;
    let type, filename, params;
    for (const { subtype, basename, transform, rules } of configs) {
      if (subtype) type = response.headers.get("Content-Type").split(";")[0];
      if (basename) filename = pathname.split("/").at(-1);
      if (type?.endsWith(subtype) || basename?.test(filename)) {
        let source = await response.text();
        for (const { ext, skip, ...config } of rules) {
          if (filename.endsWith(ext)) {
            if (!skip) {
              source = transform(
                source,
                config,
                params ??= parse(searchParams),
              );
            }
            break;
          }
        }
        const blob = new Blob([source], { type: "text/javascript" });
        return Object.defineProperty(new Response(blob), "url", { value: url });
      }
    }
    return response;
  };
