#!bundle $0 $(dirname $0)/html-runtime.js
import "../core/syntax.js";
import { effect } from "./addons.js";

Object.defineProperty(Element.prototype, "binds", {
  value(obj) {
    const scope =
        this instanceof HTMLScriptElement || this instanceof SVGScriptElement
          ? this.parentElement
          : this,
      bind = (orb, node) =>
        orb.effect?.add(effect((value) => node.nodeValue = value));

    for (
      const node of snapshot(
        ".//@*[substring(name(),string-length(name())-string-length(':')+1)=':']|.//comment()",
      )
    ) {
      let { value: ok, name, ownerElement, data, nextSibling, parentElement } =
        node;

      if (name) { // is Attr
        const value = obj[ok], target = name.slice(0, name.length - 1);
        if (ok = bind(value, data = document.createAttribute(target))) { // is orb
          ownerElement.setAttributeNode;
        } else if (ok = target in ownerElement) { // either event handler or literal value
          ownerElement[target] = value;
        }
        if (ok) ownerElement.removeAttribute(name);
      } else { // is Comment
        const name = ((ok = data.endsWith("/"))
          ? data.slice(0, data.length - 1)
          : data).trimEnd();
        if (!ok) {
          while (
            !(nextSibling instanceof Comment &&
              nextSibling.data?.endsWith(`/${name}`))
          ) {
            nextSibling = parentElement.removeChild(nextSibling).nextSibling;
          }
          parentElement.removeChild(nextSibling);
        }
        bind(obj[name], data = new Text(obj[name])); // if not orb then assume it's a literal value
        parentElement.replaceChild(data, node);
      }
    }

    function* snapshot(query) { // I wish CSS selector was powerful like XPath 😞
      const result = document.evaluate(query, scope, null, 6);
      for (let i = 0; i < result.snapshotLength; i++) {
        yield result.snapshotItem(i);
      }
    }
  }, // TODO: schedule all 👆 query and bindings using https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#running_tasks
});
