const { assign, defineProperties } = Object
let warmupOnce, isHot
export const

  group = assign(group => {
    let standard
    return defineProperties({ ...group && { group } }, {
      standard: {
        get() {
          if (standard) throw `only 1 standard benchmark is allowed for "${group}" group`
          standard = true
          return this.criterion
        }
      },
      criterion: { get() { return assign(this, { baseline: true }) } },
      chosen: { get() { return assign(this, { only: true }) } },
    })
  }, {
    only(groupName) {
      const conf = assign(group(groupName), { only: true })
      if (warmupOnce) warmup({ only: true })
      warmupOnce = false
      return conf
    }
  }),

  as = group(),

  warmup = (as = {}) => {
    if (isHot) return
    warmupOnce = true
    bench(" ", as, () => { isHot = true })
    bench("no operation", as, () => {})
  },

  { bench } = Deno
