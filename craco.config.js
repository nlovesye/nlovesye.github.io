const { resolve } = require('path');
const CracoLessPlugin = require('craco-less');
const { whenProd } = require('@craco/craco');
const { theme } = require('antd');
const customTheme = require('./src/config/theme/default.json');

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        modifyLessRule: () => {
          return {
            test: /\.less$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: 'ns-[path][name]__[local]',
                  },
                },
              },
              {
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    modifyVars: { ...mapToken, ...customTheme.token },
                  },
                },
              },
            ],
          };
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },

    configure: (webpackConfig, { paths }) => {
      webpackConfig.resolve.fallback = {
        crypto: false,
      };

      const publicPath = whenProd(() => '/build/', '/');
      webpackConfig.output = {
        ...webpackConfig.output,
        path: resolve(__dirname, 'build'),
        publicPath,
      };

      return webpackConfig;
    },
  },
};

function resolveDir(...paths) {
  return resolve(__dirname, ...paths);
}
