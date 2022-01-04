import unexpected from "unexpected";
const expect = unexpected.clone()
  .addAssertion(
    "<any> [not] to be reactive",
    (expect, subject) =>
      expect(isReactive(subject), `to be ${!expect.flags.not}`),
  );

import struct from "orb/data/struct.js";
import { isReactive, reset } from "orb/utils/std/misc.js";

context("reactive Struct", () => {
  specify("every destructured value is reactive", () => {
    const { exp, name, admin } = struct({ exp: 0, name: "hero", admin: true });
    expect(+exp, "to be", 0);
    expect(`${name}`, "to be", "hero");
    expect(!!+admin, "to be", true);
    [exp, name, admin].forEach((that) => expect(that, "to be reactive"));
  });

  describe("changing .property value via `=`", () => {
    it("same as changing value via `.set()`", () => {
      const player = struct({ health: 100 }), { health } = player;
      player.health = 50, expect(+health, "to be", 50);
      reset(health), expect(+health, "to be", 100);
      health.set(50), expect(+health, "to be", 50);
    });
    it("same as changing value via `.let = `", () => {
      const player = struct({ health: -100 }), { health } = player;
      player.health /= 2, expect(+health, "to be", -50);
      reset(health), expect(+health, "to be", -100);
      health.let /= 2, expect(+health, "to be", -50);
    });
  });

  it("can specify the depth", () => {
    const loader = () => {};
    const swc = {
      jsc: { target: "es2022", parser: { jsx: true } },
      sourceMaps: true,
      loader,
    };
    const swcrc = struct(swc, { depth: 2 }), refer_swc = swc;
    expect(swc, "to satisfy", { // expect no mutation
      jsc: { target: "es2022", parser: { jsx: true } },
      sourceMaps: true,
      loader,
    });
    expect(swcrc, "to satisfy", { // specify which properties is reactive
      sourceMaps: expect.it("to be reactive"),
      loader: expect.it("to be", refer_swc.loader)
        .and("not to be reactive")
        .and("to be a function"),
      jsc: {
        target: expect.it("to be reactive"),
        parser: expect.it("to be", refer_swc.jsc.parser)
          .and("not to be reactive")
          .and("to exhaustively satisfy", { jsx: true }),
      },
    });
  });

  // TODO:reactive(struct): test mode and custom property descriptor
});
