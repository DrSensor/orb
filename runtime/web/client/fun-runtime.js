import * as U from "../../../_internal/utils.js"
import * as S from "../../../_internal/symbols.js"
import * as K from "../../../_internal/keywords.js"

// TODO: move to "runtime/dom/_internal/keyword.js"
const W3C = "http://www.w3.org/", HTML = `${W3C}1999/xhtml`, SVG = `${W3C}2000/svg`
// TODO: move to "runtime/dom/_internal/utils.js"
const setAttribute = (el, name, value) => el.setAttribute(name, value)
  , replaceWith = (src, dst) => src.replaceWith(dst)
  , parentElement = node => node.parentElement
  , prevSibling = node => node.previousSibling
  , nextSibling = node => node.nextSibling

// TODO: move to "data/core/override-utils.js"
const isReactive = o => U.isType(o, K.OBJ) && U.isType(o.set, K.FUNC)
  , prevFunc = /* @__PURE__ */ S.Symbol() // FIXME: import { prevFunc } from "/data/reactive/_internal/symbols.js"
  , bind = (o, setFn, prevSet = o.set, prevFn = U.bind(prevSet, o)) => {
    o.set = (...$) => (setFn(...$), prevFn(...$))
    o.set[prevFunc] = prevSet
  } // FIXME: keep same `o.set[prevFunc]` so it can be detected by `derive().set = fn`

const bindAttrs = /* @__PURE__ */ S.Symbol()
  , bindTexts = /* @__PURE__ */ S.Symbol()
  , attrs = /* @__PURE__ */ S.Symbol()
  , cache = new WeakMap,

  createElement = (namespace, doc, element, { children, ...props } = {}) => {
    const el = (doc ?? document).createElementNS(namespace, element) // TODO: investigate if subsequent call of createElementNS make itself hot (limit perf to V8)
    if (children) el.append(...U.flat(U.arrayFrom(children)))        // ^^^^  just wondering why most framework use .createElement instead of .createElementNS 🤔
    let reactiveProps
    U.forEach(U.entries(props), ([name, prop]) => {
      name in el
        ? U.isType(prop, K.OBJ) ? U.assign(el[name], prop) : el[name] = prop
        : setAttribute(el, name, prop)
      if (isReactive(prop)) {
        U.push(reactiveProps ??= [], prop) // Set.prototype.add has slight overhead
        U.push(prop[attrs] ??= [], name)
        U.push(el[bindAttrs] ??= [], name)
      }
    })
    if (reactiveProps) U.forEach(reactiveProps, prop => {
      if (prop[bindAttrs]?.at(-2) === el) return // but no check required if using Set.prototype.add
      if (!prop[bindAttrs]) {
        let el
        bind(prop, value => U.forEach(prop[bindAttrs], (it, i) => i % 2
          ? U.forEach(it, name => setAttribute(el, name, value))
          : el = it
        ))
      }
      U.push(prop[bindAttrs] ??= [], el, prop[attrs])
      prop[attrs] = [] // optimize for subsequent binding
    })
    U.assign(el, {
      swap(el) { // TODO: refactor
        const anchor = el.nextElementSibling, parent = el.parentElement
        replaceWith(this, el)
        anchor ? anchor.before(this) : parent.prepend(this)
        // TODO add flags (2nd args) to enable swapping: attributes/props, style, and css; including reactive vars
      },
      dispose() { // WARNING: prioritize fast creating element even it make dispose()/swap() slow
        U.forEach(this[bindAttrs], name =>
          U.removeItem(props[name][bindAttrs], this, 2))
        this.remove()
      }
    })
    return el
  },

  createProxy = (nsURI, t = {}, doc) => U.proxy(t, {
    get: (t, p) => t[p] ??= U.bind(createElement, K.VOID, nsURI, doc, p)
  }),

  createNodeList = (list
    , liveNodes = fragment(...list).childNodes
    , siblings = U.map(U.arrayFrom(liveNodes), t => [prevSibling(t), nextSibling(t)])
  ) => U.assign(liveNodes, {
    swap(el) {
      let anchor
      U.forEachGroup(this,
        // group by siblingNode or parentElement
        (t, i, l
          , [prev, next] = siblings[i]
          , tPrev = prevSibling(t)
          , tNext = nextSibling(t)
        ) => prev !== U.at(l, i - 1) && tPrev ? tPrev
            : next !== U.at(l, i + 1) && tNext ? tNext
              : parentElement(t),

        (g, k) => U.forEach(g[k], (t, i) => // swap group
          i ? anchor.after(t) : replaceWith(anchor = t, el)
        ))
    },
    dispose() {
      U.forEach(this, t => { // TODO: refactor
        U.removeItem(t[bindTexts], t)
        t.remove()
      })
    }
  }),

  bindText = (data, text = new Text) => (
    data[bindTexts] || bind(data,
      value => U.forEach(data[bindTexts], text => text.data = value))
    , U.push(data[bindTexts] ??= [], text)
    , U.assign(text, { data, [bindTexts]: data }))

// TODO: refactor as class
// Why? It make it easier to implement fun-runtime.dev.js for HMR by patching dispose() method

export const
  [html, svg] = U.map([HTML, SVG], nsURI =>
    createProxy(nsURI,
      document => cache.get(document) ?? cache
        .set(document, createProxy(nsURI, {}, document))
        .get(document)
    )),

  fragment = (...children) => // WARNING: don't f.normalize(), it breaks the reactive binding
    (f => (f.append(...children), f))(new DocumentFragment),

  text = (strings, ...vars) => U.isArray(strings)
    ? createNodeList(U.flatMap(strings
      , (s, i, _, v = vars[i], t = isReactive(v) ? bindText(v) : v) =>
        s ? t ? [s, t] : [s] : t ? [t] : []))
    : U.assign(isReactive(strings)
      ? bindText(strings)
      : new Text(strings), {
      swap(el) { // TODO: refactor
        const anchor = el.nextElementSibling, parent = el.parentElement
        replaceWith(this, el)
        anchor ? anchor.before(this) : parent.prepend(this)
      },
      dispose() { // TODO: refactor
        U.removeItem(this[bindTexts], this)
        this.remove()
      }
    })

/* Food for Though
* https://stackoverflow.com/questions/43349975/native-htmlelement-properties-observer
*/
