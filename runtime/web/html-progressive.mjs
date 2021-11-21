import "../index.js";

Object.defineProperty(Element.prototype, "binds", {
  value(obj) {
    const scope =
        this instanceof HTMLScriptElement || this instanceof SVGScriptElement
          ? this.parentElement
          : this,
      bind = (orb, node) => orb?.effect.add((value) => node.nodeValue = value),
      remove = (node) => node.parentElement.removeChild(node);

    for (
      const { value, name, ownerElement } of snapshot(
        "@*[substring(name(),string-length(name())-string-length(':')+1)=':']",
      )
    ) {
      if (
        bind(
          obj[value],
          document.createAttribute(name.slice(0, name.length - 1)),
        )
      ) {
        ownerElement.removeAttribute(name);
      }
    }

    for (const comment of snapshot("comment()")) {
      const { data, nextSibling } = comment;
      for (const [name, orb] of Object.entries(obj)) {
        if (data.startsWith(name)) {
          remove(comment);
          if (!data.endsWith("/")) {
            let node = nextSibling;
            while (
              !node instanceof Comment || !node.data?.endsWith(`/${name}`)
            ) {
              node = remove(node).nextSibling;
            }
          }
          bind(orb, new Text(orb));
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
