import ntc from 'ntc'
import palx from 'palx'
import treeify from 'treeify'

import makeColor from 'app/views/themes/color'

const base = '#09f'
const black = '#111'
const white = '#fff'

const p = palx(base)
const palettes = Object.keys(p)
  .filter(
    name => Array.isArray(p[name])
  )
  .reduce((palettes, name) => ({
    ...palettes,
    [ name ]: {
      name,
      colors: p[name].map(hex => {
        const [ closest, name ] = ntc.name(hex)

        return {
          closest: closest.toLowerCase(),
          hex,
          name
        }
      })
    }
  }), {})

const color = makeColor({
  palettes,
  base,
  black,
  white,
  selector: 'closest'
})

const theme = {
  // base
  black: color({
    plain: { base: black },
    autoGenerateVariants: true
  }),
  white: color({
    plain: {
      base: white
    },
    autoGenerateVariants: true
  }),

  // brand colors
  primary: color({
    palette: 'blue',
    value: 7,
    autoGenerateVariants: true
  }),
  secondary: color({
    palette: 'cyan',
    value: 8,
    autoGenerateVariants: true
  }),

  // background colors
  background: color({
    plain: { base: white },
    autoGenerateVariants: true
  }),
  surface: color({
    palette: 'blue',
    value: 1,
    autoGenerateVariants: true
  }),

  // semantic colors
  error: color({
    palette: 'red',
    value: 8,
    autoGenerateVariants: true
  }),
  warning: color({
    palette: 'orange',
    value: 6,
    autoGenerateVariants: true
  }),
  info: color({
    palette: 'blue',
    value: 3,
    autoGenerateVariants: true
  }),
  success: color({
    palette: 'blue',
    value: 7,
    autoGenerateVariants: true
  }),
  spacing: {
    tiny: '5px',
    small: '10px',
    medium: '20px',
    big: '30px',
    huge: '90px'
  },

  //detect mouse & touch
  mouseDetected: 'onmousemove' in window,
  touchDetected: 'ontouchstart' in window,

  //HOVER COLOR
  hoverColor: '#f5f5f5'
}

// add custom colors
theme.white.dark.base = 'rgb(227, 242, 253)'
theme.black.light = theme.black.limpid

console.debug(treeify.asTree(theme, true))
export { base, black, white, palettes }
export default theme
