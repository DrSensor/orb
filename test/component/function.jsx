import { createElement } from "orb/runtime/web/index.js";

export default (title = "<FunctionComponent>") =>
  context(title, () => {
    it("should pass props as plain object in `arguments[0]`");
    it("should pass children in `arguments[1..]`");
    it("can be created without props and children");

    describe("when created", () => {
      it("should throw error if return is not JSX.Element");
      it("should produce the same JSX.Element if return is <non-component>");
      describe("when return is <FunctionComponent>", () => {
        describe("that return <non-component>", () => {
          describe("should return instanceof Element", () => {
            it("if with namespace");
            it("if with instanceof Element");
          });
          it("should return function or tree if without namespace");
        });
        describe("that return <FunctionComponent>", () => {});
      });

      describe("effect", () => {
        context("in function Component", () => {});
        context("in function hook", () => {});
      });
    });

    // TODO: move to 👆 maybe 🤔 (or nay since 👆 is for complex stuff like passing arguments, context, etc)
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

      // WARNING: seems redundant, maybe just check the return value 🤔
      // Actually, there is a lot of combination since it's nested. So maybe use property-based-test 🤔
      // context("in <FunctionComponent> that return <non-component>", () => {
      //   describe("with namespace", () => {
      //     it("should execute `this.effect`");
      //     it("should execute `this(hook)`");
      //   });
      //   describe("with instanceof Element", () => {
      //     it("should execute `this.effect`");
      //     it("should execute `this(hook)`");
      //   });
      //   describe("without namespace", () => {
      //     it("shouldn't yet execute `this.effect`");
      //     it("shouldn't yet execute `this(hook)`");
      //   });
      // });
    });
  });
