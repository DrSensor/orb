import { createElement } from "orb/runtime/web/index.js";
import $expect from "unexpected";
import { fake } from "sinon";
import sinon from "unexpected-sinon";
import dom from "unexpected-dom";
const expect = $expect.clone().use(sinon).use(dom);

export default (title = "<FunctionComponent>") =>
  context(title, () => {
    it("should pass props as plain object in `arguments[0]`", () => {
      function Component() {
        return <Text {...arguments[0]} />;
      }
      const Text = (props) => <svg:text {...props} />;

      expect(<Component x={5} y={-10} />, "to only have attributes", {
        x: "5",
        y: "-10",
      });
    });
    it("should pass children in `arguments[1..]` #bug@swc", () => {
      // BUG: currently spread children is not supported in SWC
      // see https://github.com/swc-project/swc/issues/2037
      function Component() {
        const [_, ...children] = arguments;
        // return <Div>{...children}</Div>;
        return <Div>{children[0]}{children[1]}</Div>;
      }
      const Div = (_, ...children) => (
        <html:div>{children[0]}{children[1]}</html:div>
      );
      // const Div = (_, ...children) => <html:div>{...children}</html:div>;

      expect(
        <Component>
          <label />
          <span />
        </Component>,
        "to exhaustively satisfy",
        { children: [{ name: "label" }, { name: "span" }] },
      );
    });
    it("can be created without props and children #bug@swc", () => {
      function VectorIcon() {
        const [{ width, height } = {}, ...children] = arguments;
        return (
          <svg width={width} height={height}>
            {children[0]}
            {children[1]}
          </svg>
        );
      }
      const Icon = () => (
        <svg>
          <circle r={100} fill="yellow" />
        </svg>
      );
      // TODO: also test `(props, ...children) => <svg {...props}>{...children}</svg>` when bug in swc fixed

      expect(<VectorIcon />, "to exhaustively satisfy", "<svg></svg>");
      expect(
        <Icon />,
        "to exhaustively satisfy",
        '<svg><circle r="100" fill="yellow"></circle></svg>',
      );
    });

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

      describe("with effect", () => {
        const create = fake().named("on create() effect");
        const mount = fake().named("on mount() effect");
        afterEach(() => [create, mount].forEach((it) => it.resetHistory()));

        context("in function Component", () => {
          it("should call `this.effect`", () => {
            function Component() {
              this.effect = create;
            }

            <DocumentFragment>
              <Component />
            </DocumentFragment>;

            expect(create, "was called once");
          });
          it("can only have one last `this.effect`", () => {
            function Component() {
              this.effect = create;
              this.effect = mount;
            }

            <DocumentFragment>
              <Component />
            </DocumentFragment>;

            expect(create, "was not called");
            expect(mount, "was called once");
          });
          it("can be refactored into single function overloading", () => {
            function Component_1() {
              this.effect = effect;
            }
            function Component_2() {
              this.effect = effect;
            }
            const effect = fake((Type) => {
              switch (Type) {
                case Component_1:
                  return skill("pikachu");
                case Component_2:
                  return skill("picasso");
              }
            }).named("effect(Type)");

            const skill = fake(($) => ({
              pikachu: "electrocute",
              picasso: "abstract paint",
            }[$])).named("skill($)");

            <DocumentFragment>
              <Component_1 />
              <Component_2 />
            </DocumentFragment>;

            expect([effect, skill], "to have calls satisfying", [
              { spy: effect, args: [Component_1], returned: "electrocute" },
              skill,
              { spy: effect, args: [Component_2], returned: "abstract paint" },
              skill,
            ]);
          });
        });
        context("in function hook", () => {
          it("should call `this(hook)`", () => {
            function Component() {
              expect(this(hook), "to be", 2022);
            }
            const hook = fake.returns(2022).named("hook()");

            <DocumentFragment>
              <Component />
            </DocumentFragment>;

            expect(hook, "was called");
          });
          it("can have `this.effect`", () => {
            function Component() {
              expect(this(hook), "to be", 1945);
            }
            function hook() {
              this.effect = create;
              return compute();
            }
            const compute = fake.returns(1945).named("effect inside hook()");

            <DocumentFragment>
              <Component />
            </DocumentFragment>;

            expect([compute, create], "given call order");
          });
          // TODO: it("can only have different `this.effect` on each `this(hook)`");
          it("can be called with function arguments", () => {
            function Component() {
              const math = this(hook, ["equation"]);
              expect(math, "to be", "kWh/month = ${1}V * ${2}mA * ${3}h/day");
              return this(hook, myLaptopAdapter);
            }
            const hook = fake(($1, $2, $3) => {
              if (typeof $1 == "number") return $1 * $2 * $3 * 3e-5;
              return "kWh/month = ${1}V * ${2}mA * ${3}h/day";
            }).named("hook()");

            const myLaptopAdapter = [19, 3420, 5], energyRate = <Component />;

            expect(+energyRate, "to be", 9.747);
            expect(hook, "to have calls satisfying", [
              ["equation"],
              myLaptopAdapter,
            ]);
          });
          it("can be called with extra arguments", () => {
            function Component() {
              const [pos, vel] = this(hook, [Vector3, Vector3], defaultValues);
              return (
                <DocumentFragment>
                  x := {pos.x},{vel.x + "\n"}
                  y := {pos.y},{vel.y + "\n"}
                  z := {pos.z},{vel.z}
                </DocumentFragment>
              );
            }
            function hook(...Types) {
              const init = this.args[1];
              return Types.map((Type, index) => new Type(init[index]));
            }

            class Vector3 {
              x = 0;
              y = 0;
              z = 0;
              constructor(init) {
                if (Array.isArray(init)) {
                  this.x = init[0] ?? this.x;
                  this.y = init[1] ?? this.y;
                  this.z = init[2] ?? this.z;
                } else Object.assign(this, init);
              }
            }
            const defaultValues = [{ x: 5, z: -5 }, [, -5, 5]];
            const { textContent } = <Component />;

            expect(
              textContent,
              "to be",
              [
                "x := 5,0",
                "y := 0,-5",
                "z := -5,5",
              ].join("\n"),
            );
          });
        });
      });

      describe("when disposed", () => {});

      describe("when replaced", () => {});
    });

    // TODO: move to 👆 maybe 🤔 (or nay since 👆 is for complex stuff like passing arguments, context, etc)
    describe("when used as child in <non-component>", () => {
      const create = fake().named("on create() effect");
      const dispose = fake().named("on dispose() effect");
      afterEach(() => [create, dispose].forEach((it) => it.resetHistory()));

      describe("with namespace", () => {
        it("should execute `this.effect`", () => {
          function Component() {
            this.effect = () => {
              create();
              return () => {
                dispose();
              };
            };
            return <div />;
          }

          <html:template>
            <Component />
          </html:template>;

          expect(create, "was called once");
          expect(dispose, "was not called");
        });
        it("should execute `this(hook)`", () => {
          function Component() {
            expect(this(hook), "to be", "picasso");
            return <div />;
          }
          const hook = fake.returns("picasso").named("simple hook()");

          <html:template>
            <Component />
          </html:template>;

          expect(hook, "was called once");
        });
      });

      describe("with instanceof Element", () => {
        const document = new DOMParser().parseFromString("", "text/html");

        it("should execute `this.effect`", () => {
          function Component() {
            this.effect = create;
            return <div />;
          }

          <document.body $:replaceChildren>
            <Component />
          </document.body>;

          expect(create, "was called once");
        });
        it("should execute `this(hook)`", () => {
          function Component() {
            expect(this(hook), "to be", "pikachu");
            return <div />;
          }
          function hook() {
            this.effect = () => (create(), dispose);
            return compute();
          }
          const compute = fake.returns("pikachu").named("hook return");

          <document.body $:append>
            <Component />
          </document.body>;

          expect([compute, create], "given call order");
          expect(dispose, "was not called");
        });
      });

      describe("without namespace", () => {
        it("shouldn't yet execute `this.effect`", () => {
          function Component() {
            this.effect = () => (create(), dispose);
            return <div />;
          }

          const template = (
            <template>
              <Component />
            </template>
          );
          [create, dispose].forEach((effect) =>
            expect(effect, "was not called")
          );

          <html:div>{template}</html:div>;
          expect(create, "was called once");
          expect(dispose, "was not called");
        });
        it("should execute `this(hook)` but defer `hook(){this.effect}`", () => {
          function Component() {
            expect(this(hook), "to be", "picacho");
            return <div />;
          }
          function hook() {
            this.effect = () => (create(), dispose);
            return compute();
          }
          const compute = fake.returns("picacho").named("hook return");

          const template = (
            <template>
              <Component />
            </template>
          );
          expect(compute, "was called once");
          [create, dispose].forEach((effect) =>
            expect(effect, "was not called")
          );

          <html:div>{template}</html:div>;
          expect(create, "was called once");
          expect(dispose, "was not called");
        });
      });
    });

    // WARNING: seems redundant, maybe just check the return value 🤔
    // Actually, there is a lot of combination since it's nested. So maybe use property-based-test 🤔
    // context("when used as child in <FunctionComponent> that return <non-component>", () => {
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
