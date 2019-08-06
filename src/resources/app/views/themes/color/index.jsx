import Color from 'color'

const cache = {}

const toRgba = code => {
  if (cache[ code ]) {
    return cache[ code ]
  }

  cache[ code ] = new Color(code)

  return cache[ code ]
}

export default ({
  palettes,
  base,
  black,
  white,
  selector = 'hex'
}) => {
  const color = ({
    accent,
    alpha,
    autoGenerateVariants,
    palette,
    plain,
    on,
    value,
    variants
  }) => {
    const c = { ...plain }

    c.base = toRgba(
      c.base ||
      (
        (palette && value !== undefined) ?
          palettes[ palette ].colors[ value ][ selector ] :
          base
      )
    )

    if (alpha) {
      c.base = c.base.alpha(alpha)
    }

    if (variants) {
      if (variants.light && !c.light) {
        c.light = color({
          palette,
          value,
          ...variants.light
        })
      }

      if (variants.dark && !c.dark) {
        c.dark = color({
          palette,
          value,
          ...variants.dark
        })
      }

      if (variants.limpid && !c.limpid) {
        c.limpid = c.limpid || color({
          palette,
          value,
          ...variants.limpid
        })
      }

      if (variants.opaque && !c.opaque) {
        c.opaque = c.opaque || color({
          palette,
          value,
          ...variants.opaque
        })
      }
    }

    if (autoGenerateVariants) {
      c.light = c.light || color({
        plain,
        palette,
        value: (value <= 0) ? value : (value - 1)
      })

      c.dark = c.dark || color({
        plain,
        palette,
        value: (value >= 9) ? value : (value + 1)
      })

      c.limpid = c.limpid || color({
        plain,
        palette,
        value,
        alpha: .7
      })

      c.opaque = c.opaque || color({
        plain,
        palette,
        value,
        alpha: .3
      })
    }

    if (on) {
      c.on = c.on || color({
        palette,
        value,
        ...on
      })
    } else {
      c.on = c.on || {
        base: toRgba(
          new Color(c.base).isDark() ? white : black
        ).string()
      }
    }

    if (accent) {
      c.accent = c.accent || color({
        palette,
        value,
        ...accent
      })
    } else {
      c.accent = c.accent || {
        base: toRgba(
          new Color(c.base).negate()
        ).string()
      }
    }

    c.base = c.base.string()

    return c
  }

  return color
}
