/** Bind value, event handler, and reactive variable into HTML attribute and comment */
export default (element, varprops) => {};

// element == HTMLorSVGScriptElement - will bind all `varprops` into `element.parentElement` + <-descendant (including `element`)
// element == Element - will bind all `varprops` into current `element` + it's descendant
