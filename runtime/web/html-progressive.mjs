import "../index.js";

Object.defineProperty(Element.prototype, "binds", {
  value(obj) {
    const bindAttrsIn = (element) => {
      for (const { name, value } of element.attributes) {
        if (name.endsWith(":")) { // TODO: replace all with XPath query
          obj[value]?.effect.add((value) =>
            element.setAttribute(name.slice(0, name.length - 1), value)
          );
        }
      }
    };
    const isScript = this instanceof HTMLScriptElement ||
      this instanceof SVGScriptElement;
    const parent = isScript ? this.parentElement : this;
    bindAttrsIn(parent); // TODO: schedule 👈 & 👇 using https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#running_tasks
    for (const child of parent.getElementsByTagName("*")) bindAttrsIn(child);
  },
});
