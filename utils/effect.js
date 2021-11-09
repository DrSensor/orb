export const useEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.onchange = effect);

const queue$ = [];
let deadline;

export const queue = (effect) => {
  const enqueue = deadline ? queue$.unshift : queue$.push;
  return function () {
    const defer = () => effect.apply(this, arguments);
    enqueue(defer);
    return defer;
  };
};

export const flush = (timeout) => {
  deadline = timeout;
  const startTime = performance.now();
  while (queue$.length) {
    if (deadline) queue$.reverse();
    queue$.pop()();
    if (deadline && performance.now() - startTime > timeout) break;
  }
};
