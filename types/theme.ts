export const ThemeColors = {
    parchment: {
        50: "#fdfaf5",
        100: "#f8f2e4",
        200: "#f0e4c8",
        300: "#e6d1a8",
        400: "#d9bc85",
        500: "#caa660",
    },
    sage: {
        50: "#f4f7f4",
        100: "#e4ede4",
        200: "#c6dac6",
        300: "#9dbf9d",
        400: "#72a072",
        500: "#4d7f4d",
        600: "#3a6b3a",
    },
    dusty: {
        50: "#f5f4f8",
        100: "#eae8f2",
        200: "#d4d0e5",
        300: "#b5afd0",
        400: "#9188b8",
        500: "#6e639e",
        600: "#554b82",
        700: "#3f3666",
    },
    terracotta: {
        50: "#fdf5f2",
        100: "#f9e6de",
        200: "#f1c8b5",
        300: "#e4a285",
        400: "#d4775a",
        500: "#c05535",
        600: "#a03e22",
    },
    slateWarm: {
        50: "#f8f7f5",
        100: "#edecea",
        200: "#d6d3cf",
        300: "#b5b0aa",
        400: "#8f887f",
        500: "#6b6259",
        600: "#524b42",
        700: "#3a342c",
        800: "#272118",
        900: "#17120c",
    }
} as const;

export type ThemeColorName = keyof typeof ThemeColors;
