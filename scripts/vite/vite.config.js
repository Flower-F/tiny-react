import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import replacePlugin from '@rollup/plugin-replace';
import { resolvePackagePath } from '../rollup/utils';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: 'react',
        replacement: resolvePackagePath('react'),
      },
      {
        find: 'react-dom',
        replacement: resolvePackagePath('react-dom'),
      },
      {
        find: 'hostConfig',
        replacement: path.resolve(resolvePackagePath('react-dom'), 'src/client/hostConfig.ts'),
      },
    ],
  },
  plugins: [react(), replacePlugin({ __DEV__: true, preventAssignment: true })],
});
