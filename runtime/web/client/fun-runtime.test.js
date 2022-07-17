import {
  describe, it, expect,
  beforeAll, afterAll, beforeEach, afterEach,
  emulateServerDOM, // inBrowser,// emulateBrowserDOM, inServer,
} from "./_internal/testing.js"

import { html, svg, text, fragment } from "./fun-runtime.js"
import { over } from "../../../data/overridable.js"

describe("fun-runtime", () => {
  beforeAll(() => emulateServerDOM(true))
  afterAll(() => emulateServerDOM(false))

  describe("text`${tagged} template`", () => {
    it("return Text when used as function with single argument", () => {
      const result = text("what a nice button")
      expect(result, "to be a", Text)
      expect(result, "to satisfy", ("what a nice button"))
    })
    it("return NodeList of Text when used as tagged template", () => {
      const result = text`what a nice button`
      expect(result, "to be a", NodeList)
      expect(result, "to satisfy", ["what a nice button"])
    })
    it("can interpolate primitive and object", () => {
      const count = 100, object = { [Symbol.toPrimitive]: () => "button" }
      const result = text`spawn ${count} ${object}`
      expect(result, "to be a", NodeList)
      expect(result, "to satisfy", ["spawn ", "100", " ", "button"])
    })
    it("can bind reactive variable", () => {
      const value = over(0)
      let result

      result = text`be ${value}`
      expect(result, "to satisfy", ["be ", "0"])
      value.let++
      expect(result, "to satisfy", ["be ", "1"])

      result = text(value)
      expect(result, "to satisfy", ("1"))
      value.let++
      expect(result, "to satisfy", ("2"))
    })
    it.ignore("can accept escape sequence via .raw modifier", () => {
      const unicodeOfChar = char => char.charCodeAt(0)
      const result = text.raw`${0}\t${1}`
      const compareTo = text`${0}\t${1}`
      expect(result[1].data, "to be", String("\\t"))
      expect(compareTo[1].data, "to be", unicodeOfChar("\t"))
    })
    it.ignore("can dispose() to remove texts from document and reset the side-effects", () => {})
    it.ignore("can swap() element in place", () => {})
    it.ignore("can swap() the attributes/props", () => {})
    it.ignore("swapped reactive attributes/props retain the side-effects", () => {})
  })

  describe("fragment", () => {
    it("return instance of DocumentFragment", () => {
      const result = fragment()
      expect(result, "to be a", DocumentFragment)
    })
    it("accept arguments as list of children", () => {
      const result = fragment("what", document.createElement("a"), "nice", document.createElement("button"))
      expect(result, "to satisfy", "what<a></a>nice<button></button>")
    })
  })

  let element, result
  const tests_createElement = () => {
    it("return DOM Element", () => {
      result = element()
      expect(result, "to be an", Element)
      expect(result, "not to have attributes")
      expect(result, "to have no child")
    })
    it("can set attribute value", () => {
      expect(result = element({ dir: "rtl" }), "to only have attributes", { dir: "rtl" })
    })
    it("can set property value", () => {
      expect(result = element({ innerHTML: "🦋" }), "to have text", ("🦋"))
    })
    it("can have children", () => {
      result = element({
        children: [
          element({ children: text`${10}x engineer` }),
          element({
            children: [
              text`${10}x`,
              element(),
            ]
          }),
        ]
      })
      expect(result, "to exhaustively satisfy", {
        attributes: {},
        children: [
          { children: ["10", "x engineer"] },
          { children: ["10", "x", { attributes: {} }] },
        ]
      })
    })
    it("can bind reactive variable", () => {
      const disabled = over(false)

      result = element({ disabled })
      if ("disabled" in result)
        expect(result, "not to have attributes")
      else
        expect(result, "to only have attributes", { disabled: "false" })
      disabled.let = true
      expect(result, "to only have attributes", { disabled: true })

      result = element({ children: [disabled] })
      expect(result, "to have text", "true")
      disabled.let = false
      expect(result, "to have text", "true") // no change!

      result = element({ children: [text(disabled)] }) // should be wrapped in text()
      expect(result, "to have text", "false")
      disabled.let = true
      expect(result, "to have text", "true")
    })
    it.ignore("can dispose() to remove element from document and reset the side-effects", () => {})
    it.ignore("can swap() element in place", () => {})
    it.ignore("can swap() the attributes/props", () => {})
    it.ignore("swapped reactive attributes/props retain the side-effects", () => {})
  }

  describe("use default DOM Document", () => { // TODO: use pupetter (or jsdom) for testing webapp scenario
    describe("for html", () => {
      beforeEach(() => {
        const { button } = html
        element = button
      })
      afterEach(() => {
        expect(result, "to satisfy", { name: "button" })
        result = element = undefined
      })
      tests_createElement()
    })

    describe("for svg", () => {
      beforeEach(() => {
        const { rect } = svg
        element = rect
      })
      afterEach(() => {
        expect(result, "to satisfy", { name: "rect" })
        result = element = undefined
      })
      tests_createElement()
    })
  })

  describe("use custom DOM Document", () => { // TODO: use LinkeDOM document for testing naive/slow SSR scenario
    let parseFromString
    beforeAll(() => ({ parseFromString } = new DOMParser))

    describe("for html", () => {
      beforeEach(() => {
        const { button } = html(parseFromString(`<div id="main" />`, "text/html"))
        element = button
      })
      afterEach(() => {
        expect(result, "to satisfy", { name: "button" })
        expect(result.ownerDocument, "to contain", `<div id="main">`)
        result = element = undefined
      })
      tests_createElement()
    })

    describe("for svg", () => {
      beforeEach(() => {
        const { rect } = svg(parseFromString(`<svg id="main" />`, "image/svg+xml"))
        element = rect
      })
      afterEach(() => {
        expect(result, "to satisfy", { name: "rect" })
        expect(result.ownerDocument, "to contain", `<svg id="main">`)
        result = element = undefined
      })
      tests_createElement()
    })
  })
})
