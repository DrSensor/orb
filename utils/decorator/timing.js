export const delay = (ms) =>
  (effect) =>
    function () {
      return new Promise((resolve) =>
        setTimeout(() => resolve(effect.apply(this, arguments)), ms)
      );
    };

export const debounce = (ms) =>
  (effect) => {
    let timeout;
    return function () {
      clearTimeout(timeout);
      return new Promise((resolve) =>
        timeout = setTimeout(() => resolve(effect.apply(this, arguments)), ms)
      );
    };
  };

// TODO: https://javascript.info/task/throttle decorator
// https://github.com/DrSensor/js13k-utils/blob/trunk/timing.ts#L23-L43
// export const throttle = (ms) => (effect) => {};
