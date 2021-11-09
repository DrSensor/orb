export const useEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.onchange = effect);

export class QueueEffect {
  constructor(deadline) {
    const queue$ = [];

    return [
      (effect) => {
        const enqueue = deadline ? queue$.unshift : queue$.push;
        return function () {
          const defer = () => effect.apply(this, arguments);
          enqueue(defer);
          return defer;
        };
      },

      () => {
        const startTime = performance.now();
        while (queue$.length) {
          if (deadline) queue$.reverse();
          queue$.pop()();
          if (performance.now() - startTime > deadline) break;
        }
      },
    ];
  }
}
