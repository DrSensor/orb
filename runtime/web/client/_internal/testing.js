export * from "../../../../_internal/testing.js"
import * as T from "../../../../_internal/testing.js"
import dom from "https://esm.sh/unexpected-dom?alias=magicpen-prism:magicpen-prism/magicPenPrism.min.js"
export const expect = T.expect.clone().use(dom)

import { // TODO: replace with jsdom when either jsdom refactored using ShadowRealm or deno shim for node vm is ready
  Document, DocumentFragment, Text, DOMParser,
  NodeList, Element,
} from "https://deno.land/x/deno_dom/deno-dom-native.ts" // TODO: replace with LinkeDOM for testing naive SSR
export let inBrowser, inServer
export const
  emulateBrowserDOM = (on = true) => {
    inBrowser = on
  }, // TODO: shim DOM API using jsdom

  emulateServerDOM = (on = true) => {// FIXME: shim DOM API using LinkeDOM
    inServer = on
    if (on) Object.assign(globalThis, {
      document: new Document,
      Document, DocumentFragment, Text, DOMParser,
      NodeList, Element,
    })
    else {
      delete globalThis.document
      delete globalThis.Document
      delete globalThis.DocumentFragment
      delete globalThis.Text
      delete globalThis.DOMParser
      delete globalThis.NodeList
      delete globalThis.Element
    }
  } 
