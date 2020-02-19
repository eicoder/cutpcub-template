module.exports = {
  project: {
    assets: {
      pattern: 'assets/projects/projectName/**',
      folder: {
        regExp: /projectName/g,
        rename: '[projectName]'
      }
    },
    projects: {
      pattern: 'projects/projectName/**',
      folder: {
        regExp: /projectName/g,
        rename: '[projectName]'
      }
    }
  }
};
