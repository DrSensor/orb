export { clone, combine, merge, parseURLSearchParams, recurse };

const parseURLSearchParams = (searchParams) => {
    const result = {};
    for (let [params, value] of searchParams) {
      params.split(".").reduce(reduceParam(value), result);
    }
    return result;
  },
  reduceParam = (value) =>
    (container, key, index, props) =>
      container[key] ??= index != props.length - 1 ? {} : parseParam(
        value,
        (value = value.split(","),
          value.length == 1
            ? value[0]
            : value.map((value) =>
              value === "" ? undefined : parseParam(value)
            )),
      ),
  parseParam = (value, fallback = value) => hard[value] ?? (+value || fallback),
  hard = {
    "": true,
    "-0": -0,
    ...[false, NaN, 0].reduce((obj, val) => (obj[val] = val, obj), {}),
  };

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
