export type ThemeColors = {
  primary: string;
  secondary: string;
  tertiary: string;
};

type RgbColor = {
  blue: number;
  green: number;
  red: number;
};

export const DEFAULT_PRIMARY_COLOR = "#D8737F";
const MINIMUM_CONTRAST_RATIO = 4.5;
const BLACK = "#000000";
const WHITE = "#FFFFFF";

const normalizeHexColor = (color: string): string | null => {
  const normalizedColor = color.toUpperCase();
  return /^#[0-9A-F]{6}$/.test(normalizedColor) ? normalizedColor : null;
};

const hexToRgb = (color: string): RgbColor | null => {
  const normalizedColor = normalizeHexColor(color);

  if (!normalizedColor) {
    return null;
  }

  return {
    red: Number.parseInt(normalizedColor.slice(1, 3), 16),
    green: Number.parseInt(normalizedColor.slice(3, 5), 16),
    blue: Number.parseInt(normalizedColor.slice(5, 7), 16),
  };
};

const rgbToHex = ({ red, green, blue }: RgbColor): string => {
  const toHex = (value: number): string => Math.round(value).toString(16).padStart(2, "0");
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`.toUpperCase();
};

const getLuminance = (color: string): number => {
  const rgbColor = hexToRgb(color);

  if (!rgbColor) {
    return 0;
  }

  const toLinear = (value: number): number => {
    const normalizedValue = value / 255;
    return normalizedValue <= 0.03928
      ? normalizedValue / 12.92
      : ((normalizedValue + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * toLinear(rgbColor.red) +
    0.7152 * toLinear(rgbColor.green) +
    0.0722 * toLinear(rgbColor.blue)
  );
};

export const getContrastRatio = (firstColor: string, secondColor: string): number => {
  const firstLuminance = getLuminance(firstColor);
  const secondLuminance = getLuminance(secondColor);
  const lighterLuminance = Math.max(firstLuminance, secondLuminance);
  const darkerLuminance = Math.min(firstLuminance, secondLuminance);

  return (lighterLuminance + 0.05) / (darkerLuminance + 0.05);
};

const mixColors = (firstColor: string, secondColor: string, amount: number): string => {
  const firstRgb = hexToRgb(firstColor);
  const secondRgb = hexToRgb(secondColor);

  if (!firstRgb || !secondRgb) {
    return firstColor;
  }

  const mix = (firstValue: number, secondValue: number): number =>
    firstValue + (secondValue - firstValue) * amount;

  return rgbToHex({
    red: mix(firstRgb.red, secondRgb.red),
    green: mix(firstRgb.green, secondRgb.green),
    blue: mix(firstRgb.blue, secondRgb.blue),
  });
};

const getHighestContrastColor = (primary: string): string =>
  getContrastRatio(primary, BLACK) >= getContrastRatio(primary, WHITE)
    ? BLACK
    : WHITE;

const getColorAtMinimumContrast = (primary: string, contrastingColor: string): string => {
  for (let step = 1; step <= 1000; step += 1) {
    const color = mixColors(primary, contrastingColor, step / 1000);

    if (getContrastRatio(primary, color) >= MINIMUM_CONTRAST_RATIO) {
      return color;
    }
  }

  return contrastingColor;
};

const getAccessibleColor = (
  primary: string,
  customColor: string | undefined,
  fallbackColor: string
): string => {
  const normalizedColor = normalizeHexColor(customColor ?? "");

  return normalizedColor && getContrastRatio(primary, normalizedColor) >= MINIMUM_CONTRAST_RATIO
    ? normalizedColor
    : fallbackColor;
};

export const getThemeColors = (
  primaryColor: string,
  secondaryColor?: string,
  tertiaryColor?: string
): ThemeColors => {
  const primary = normalizeHexColor(primaryColor);

  if (!primary) {
    return DEFAULT_THEME_COLORS;
  }

  const tertiary = getHighestContrastColor(primary);
  const secondary = getColorAtMinimumContrast(primary, tertiary);

  return {
    primary,
    secondary: getAccessibleColor(primary, secondaryColor, secondary),
    tertiary: getAccessibleColor(primary, tertiaryColor, tertiary),
  };
};

export const DEFAULT_THEME_COLORS = getThemeColors(DEFAULT_PRIMARY_COLOR);
