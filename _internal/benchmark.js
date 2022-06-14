const { assign, defineProperties } = Object
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
  }, { only: groupName => assign(group(groupName), { only: true }) }),

  as = group(),

  { bench } = Deno
