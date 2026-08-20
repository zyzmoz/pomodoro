import {
  DEFAULT_THEME_COLORS,
  getContrastRatio,
  getThemeColors,
} from "../../src/helpers/colors";

describe("getThemeColors", () => {
  it("creates secondary and tertiary colors with at least 4.5:1 contrast", () => {
    const colors = getThemeColors("#D8737F");

    expect(colors.primary).toBe("#D8737F");
    expect(getContrastRatio(colors.primary, colors.secondary)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(colors.primary, colors.tertiary)).toBeGreaterThanOrEqual(4.5);
  });

  it("uses the default palette for an invalid primary color", () => {
    expect(getThemeColors("not-a-color")).toEqual(DEFAULT_THEME_COLORS);
  });

  it("keeps accessible manually selected secondary and tertiary colors", () => {
    expect(getThemeColors("#D8737F", "#111111", "#000000")).toEqual({
      primary: "#D8737F",
      secondary: "#111111",
      tertiary: "#000000",
    });
  });

  it("uses calculated colors when a custom color has insufficient contrast", () => {
    expect(getThemeColors("#D8737F", "#D8737F", "#D8737F")).toEqual(
      DEFAULT_THEME_COLORS
    );
  });
});
