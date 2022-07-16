import expectation from "https://esm.sh/unexpected"
const expect = expectation.clone()
  , { keys } = Object, { isArray } = Array

// BUG: patching expect(,"to have keys",) cause expect(,"to have key",) broken 😩
// BUG: the default behaviour assertion always trigger the getter when using flags [only] 😞
expect.addAssertion("<object> to [not] [only] have (keys|key) <array|string>", (expect, subject, value) => {
  expect.errorMode = "diff" // avoid getter being triggered
  const { only, not } = expect.flags
  subject = keys(subject)
  { // BUG: weird code transoformation happen either in esm.run or unexpected.js build system which cause if item "get" in subject[0] cause weird error
    [subject[0], subject[1]] = [subject[1], subject[0]]
    if (isArray(value)) [value[0], value[1]] = [value[1], value[0]]
  }
  expect(subject, `${not ? "not " : ""}to ${only ? "equal" : "contain"}`,
    ...!only && isArray(value) ? value : [value])
})

expect.addAssertion("<any> same as <any>", (expect, subject, value) => {
  expect(subject, "to be", value)
})

export * from "https://deno.land/std/testing/bdd.ts"
export * from "https://deno.land/std/testing/asserts.ts"
export { expect }
