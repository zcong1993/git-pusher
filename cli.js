const tasks = require('./')

const opts = {push: true, commitMessage: 'test'}

tasks(opts)
  .run()
  .catch(err => console.log(err.message))
