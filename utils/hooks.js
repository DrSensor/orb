import { parseURLSearchParams as parse } from "./config.js";

const once = (fn) => once.cache ??= fn(), fresh = (fn) => fn();

/// BUG: doesn't resolve importmap "scope" which break ga.jspm.io
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
      response = await fetch(
        origin + pathname + (/\.\w+$/.test(pathname) ? "" : ".js"),
        options,
      );

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
                url,
              );
            }
            break;
          }
        }
        // let { code, map } = source;
        // if (map) {
        //   // if (typeof map == "string") map = JSON.parse(map);
        //   // TODO: support ?bundle params which require map.sourceRoot=origin, map.file=`shim://${}`, and resolving multiple map.sources
        //   // map.sourceRoot = origin;
        //   // map.sources[0] = pathname.slice(1, pathname.length);
        //   // map.file = pathname.replace(/\.\w+$/i, ".js");
        //   // TODO: check if map.sourcesContent exists
        //   // WARNING: sourceMappingURL will never support blob url https://bugs.chromium.org/p/chromium/issues/detail?id=492586
        //   // code += `\n//# sourceMappingURL=data:,${
        //   //   JSON.stringify(map).replace(/\s/g, "")
        //   // }`;
        // }
        // source = new Blob([code ?? source], { type: "text/javascript" });
        source = new Blob([source], { type: "text/javascript" });
        return Object.defineProperty(new Response(source), "url", {
          value: url,
        });
      }
    }
    return response;
  };
