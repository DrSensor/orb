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
      6,
    ); // TODO: schedule 👈 & 👇 using https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API#running_tasks

    for (let i = 0; i < result.snapshotLength; i++) {
      const attr = result.snapshotItem(i);
      obj[attr.value]?.effect.add((value) => attr.nodeValue = value);
    }
  },
});
