export class QueueEffect {
  constructor(deadline, size) {
    return (function* (effectPool) {
      const enqueue = deadline ? effectPool.unshift : effectPool.push;

      /** queue */ yield (effect) =>
        function () {
          const defer = () => effect.apply(this, arguments);
          enqueue(defer);
          return defer;
        };

      const dequeue = deadline
        ? (startTime) => {
          effectPool.pop()();
          return performance.now() - startTime < deadline; // continue flush-ing if still meet the deadline
        }
        : () => {
          effectPool.reverse();
          effectPool.pop()();
        };

      /** flush */ yield () => {
        const startTime = performance.now();
        while (effectPool.length) if (!dequeue(startTime)) break;
        return effectPool; // in case someone want to class extends QueueEffect or check the Queue size/length
      };
    })(Array(size ?? 0));
  }
}

export const [queue, flush] = new QueueEffect();

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
