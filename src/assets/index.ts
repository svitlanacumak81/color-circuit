/**
 * Re-export AI-generated (or procedural-fallback) PNG assets. The pipeline's
 * asset step always produces these files before the build, so require() is safe.
 */
export const Assets = {
  icon: require('../../assets/icon_1024.png'),
  bgLoader: require('../../assets/bg_loader.png'),
  bgMenu: require('../../assets/bg_menu.png'),
  bgGame: require('../../assets/bg_game.png'),
};
