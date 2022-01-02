import { createElement } from "orb/runtime/web/index.js";

/**
 * @example manipulating JSX.Element via reference
 * ```jsx
 * const funcref = (element) => {}; // can be attached in multiple element
 * const [refvar] = Element; // only limited to one element (only last element will be referenced)
 * <jsx $:let={funcref}><JSX $:let={funcref}></jsx>;
 * <jsx $:let={refvar}><JSX $:let={funcref}</jsx>;
 * ```
 */
export default (title = "<non-component>") =>
  context(title, () => {
    describe("without namespace", () => {
      it("should return function or tree");
      it("can have attributes and event listener");
      it("can't be manipulated via reference");
      it("can't binds attributes to reactive variable");

      describe("can have children of", () => {
        it("<non-component> without namespace");
        it("instanceof Element");
      });

      describe("when used as child", () => {
        context("in <non-component>", () => {
          describe("with namespace", () => {
            it("can be manipulated via reference");
            it("can binds attributes to reactive variable");
            it("can attach event listener");
          });
          describe("with instanceof Element", () => {
            it("can be manipulated via reference");
            it("can binds attributes to reactive variable");
            it("can attach event listener");
          });
        });
      });
    });

    describe("with namespace", () => {
      it("should return instanceof Element");
      it("can have attributes");
      it("can be manipulated via reference");
      it("can binds attributes to reactive variable");
      it("can attach event listener");
    });

    describe("with instanceof Element", () => {
      it("should return instanceof Element");
      it("can have attributes");
      it("can be manipulated via reference");
      it("can binds attributes to reactive variable");
      it("can attach event listener");
    });
  });

const isDefferedCreateElement = (container) => {},
  isTemplateTree = (container) => {},
  isStructureTree = (container) => {};
