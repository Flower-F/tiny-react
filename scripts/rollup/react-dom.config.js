import { defineConfig } from 'rollup';
import generatePackageJsonPlugin from 'rollup-plugin-generate-package-json';
import aliasPlugin from '@rollup/plugin-alias';
import { getPackageJson, resolvePackagePath, getBasicRollupPlugins } from './utils';

const { name } = getPackageJson('react-dom');
const packagePath = resolvePackagePath(name);
const distPath = resolvePackagePath(name, true);

export default defineConfig([
  // react
  {
    input: `${packagePath}/index.ts`,
    output: [
      {
        file: `${distPath}/index.js`,
        name: 'index.js',
        format: 'umd',
      },
      {
        file: `${distPath}/client.js`,
        name: 'client.js',
        format: 'umd',
      },
    ],
    plugins: [
      ...getBasicRollupPlugins(),
      aliasPlugin({
        entries: {
          hostConfig: `${packagePath}/src/hostConfig.ts`,
        },
      }),
      generatePackageJsonPlugin({
        inputFolder: packagePath,
        outputFolder: distPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          peerDependencies: {
            react: version,
          },
          main: 'index.js',
        }),
      }),
    ],
  },
]);
