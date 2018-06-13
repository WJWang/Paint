// https://eslint.org/docs/user-guide/configuring

module.exports = {
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
    }
  },
  "plugins": [
    "react",
    "flowtype",
  ],
  "globals": {
    "document": false,
    "localStorage": false,
    "fetch": false,
    "alert": false,
    "window": false,
    "React$Element": false,
    "ReactClass": false,
    "API_HOST": false,
    "FormData": false,
    "Image": false,
    "S3_ZONE": false,
    "S3_BUCKET": false,
    "location": false,
  },
  "parser": "babel-eslint",
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended",
  ],
  "rules": {
    "no-underscore-dangle": [2, {
      "allow": [
        "_id",
      ],
    }],
    "no-bitwise": [2, {
      "allow": ["~"],
      "int32Hint": true,
    }],
    "global-require": [0],
    "react/no-unused-prop-types": [0],
    "react/jsx-closing-bracket-location": [2, {
      "nonEmpty": "after-props",
      "selfClosing": "after-props",
    }],
    "react/jsx-filename-extension": [0],
    "comma-dangle": [2, "always-multiline"],
    "import/extensions": [0],
    "import/no-mutable-exports": [0],
    "no-use-before-define": [2, {
      "functions": false,
    }],
    "no-console": [2, {
      "allow": [
        "error",
      ],
    }],
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "0.15.4",
    },
  }
}
