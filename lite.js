import { $data } from "./override.js";
export { default as override } from "./override.js";

export default (self) => {
  const orb = {}, get = () => orb[$data], set = (value) => orb[$data] = value;

  orb[$data] = self;
  return Object.defineProperties(orb, {
    value: { set, get },
    set: { value: set },
    [Symbol.toPrimitive]: { value: get },
  });
};
