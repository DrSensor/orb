import "../index.js";

Object.defineProperty(Element.prototype, "binds", {
  value(obj) {
    const isScript = this instanceof HTMLScriptElement ||
      this instanceof SVGScriptElement;

    const endsWith = (haystack, needle) =>
      `substring(${haystack},string-length(${haystack})-string-length(${needle})+1)=${needle}`;

    const result = document.evaluate(
      `.//@*[${endsWith("name()", "':'")}]`,
      isScript ? this.parentElement : this,
      null,
      6, // UNORDERED_NODE_SNAPSHOT_TYPE
    ); // TODO: schedule 👈 & 👇 using https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#running_tasks

    for (let i = 0; i < result.snapshotLength; i++) {
      const { value, name, ownerElement } = result.snapshotItem(i);
      const attr = document.createAttribute(name.slice(0, name.length - 1));
      obj[value]?.effect.add((value) => attr.nodeValue = value);
      ownerElement.removeAttribute(name);
    }
  },
});
