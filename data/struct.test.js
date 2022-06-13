import { describe, it, expect } from "./_internal/testing.js"
import { Over, Cover } from "./overridable.js"

import struct, { get, is } from "./struct.js"

describe("struct", () => {
  it("works as regular plain object", () => {
    const pos = struct({ x: 0, y: 0, z: 0 })
    pos.x = 1
    expect(is(pos, struct), "to be true")
    expect(pos, "to exhaustively satisfy", { x: 1, y: 0, z: 0 })
  })
  it("cover other object", () => {
    const vec3 = { x: 0, y: 0, z: 0 }
    const pos = struct(vec3)
    pos.x = 1
    expect(vec3, "to equal", { x: 1, y: 0, z: 0 })
  })
  it("can't be destructured in normal ways", () => {
    const pos = struct({ x: 0, y: 0, z: 0 })
    expect({ ...pos }, "to be empty")
    expect({ ...get(pos) }, "to equal", { x: 0, y: 0, z: 0 })
    expect({ ...pos() }, "to be empty")
    const { x, y, a } = pos()
    expect(x, "to be a", Cover)
    expect(y, "to be a", Cover)
    expect(a, "not to be defined")
    expect({ ...pos() }, "to equal", { x, y }) // doesn't have `z` yet
    const { x: x1, y: y1, z } = pos()
    expect(z, "to be a", Cover)
    expect({ ...pos() }, "to equal", { x, y, z })
    expect(x1, "same as", x) // x1 === x
    expect(y1, "same as", y) // y1 === y
    const { b } = pos()
    expect(b, "not to be defined")
  })
})

describe("struct.class", () => {
  it("can be declared", () => {
    const Vec3 = struct.class({ x: 0, y: 0, z: 0 })
    expect(is(Vec3, struct.class), "to be true")
    expect(Vec3.prototype, "to only have keys", ["x", "y", "z"])
    expect(Vec3.prototype, "properties to exhaustively satisfy", {
      x: expect.it("as getter setter"),
      y: expect.it("as getter setter"),
      z: expect.it("as getter setter"),
    })
  })

  const Vec3 = struct.class({ x: 0, y: 0, z: 0 }); {
    it("can be instantiated", () => {
      const pos = new Vec3
      expect(pos, "to be a", Vec3)
      expect(is(pos, struct), "to be true")
    })
    it("default value can be overrided at instantiation", () => {
      const pos = new Vec3({ x: 1 })
      expect(pos, "to exhaustively satisfy", { x: 1, y: 0, z: 0 })
    })
    it("can't be destructured in normal ways", () => {
      const pos = new Vec3
      expect({ ...pos }, "to be empty")
      expect({ ...get(pos) }, "to equal", { x: 0, y: 0, z: 0 })
      expect({ ...pos() }, "not to be empty")
      const { x, y, a } = pos()
      expect(x, "to be a", Over)
      expect(y, "to be a", Over)
      expect(a, "not to be defined")
      expect({ ...pos() }, "not to equal", { x, y }) // it has `z`
      expect(pos(), "to only have keys", ["x", "y", "z"])
      const { x: x1, y: y1, z } = pos()
      expect(z, "to be a", Over)
      expect({ ...pos() }, "to equal", { x, y, z })
      expect(x1, "same as", x) // x1 === x
      expect(y1, "same as", y) // y1 === y
    })
  }
})
