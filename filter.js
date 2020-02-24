module.exports = {
  init: [
    'src/projects/**',
    'src/assets/projects/**'
  ],
  project: [ // template/src
    'styles/**',
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
