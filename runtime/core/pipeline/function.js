const { defineProperty } = Object;
export default (element, props, children, runtime) =>
  typeof element == "function" &&
  element.apply(runtime, [props].concat(children));
