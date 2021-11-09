export const useEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.onchange = effect);

export class QueueEffect {
  constructor(deadline, size) {
    const queue$ = Array(size ?? 0),
      enqueue = deadline ? queue$.unshift : queue$.push,
      dequeue = deadline
        ? (startTime) => {
          queue$.pop()();
          return performance.now() - startTime < deadline; // continue flush-ing if still meet the deadline
        }
        : () => {
          queue$.reverse();
          queue$.pop()();
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
        while (queue$.length) if (!dequeue(startTime)) break;
      },
    ];
  }
}
