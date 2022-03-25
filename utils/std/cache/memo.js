/** cache return value
@todo internally use shared.js with different global cache while structuredClone the return value
WARNING: structuredClone(onFunction) is not possible so use Object.defineProperties(onFunction, Object.getOwnPropertyDescriptors(onFunction))
@example
const position = new memo(Vector3)(x, y, z)
*/
