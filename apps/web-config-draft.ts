// Tailwind config based on Stitch design system
export const tailwindConfig = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Design tokens from Stitch
        "secondary-fixed-dim": "#c8c6c5",
        "outline-variant": "#4d4732",
        "on-surface": "#e5e2e1",
        "on-secondary-fixed-variant": "#474746",
        "surface-container-lowest": "#0e0e0e",
        "outline": "#999077",
        "primary-fixed-dim": "#e9c400",
        "inverse-primary": "#705d00",
        "on-primary-fixed-variant": "#544600",
        "surface-container-highest": "#353534",
        "surface-bright": "#393939",
        "surface-dim": "#131313",
        "secondary": "#c8c6c5",
        "surface-container-low": "#1c1b1b",
        "on-tertiary": "#303030",
        "on-secondary": "#303030",
        "primary": "#fff6df",
        "inverse-on-surface": "#313030",
        "on-primary-container": "#705e00",
        "error": "#ffb4ab",
        "on-error-container": "#ffdad6",
        "surface": "#131313",
        "tertiary-container": "#dcd9d9",
        "surface-variant": "#353534",
        "background": "#131313",
        "tertiary": "#f8f6f5",
        "on-primary": "#3a3000",
        "tertiary-fixed-dim": "#c8c6c5",
        "tertiary-fixed": "#e4e2e1",
        "secondary-fixed": "#e5e2e1",
        "inverse-surface": "#e5e2e1",
        "on-tertiary-container": "#5f5f5f",
        "on-tertiary-fixed-variant": "#474746",
        "on-surface-variant": "#d0c6ab",
        "on-primary-fixed": "#221b00",
        "on-secondary-fixed": "#1b1b1c",
        "surface-tint": "#e9c400",
        "surface-container-high": "#2a2a2a",
        "on-secondary-container": "#b7b5b4",
        "primary-container": "#ffd700",
        "on-tertiary-fixed": "#1b1c1c",
        "surface-container": "#201f1f",
        "primary-fixed": "#ffe16d",
        "on-background": "#e5e2e1",
        "error-container": "#93000a",
        "secondary-container": "#474746",
        "on-error": "#690005"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "stack-sm": "0.5rem",
        "margin-desktop": "4rem",
        "gutter": "1.5rem",
        "stack-lg": "3rem",
        "margin-mobile": "1.25rem",
        "stack-md": "1.5rem"
      },
      fontFamily: {
        "label-sm": ["Inter", "sans-serif"],
        "headline-md": ["Montserrat", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Montserrat", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg": ["Montserrat", "sans-serif"]
      },
      fontSize: {
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "display-lg-mobile": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    }
  }
};
