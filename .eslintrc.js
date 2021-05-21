module.exports = {
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "extends": [
    "airbnb-base",
    "react-app"
  ],
  "globals": {
    "document": true,
    "window": true,
    "allowTemplateLiterals": true
  },
  "settings": {
    "import/resolver": {
      "node": {
        "paths": [
          "./",
          "./src",
          "./server"
        ]
      }
    }
  },
  "reportUnusedDisableDirectives": true,
  "root": true,
  "rules": {
    "no-console": [
      1,
      {
        "allow": [
          "error",
          "info",
          "log"
        ]
      }
    ],
    "no-debugger": 1,
    "class-methods-use-this": 0,
    "linebreak-style": 0,
    "global-require": "off",
    "one-var": "off",
    "one-var-declaration-per-line": "off"
  }
}