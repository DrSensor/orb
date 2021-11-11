const { isArray } = Array;

export const Fragment = null, plugin = new Set();

const plug = (args, type) => {
  const extension = Array.from(plugin);
  let element = new Text();
  while (extension.length) {
    const result = extension.pop()(args, type);
    const { done, value } = result.next(element);
    if (done) return value;
  }
};

export const h = (type, props, ...children) =>
  plug([type, props, children], [, , false]);

// example
plugin.add(
  function* ([type, props, children], [isDEV, isTopLevel, isAutoImport]) {
    const transform = (element) => {};
    if (type) {
      const element = yield; // get first transformed result
      yield transform(element); // pass transformed element to other plugins
      yield false; // break (don't process any further transformation)
    }
  },
);

// https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

export { jsx as jsxs };
export function jsx(type, { children, ...props } = {}, key) {
  const jsxs = isArray(children), isTopLevel = jsxs;
  plug([type, props, children], [false, isTopLevel, true]);

  return {
    $$typeof: ReactElementSymbol,
    type,
    key,
    props: { children, ...props },
  };
}

export function jsxDEV(
  type,
  { children, ...props } = {},
  key,
  isStaticChildren,
  source,
  self,
) {
}
