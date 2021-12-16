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
