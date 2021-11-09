export const useEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.onchange = effect);

const queue$ = [];

export const queue = (effect) =>
  function () {
    const defer = () => effect.apply(this, arguments);
    queue$.unshift(defer);
    return defer;
  };

export const flush = (timeout = Infinity) => {
  const startTime = performance.now();
  while (queue$.length) {
    queue$.pop()();
    if (performance.now() - startTime > timeout) break;
  }
};
