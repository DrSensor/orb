/** cache return value into global scope
@example
const a = shared(_)(10), b = shared(_)(5), c = shared(_)(10);
assert: [a, b, c].every(isReactive)
assert: a === c
a.let = b
assert: a === 5, b === 5, c === 5
assert: a !== b, b !== c
*/
