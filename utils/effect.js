export const setEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.effect = effect) || effect;

export const unsetEffect = (effect, orbs) =>
  orbs.forEach((orb) =>
    (!effect || effect == orb.effect) && (orb.effect = undefined)
  ) || effect;

const each = (orbs, o, e, effect) => orbs[o]((orb) => orb.effect[e](effect));

export const addEffect = (effect, orbs) =>
  each(orbs, "forEach", "add", effect) || effect;

export const deleteEffect = (effect, orbs) =>
  each(orbs, "forEach", "delete", effect) || effect;

export const someHasEffect = (effect, orbs) =>
  each(orbs, "some", "has", effect);

export const everyHasEffect = (effect, orbs) =>
  each(orbs, "every", "has", effect);

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
