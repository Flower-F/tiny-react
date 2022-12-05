import { defineConfig } from 'rollup';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import { getPackageJson, resolvePackagePath, getBasicRollupPlugins } from './utils';

const { name } = getPackageJson('react');
const packagePath = resolvePackagePath(name);
const distPath = resolvePackagePath(name, true);

export default defineConfig([
  // react
  {
    input: `${packagePath}/index.ts`,
    output: {
      file: `${distPath}/index.js`,
      name: 'index.js',
      format: 'umd',
    },
    plugins: [
      ...getBasicRollupPlugins(),
      generatePackageJson({
        inputFolder: packagePath,
        outputFolder: distPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
        }),
      }),
    ],
  },
  // jsx-runtime
  {
    input: `${packagePath}/src/jsx.ts`,
    output: [
      // jsx-runtime
      {
        file: `${distPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        format: 'umd',
      },
      // jsx-dev-runtime
      {
        file: `${distPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        format: 'umd',
      },
    ],
    plugins: getBasicRollupPlugins(),
  },
]);
