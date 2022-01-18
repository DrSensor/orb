// inspired from control flow nodes of BT (Behaviour Tree) in form of Combinator function
// [Combinator function](https://youtu.be/pAnLQ9jwN-E) & https://wiki.haskell.org/Combinator
// [Behaviour Tree](https://youtu.be/dB7ZSz890cw) & https://en.wikipedia.org/wiki/Behavior_tree_(artificial_intelligence,_robotics_and_control)

const { isArray } = Array; // TODO: refactor to _internal.js

export const TOPLEVEL = 2, AUTOMATIC = 1, CLASSIC = 0;
export default (mode, jsxFactory) =>
  (element, props, ...args) => {
    if (mode) {
      var { children = [], ...props } = props;
      children = isArray(children) ? children : [children];
    } else children = args;

    return jsxFactory.apply({}, [element, props, children].concat(args));
  };

// equivalent to BT.Selector
export function select(...jsxFactories) {
  return selectExec.bind(this, jsxFactories);
}

export function selectIf(predicate, ...jsxFactories) {
  const context = this;
  return (...args) =>
    predicate(...args) &&
    selectExec.apply(context, [jsxFactories].concat(args));
}

export function selectAfter(transform, ...jsxFactories) {
  const context = this;
  return (...args) =>
    selectExec.apply(context, [jsxFactories].concat(transform(...args)));
}

function selectExec(jsxFactories, ...args) {
  for (const create of jsxFactories) {
    var result = create.apply(this, args) ?? args[0];
    if (result) break;
  }
  return result;
}

function chainExec(jsxFactories, ...args) {
  for (const create of jsxFactories) {
    args = create.apply(this, isArray(args) ? args : [args]) ?? args[0];
  }
  return args; // end result
}

// equivalent to BT.Sequence
export function chain(...jsxFactories) {
  return chainExec.bind(this, jsxFactories);
}

export function chainIf(predicate, ...jsxFactories) {
  const context = this;
  return (...args) =>
    predicate(...args) && chainExec.apply(context, [jsxFactories].concat(args));
}

// chainAfter(transform,...) is redundant

function chainEachSelectExec(sequence, selector, ...args) {
  for (const create of selector) {
    var result = create.apply(
      this,
      args = chainExec.apply(this, [sequence].concat(args)),
    ) ?? args[0];
    if (result) break;
  }
  return result;
}

export function chainEachSelect(sequence, selector) {
  return chainEachSelectExec.bind(this, sequence, selector);
}

export function chainEachSelectIf(predicate, ..._2) {
  const context = this;
  return (...args) =>
    predicate(...args) && chainEachSelectExec.apply(context, _2.concat(args));
}

export function chainEachSelectAfter(transform, ..._2) {
  const context = this;
  return (...args) => selectExec.apply(context, _2.concat(transform(...args)));
}
