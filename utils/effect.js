export const useEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.onchange = effect);

export class QueueEffect {
  constructor(deadline, size) {
    const effectPool = Array(size ?? 0),
      enqueue = deadline ? effectPool.unshift : effectPool.push,
      dequeue = deadline
        ? (startTime) => {
          effectPool.pop()();
          return performance.now() - startTime < deadline; // continue flush-ing if still meet the deadline
        }
        : () => {
          effectPool.reverse();
          effectPool.pop()();
        };
    return [
      /*queue*/ (effect) =>
        function () {
          const defer = () => effect.apply(this, arguments);
          enqueue(defer);
          return defer;
        },
      /*flush*/ () => {
        const startTime = performance.now();
        while (effectPool.length) if (!dequeue(startTime)) break;
      },
      effectPool, // in case someone want to class extends QueueEffect
    ];
  }
}
