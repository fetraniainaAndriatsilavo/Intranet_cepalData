// utils/Utils.js

export const formatValue = (value) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const formatThousands = (value) =>
  Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const getCssVariable = (variable) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};

// Adjust hex opacity with 3- or 6-digit hex support
const adjustHexOpacity = (hexColor, opacity) => {
  hexColor = hexColor.replace("#", "").trim();

  if (hexColor.length === 3) {
    hexColor = hexColor
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }

  if (hexColor.length !== 6) {
    throw new Error(`Invalid hex color format: ${hexColor}`);
  }

  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Adjust hsl -> hsla
const adjustHSLOpacity = (hslColor, opacity) => {
  return hslColor.replace("hsl(", "hsla(").replace(")", `, ${opacity})`);
};

// Adjust oklch with /
const adjustOKLCHOpacity = (oklchColor, opacity) => {
  return oklchColor.replace(
    /oklch\((.*?)\)/,
    (match, p1) => `oklch(${p1} / ${opacity})`
  );
};

// NEW: Adjust rgb(a) to rgba with updated opacity
const adjustRGBOpacity = (rgbColor, opacity) => {
  const values = rgbColor.match(/\d+/g);
  if (values && values.length >= 3) {
    const [r, g, b] = values;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  throw new Error(`Invalid rgb color format: ${rgbColor}`);
};

// Main function to adjust opacity of any supported color
export const adjustColorOpacity = (color, opacity) => {
  if (!color || typeof color !== "string") {
    throw new Error("Unsupported color format: empty or non-string");
  }

  color = color.trim();

  if (color.startsWith("#")) {
    return adjustHexOpacity(color, opacity);
  } else if (color.startsWith("hsl")) {
    return adjustHSLOpacity(color, opacity);
  } else if (color.startsWith("oklch")) {
    return adjustOKLCHOpacity(color, opacity);
  } else if (color.startsWith("rgb")) {
    return adjustRGBOpacity(color, opacity);
  }

  throw new Error(`Unsupported color format: ${color}`);
};

// Convert OKLCH to RGB (browser-based trick)
export const oklchToRGBA = (oklchColor) => {
  const tempDiv = document.createElement("div");
  tempDiv.style.color = oklchColor;
  document.body.appendChild(tempDiv);

  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);

  return computedColor;
};
