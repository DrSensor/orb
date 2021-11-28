export const $data = Symbol();

export default (orb, propertyDescriptor) =>
  Object.defineProperty(orb, $data, propertyDescriptor);
