const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Add asset extensions
config.resolver.assetExts = [...config.resolver.assetExts, 'ttf', 'png', 'jpg'];

module.exports = withNativeWind(config, { 
  input: './app/global.css',
  projectRoot: __dirname,
  configPath: 'tailwind.config.js',
});