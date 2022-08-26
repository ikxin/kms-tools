// prettier.config.js or .prettierrc.js
module.exports = {
  useTabs: false,
  tabWidth: 2,
  printWidth: 160,
  singleQuote: true,
  trailingComma: 'none',
  semi: false,
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.js'
}
