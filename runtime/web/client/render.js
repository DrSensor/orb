/** Bind JSX.Element into HTML comment */
export default (element, propsOfElement) => {};

// element == HTMLorSVGScriptElement - will bind all `propsOfElement` into <!Comment ...> inside `element.parentElement`
// element == Element - will bind all `propsOfElement` into <!Comment ...> inside current `element`
