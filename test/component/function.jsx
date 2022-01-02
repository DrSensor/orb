import { createElement } from "orb/runtime/web/index.js";

export default (title = "<FunctionComponent>") =>
  context(title, () => {
    it("should pass props as plain object in `arguments[0]`");
    it("should pass children in `arguments[1..]`");
    it("can be created without props and children");

    describe("when used as child", () => {
      context("in <non-component>", () => {
        describe("with namespace", () => {
          it("should execute `this.effect`");
          it("should execute `this(hook)`");
        });
        describe("with instanceof Element", () => {
          it("should execute `this.effect`");
          it("should execute `this(hook)`");
        });
        describe("without namespace", () => {
          it("shouldn't yet execute `this.effect`");
          it("shouldn't yet execute `this(hook)`");
        });
      });

      context("in <FunctionComponent> that return <non-component>", () => {
        describe("with namespace", () => {
          it("should execute `this.effect`");
          it("should execute `this(hook)`");
        });
        describe("with instanceof Element", () => {
          it("should execute `this.effect`");
          it("should execute `this(hook)`");
        });
        describe("without namespace", () => {
          it("shouldn't yet execute `this.effect`");
          it("shouldn't yet execute `this(hook)`");
        });
      });
    });
  });
