interface BoxShadow {
  shadowColor: string;
  shadowOffset: {width: number; height: number};
  shadowRadius: number;
  shadowOpacity: number;
  elevation: number;
}

interface ThemeStyles {
  colors: {
    text: string;
    background: string;
    primary: string;
    secondary: string;
    muted: string;
    grey: string;
    lightGrey: string;
    darkGrey: string;
    black: string;
  };
  fontSizes: {
    small: number;
    medium: number;
    large: number;
  };
  fontWeights: {
    body: number;
    heading: number;
    bold: number;
  };
  lineHeights: {
    body: number;
    heading: number;
  };
  margins: {
    screen: number;
    buttonTop: number;
  };
  padding: {
    input: number;
  };
  boxShadows: {
    light: BoxShadow;
    medium: BoxShadow;
  };
  sizes: {
    formHeight: number;
  };
  text: {
    h1: {
      // fontFamily: string;
      lineHeight: number;
      fontWeight: number;
      fontSize: number;
    };
  };
}

const theme: ThemeStyles = {
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#07c',
    secondary: '#30c',
    muted: '#f6f6f6',
    grey: '#b4b4b4',
    lightGrey: '#dadada',
    darkGrey: '#9b9b9b',
    black: '#000',
  },
  margins: {
    screen: 20,
    buttonTop: 20,
  },
  padding: {
    input: 20,
  },
  sizes: {
    formHeight: 50,
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 24,
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  boxShadows: {
    light: {
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 3,
      shadowOpacity: 0.26,
      elevation: 3,
    },
    medium: {
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 6,
      shadowOpacity: 0.26,
      elevation: 6,
    },
  },
  text: {
    h1: {
      // fontFamily: 'heading',
      lineHeight: 1.25,
      fontWeight: 700,
      fontSize: 24,
    },
  },
};

export default theme;
