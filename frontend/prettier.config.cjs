module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@app/(.*)$',
    '^[./].*(?<!\\.(c|le|sc)ss)$',
    '\\.(c|le|sc)ss$'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};