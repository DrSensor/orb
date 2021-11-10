export const setEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.onchange = effect);

const jsxs = (context) => context.component === "toplevel"; // just example
export const useEffect = (effect, orbs, when = jsxs) => { // seems complicated 😂
  let finalize;
  for (const orb of orbs) {
    Object.assign(orb.effect, {
      onadd: (context) => when(context) && (finalize = effect(context)),
      ondelete: () => finalize?.(),
    });
  }
};

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

/** **WARNING** generally faster but require orb.offect to be writable which is unsafe */
// export const replaceEffect = (prevEffect, newEffect, ...orbs) =>
//   orbs.forEach((orb) => {
//     const effects = Array.from(orb.effect);
//     effects.splice(effects.indexOf(prevEffect), 1, newEffect);
//     orb.effect = new Set(effects);
//   });

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

export const [queue, flush] = new QueueEffect();
