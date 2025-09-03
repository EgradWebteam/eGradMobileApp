module.exports = {
    root: true,
  extends: '@react-native',
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,  // ✅ This line disables the strict requirement
    babelOptions: {
      presets: ['module:metro-react-native-babel-preset'],
    },
  },

};
