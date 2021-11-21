import Orb from "../../factory.js";
import "../index.js";

Object.defineProperty(Element.prototype, "binds", {
  value(obj) {
    const scope =
        this instanceof HTMLScriptElement || this instanceof SVGScriptElement
          ? this.parentElement
          : this,
      bind = (orb, node) => orb?.effect.add((value) => node.nodeValue = value);

    for (
      const { value, name, ownerElement } of snapshot(
        "@*[substring(name(),string-length(name())-string-length(':')+1)=':']",
      )
    ) {
      let ok;
      const orb = obj[value], target = name.slice(0, name.length - 1);
      if (orb instanceof Orb) {
        const attr = document.createAttribute(target);
        if (ok = !!bind(orb, attr)) ownerElement.setAttributeNode(attr);
      } else if (ok = target in ownerElement) ownerElement[target] = orb;
      if (ok) ownerElement.removeAttribute(name);
    }

    for (const comment of snapshot("comment()")) {
      const { data, nextSibling, parentElement } = comment;
      for (const [name, value] of Object.entries(obj)) {
        if (data.startsWith(name)) {
          if (!data.endsWith("/")) {
            let node = nextSibling;
            while (
              !(node instanceof Comment && node.data?.endsWith(`/${name}`))
            ) {
              node = parentElement.removeChild(node).nextSibling;
            }
            parentElement.removeChild(node);
          }
          let target;
          if (value instanceof Orb) bind(value, target = new Text(value));
          else if (value instanceof Element) target = value;
          parentElement.replaceChild(comment, target);
        }
      }
    }

    function* snapshot(query) { // I wish CSS selector was powerful like XPath 😞
      const result = document.evaluate(`.//${query}`, scope, null, 6);
      for (let i = 0; i < result.snapshotLength; i++) {
        yield result.snapshotItem(i);
      }
    }
  }, // TODO: schedule all 👆 query and bindings using https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#running_tasks
});
