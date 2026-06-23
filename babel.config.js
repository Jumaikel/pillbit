module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // NativeWind v4 requires jsxImportSource to be set here
          jsxImportSource: 'nativewind',
        },
      ],
    ],
    plugins: [
      // Reanimated plugin must be listed last
      'react-native-reanimated/plugin',
    ],
  };
};
