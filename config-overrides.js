const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.(jpe?g|png|gif)$/i,
    use: [
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 75
          },
          optipng: {
            enabled: false
          },
          pngquant: {
            quality: [0.65, 0.90],
            speed: 4
          },
          gifsicle: {
            interlaced: false
          },
          webp: {
            quality: 75
          }
        }
      }
    ]
  }),
  addWebpackModuleRule({
    test: /\.(png|jpe?g)$/i,
    use: [
      {
        loader: 'webp-loader',
        options: {
          quality: 70
        }
      }
    ]
  })
);
