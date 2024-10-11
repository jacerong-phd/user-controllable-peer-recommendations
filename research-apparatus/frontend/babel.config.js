module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      'module:metro-react-native-babel-preset'
    ],
    plugins: [
      'react-native-paper/babel',
      'module:react-native-dotenv',
      [
        'module-resolver',
        {
          'root': ['./src'],
          'extensions': ['.ios.js', '.android.js', '.js', '.json'],
          'alias': {
            '@assets': './src/assets',
            '@components': './src/components',
            '@navigations': './src/navigations',
            '@screens': './src/screens',
            '@services': './src/services',
            '@styles': './src/styles',
            '@utils': './src/utils'
          },
        },
      ],
    ],
  };
};
