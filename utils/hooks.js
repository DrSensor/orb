const once = (fn) => once.cache ??= fn(), fresh = (fn) => fn();

export const importResolve = (cdn, get = once) =>
  (id, parentUrl, resolve) => {
    const { imports } = get(importShim.getImportMap);
    return imports[id] || /^\.{0,2}\/{1}\w/.test(id)
      ? resolve(id, parentUrl) // relative path or declared in importmap
      : `https://${cdn}/${id}`; // else treat it as npm package name
  };
