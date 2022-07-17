export * from "../../../../_internal/testing.js"
import * as T from "../../../../_internal/testing.js"
import dom from "https://esm.sh/unexpected-dom?alias=magicpen-prism:magicpen-prism/magicPenPrism.min.js"
export const expect = T.expect.clone()
  .use(dom)
  .addAssertion(
    "<DOMElement> not to have (attribute|attributes)", (expect, subject) =>
    expect(subject, "to only have attributes", [])
  )
  .freeze()

import {
  parseHTML, DOMParser,
  NodeList, Element, HTMLElement, SVGElement,
} from "https://esm.sh/linkedom"
import * as DOM from "https://esm.sh/linkedom"

export let inBrowser, inServer
export const
  emulateBrowserDOM = (on = true) => {
    inBrowser = on
  }, // TODO: shim DOM API using jsdom when either jsdom refactored using ShadowRealm or deno shim for node vm is ready

  emulateServerDOM = (on = true) => {
    inServer = on
    if (on) {
      const { parseFromString } = DOMParser.prototype
      DOMParser.prototype.parseFromString = (...$) => {
        const result = parseFromString(...$)
        Object.assign(result, {
          contentType: $[1],
          implementation: {}, // BUG(deps): linkedom doesn't have DOMImplementation interface while https://github.com/unexpectedjs/unexpected-dom/blob/master/src/index.js#L463
        })
        return result
      }
      const { document } = parseHTML(), a = C => C.prototype.constructor
      class Text extends a(DOM.Text) { constructor(...$) { super(document, ...$) } }
      class DocumentFragment extends a(DOM.DocumentFragment) { constructor(...$) { super(document, ...$) } }
      Object.assign(globalThis, {
        document,
        DocumentFragment, Text, DOMParser,
        Element, HTMLElement, SVGElement, NodeList,
      })
      // BUG: (document.createTextNode() instanceof Text) === false
      // BUG: (document.createDocumentFragment() instanceof DocumentFragment) === false
    }
    else {
      delete globalThis.document
      delete globalThis.DocumentFragment
      delete globalThis.Text
      delete globalThis.DOMParser
      delete globalThis.NodeList
      delete globalThis.Element
      delete globalThis.HTMLElement
      delete globalThis.SVGElement
    }
  } 
