module.exports = {
  init: [
    'src/projects/projectName/**',
    'src/assets/projects/projectName/**'
  ],
  project: [ // template/src
    'styles/**',
    'projects/demo/**',
    'projects/projectName/pages/**',
    'assets/*',
    'assets/js/**',
    'assets/css/**'
  ],
  page: [ // template/src/projects/projectName
    'sprites/**',
    '*'
  ]
};
