const presets = [
  [
    '@babel/env',
    {
      modules: false,
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
      }
    }
  ]
];

module.exports = {
  presets,
  env: {
    test: {
      presets: [
        [
          '@babel/env',
          {
            targets: { node: 'current' }
          }
        ]
      ]
    }
  },
  exclude: 'node_modules/**'
};
