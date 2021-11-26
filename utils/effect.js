export const setEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.effect = effect);

export const unsetEffect = (orbs, effect) =>
  orbs.forEach((orb) =>
    (!effect || effect == orb.effect) && (orb.effect = undefined)
  );

/** **WARNING** very slow operation */
export const replaceEffect = (prevEffect, newEffect, ...orbs) =>
  orbs.forEach((orb) => {
    const buffer = [];
    for (const effect of orb.effect) {
      buffer.push(effect !== prevEffect ? effect : newEffect);
      orb.effect.delete(effect);
    }
    buffer.forEach(orb.effect.add);
  });

export class QueueEffect {
  constructor(deadline, size) {
    const effectPool = Array(size ?? 0);
    return (function* () {
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
    })();
  }
}

export const [queue, flush] = new QueueEffect();
