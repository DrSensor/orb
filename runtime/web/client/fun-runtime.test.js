import {
  describe, it, expect,
  beforeAll, afterAll, beforeEach, afterEach,
  emulateServerDOM, inBrowser,// emulateBrowserDOM, inServer,
} from "./_internal/testing.js"

import { html, svg, text, fragment } from "./fun-runtime.js"
import { over } from "../../../data/overridable.js"

describe("fun-runtime", () => {
  beforeAll(() => emulateServerDOM(true))
  afterAll(() => emulateServerDOM(false))

  describe("text`${tagged} template`", () => {
    it("return NodeList of Text when used as tagged template", () => {
      const result = text`what a nice button`
      expect(result, "not to be a string")
      expect(result, "to be a", NodeList)
      expect(result.length, "to be", 1)
      expect(result[0], "not to be a string")
      expect(result[0], "to be a", Text)
      expect(result[0].data, "to be", String("what a nice button"))
    })
    it("return Text when used as function with single argument", () => {
      const result = text("what a nice button")
      expect(result, "not to be a string")
      expect(result, "not to be a", NodeList)
      expect(result, "to be a", Text)
      expect(result.data, "to be", String("what a nice button"))
    })
    it("can interpolate primitive and object", () => {
      const count = 100, object = { [Symbol.toPrimitive]: () => "button" }
      const result = text`spawn ${count} ${object}`
      expect(result, "to be a", NodeList)
      expect(result.length, "to be", 4)
      result.forEach(item => {
        expect(item, "not to be a string")
        expect(item, "to be a", Text)
      })
      expect(result[0].data, "to be", String("spawn "))
      expect(result[1].data, "not to be", 100)
      expect(result[1].data, "to be", String("100"))
      expect(result[2].data, "to be", String(" "))
      expect(result[3].data, "not to be", object)
      expect(result[3].data, "to be", String("button"))
    })
    it("can bind reactive variable", () => {
      const value = over(0)
      let result

      result = text`be ${value}`
      expect(result[0].data, "to be", String("be "))
      expect(result[1].data, "to be", String("0"))
      value.let++
      expect(result[1].data, "to be", String("1"))

      result = text(value)
      expect(result.data, "to be", String("1"))
      value.let++
      expect(result.data, "to be", String("2"))
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
      const button = document.createElement("button")
      const a = document.createElement("a")
      const result = fragment("what", a, "nice", button)
      expect(result.firstChild, "to be a", Text)
      expect(result.childNodes[1], "to be", a)
      expect(result.childNodes[2].data, "to be", String("nice"))
      expect(result.lastChild, "to be", button)
    })
  })

  let element
  const tests_createElement = () => {
    it("return DOM Element", () => {
      const result = element()
      expect(result, "to be an", Element)
    })
    it("can set attribute value", () => {
      const result = element({ disabled: true })
      expect(result.getAttribute("disabled"), "to be", String(true))
    })
    if (inBrowser) it.ignore("can set property value", () => {}) // TODO: wait for jsdom fully supported in deno or just use https://deno.land/x/puppeteer
    it("can have children", () => {
      const result = element({
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
      expect(result.childElementCount, "to be", 2)
      expect(result.children[0].childNodes.length, "to be", 2)
      expect(result.children[1].childElementCount, "to be", 1)
      expect(result.children[1].childNodes.length, "to be", 3)
    })
    it("can bind reactive variable", () => {
      const disabled = over(false)
      let result

      result = element({ disabled })
      expect(result.getAttribute("disabled"), "to be", String(false))
      disabled.let = true
      expect(result.getAttribute("disabled"), "to be", String(true))

      result = element({ children: [disabled] })
      expect(result.childNodes[0].data, "to be", String(true))
      disabled.let = false
      expect(result.childNodes[0].data, "to be", String(true)) // no change!

      result = element({ children: [text(disabled)] }) // should be wrapped in text()
      expect(result.childNodes[0].data, "to be", String(false))
      disabled.let = true
      expect(result.childNodes[0].data, "to be", String(true))
    })
    it.ignore("can dispose() to remove element from document and reset the side-effects", () => {})
    it.ignore("can swap() element in place", () => {})
    it.ignore("can swap() the attributes/props", () => {})
    it.ignore("swapped reactive attributes/props retain the side-effects", () => {})
  }

  describe("use default DOM Document", () => { // TODO: use pupetter for testing webapp scenario
    describe("for html", () => {
      beforeEach(() => {
        const { button } = html
        element = button
      })
      afterEach(() => { element = undefined })
      tests_createElement()
    })

    describe.ignore("for svg", () => { // TODO: wait for deno_dom to support svg namespace or jsdom is fully supported in deno (or just use https://deno.land/x/puppeteer)
      beforeEach(() => {
        const { rect } = svg
        element = rect
      })
      afterEach(() => { element = undefined })
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
      afterEach(() => { element = undefined })
      tests_createElement()
    })

    describe.ignore("for svg", () => {
      beforeEach(() => {
        const { rect } = svg(parseFromString(`<svg id="main" />`, "image/svg+xml"))
        element = rect
      })
      afterEach(() => { element = undefined })
      tests_createElement()
    })
  })

})
