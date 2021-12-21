export { clone, combine, merge, recurse };

const clone = (object) => parse(stringify(object)),
  { parse, stringify } = JSON;

const merge = (target, source) =>
  entries(source).reduce(recurse(merge), target);

const recurse = (reducer) =>
    (target, [key, value]) => (
      isObject(value)
        ? reducer(target[key] ??= {}, value)
        : (target[key] = value) === undefined && delete target[key], target
    ),
  isObject = (value) =>
    value && typeof value == "object" && !Array.isArray(value),
  { entries } = Object;

const combine = (target, source) => merge(clone(target), source);
