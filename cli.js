const tasks = require('./')

const opts = {push: true, commitMessage: 'init'}

tasks(opts)
  .run()
  .catch(err => console.log(err.message))
