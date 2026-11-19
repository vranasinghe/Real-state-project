module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime', 'plugin:react-hooks/recommended'],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs', 'tailwind.config.js', 'postcss.config.js', 'vite.config.js'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: '18.3' } },
  overrides: [
    // React Three Fiber uses three.js props (roughness, metalness, ...) that look unknown to the DOM rule
    { files: ['src/components/three/**'], rules: { 'react/no-unknown-property': 'off' } },
  ],
  rules: {
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'no-unused-vars': ['error', { varsIgnorePattern: '^(React|_)', argsIgnorePattern: '^_' }],
    'react/no-unknown-property': ['error', { ignore: ['args', 'object', 'position', 'rotation', 'intensity', 'attach', 'castShadow', 'receiveShadow', 'geometry', 'material', 'fetchpriority'] }],
  },
};
