import path from 'path';
import fs from 'fs';
import tsPlugin from 'rollup-plugin-typescript2';
import cjsPlugin from '@rollup/plugin-commonjs';
import replacePlugin from '@rollup/plugin-replace';

// basic path of packages
const packageRoot = path.resolve(__dirname, '../../packages');
// the path of production
const distPath = path.resolve(__dirname, '../../dist/node_modules');

/**
 * get the name of package
 * @param {string} packageName
 * @param {boolean} isDist
 * @returns {string}
 */
export function resolvePackagePath(packageName, isDist = false) {
  if (isDist) {
    return `${distPath}/${packageName}`;
  }
  return `${packageRoot}/${packageName}`;
}

/**
 * parse the package.json file
 * @param {string} packageName
 * @returns {object}
 */
export function getPackageJson(packageName) {
  const path = `${resolvePackagePath(packageName)}/package.json`;
  const str = fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(str);
}

/**
 * rollup configs
 * @param {object} typescript
 */
export function getBasicRollupPlugins(alias = { __DEV__: true, preventAssignment: true }, typescript = {}) {
  return [replacePlugin(alias), cjsPlugin(), tsPlugin(typescript)];
}
