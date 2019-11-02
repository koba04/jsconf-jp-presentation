module.exports = {
  extends: "@cybozu/eslint-config/presets/react-typescript-prettier",
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/no-unescaped-entities": "off"
  }
}
