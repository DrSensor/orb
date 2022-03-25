import { $data, defineProperties } from "./_internal.js";

export default (orb, propertyDescriptor) =>
  defineProperties(orb, { [$data]: propertyDescriptor });
