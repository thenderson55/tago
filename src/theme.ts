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
    light: string;
    medium: string;
    bright: string;
    white: string;
    grey: string;
    lightGrey: string;
    darkGrey: string;
    black: string;
    magenta: string;
  };
  fontSizes: {
    small: number;
    label: number;
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
    mediumTop: number;
    largeTop: number;
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
    white: '#fff',
    // https://coolors.co/d9e5d6-00a7e1-eddea4-f7a072-ff9b42
    primary: '#F7A072',
    secondary: '#00A7E1',
    light: '#D9E5D6',
    medium: '#EDDEA4',
    bright: '#FF9B42',
    background: '#f6f6f6',
    grey: '#b4b4b4',
    lightGrey: '#dadada',
    darkGrey: '#9b9b9b',
    black: '#000',
    magenta: '#ff00ff',
  },
  margins: {
    screen: 20,
    mediumTop: 20,
    largeTop: 50,
  },
  padding: {
    input: 20,
  },
  sizes: {
    formHeight: 50,
  },
  fontSizes: {
    small: 12,
    label: 14,
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
