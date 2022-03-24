import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/aurelia-templating-resources.ts',
    output: [
      {
        file: 'dist/es2015/aurelia-templating-resources.js',
        format: 'esm'
      }
    ],
    plugins: [
      typescript({
        removeComments: true,
      })
    ]
  },
  {
    input: 'src/aurelia-templating-resources.ts',
    output: [{
      file: 'dist/es2017/aurelia-templating-resources.js',
      format: 'esm'
    }],
    plugins: [
      typescript({
        target: 'es2017',
        removeComments: true,
      })
    ]
  },
  {
    input: 'src/aurelia-templating-resources.ts',
    output: [
      { file: 'dist/amd/aurelia-templating-resources.js', format: 'amd', amd: { id: 'aurelia-templating-resources' } },
      { file: 'dist/commonjs/aurelia-templating-resources.js', format: 'cjs' },
      { file: 'dist/system/aurelia-templating-resources.js', format: 'system' },
      { file: 'dist/native-modules/aurelia-templating-resources.js', format: 'esm' },
    ],
    plugins: [
      typescript({
        target: 'es5',
        removeComments: true,
      })
    ]
  }
].map(config => {
  config.external = [
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-pal',
    'aurelia-templating',
    'aurelia-templating-resources',
    'aurelia-task-queue',
    'aurelia-logging',
    'aurelia-path',
    'aurelia-loader',
    'aurelia-metadata'
  ];
  config.output.forEach(output => output.sourcemap = true);
  return config;
});
