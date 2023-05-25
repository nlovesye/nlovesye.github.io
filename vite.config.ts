import { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { theme } from 'antd';

import customThemeVars from './src/styles/theme/default.json';
import globalVars from './src/styles/variables.json';

console.log('shit', process.env.DEPLOY);
const { DEPLOY_ENV } = process.env;

const isDeployNginx = 'nginx' === DEPLOY_ENV;

const { defaultAlgorithm, defaultSeed } = theme;

const antdLessVars = defaultAlgorithm(defaultSeed);

const server = {
  port: 9000,
  host: '0.0.0.0',
  open: true,
};

const restConfig = !isDeployNginx
  ? {
      root: 'src',
      publicDir: '../public',
      build: !isDeployNginx
        ? {
            outDir: '..',
            assetsDir: './assets',
          }
        : undefined,
    }
  : {};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      generateScopedName: 'ns-[path][name]__[local]',
    },
    preprocessorOptions: {
      less: {
        modifyVars: { ...antdLessVars, ...customThemeVars, ...globalVars },
      },
    },
  },
  server,
  ...restConfig,
});
