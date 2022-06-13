import * as T from "../../_internal/testing.js"
const expect = T.expect.clone()
  , { getOwnPropertyDescriptors, entries, fromEntries } = Object

expect.addAssertion("<object> [all] properties to [exhaustively] satisfy <object>", (expect, subject, value) => {
  expect.errorMode = "diff" // avoid getter being triggered
  subject = getOwnPropertyDescriptors(subject)
  const { all, exhaustively } = expect.flags
  if (!all) subject = fromEntries(entries(subject).filter(([, it]) => it.enumerable))
  expect(subject, `to${exhaustively ? " exhaustively " : " "}satisfy`, value)
})

expect.addAssertion("<object> [not] as (g|s)etter", (expect, subject) => {
  const op = expect.alternations[0] + "et", { not } = expect.flags
  if (not) expect(subject, "to not have key", op)
  else expect(subject, "to satisfy", { [op]: expect.it(`to be a function`) })
})

expect.addAssertion("<object> [not] as (any|array|boolean|Buffer|date|Error|function|NaN|null|number|object|regexp|string|undefined)", (expect, subject) => {
  const isNot = expect.flags.not ? "not " : ""
  expect(subject, "to satisfy", {
    value: expect.it(`${isNot}to be a ${expect.alternations[0]}`),
  })
})

const GetterSetter = mid => Array(2).fill().map((_, i) =>
  `<object> [not] as ${i ? "g" : "s"}etter(${mid})${i ? "s" : "g"}etter`)

expect.addAssertion(GetterSetter(" | and | & | + "), (expect, subject) => {
  if (expect.flags.not) {
    throw "TODO: flag [not] is not yet supported"
    // BUG: unfortunately unexpected.js can't do this kind of chaining
    // expect(subject, "not to have properties", ["get", "set"])
    //   .or("to satisfy", {
    //     get: expect.it("to be a function"),
    //     set: expect.it("not to be defined"),
    //   })
    //   .or("to satisfy", {
    //     get: expect.it("not to be defined"),
    //     set: expect.it("to be a function"),
    //   })
  } else
    expect(subject, "to satisfy", {
      get: expect.it("to be a function"),
      set: expect.it("to be a function"),
    })
})

expect.addAssertion(GetterSetter("/| or "), (expect, subject) => {
  if (expect.flags.not) expect(subject, "to not have keys", ["get", "set"])
  else expect(subject, "to satisfy", {
    get: expect.it("to be a function").or("not to be defined"),
    set: expect.it("to be a function").or("not to be defined"),
  })
})

export * from "../../_internal/testing.js"
export { expect }
