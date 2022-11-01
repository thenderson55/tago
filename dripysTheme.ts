import {makeTheme} from 'dripsy';

const theme = makeTheme({
  colors: {
    primary: 'orange',
    secondary: 'black',
    background: 'white',
    callout: 'pink',
    accent: 'green',
    muted: 'gray',
    warning: 'yellow',
    error: 'red',
    gray: '#888',
  },
  space: {
    $none: 0,
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 16,
    $4: 32,
    $5: 64,
    $6: 128,
    $7: 256,
    $8: 512,
  },
  types: {
    onlyAllowThemeValues: {
      // let's only restrict colors!
      // colors: 'always',
      space: 'always',
    },
    // strictVariants: true,
  },
  shadows: {
    md: {
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.8,
      shadowRadius: 14,
      elevation: 25,
      shadowColor: 'background',
    },
  },
  text: {
    primary: {
      fontSize: 40,
    },
    secondary: {
      fontSize: 60,
    },
  },
  sizes: {
    container: 700,
  },
  buttons: {
    primary: {
      backgroundColor: 'primary',
    },
  },
  textShadows: {
    onImage: {
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 5,
      textShadowColor: 'gray',
    },
  },
  linearGradients: {
    strong: ['primary', 'secondary'],
    light: ['red', 'green'],
  },
  layout: {
    wide: {},
    narrow: {},
  },
  fontWeights: {
    black: '500',
  },
});

type MyTheme = typeof theme;
declare module 'dripsy' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DripsyCustomTheme extends MyTheme {}
}
