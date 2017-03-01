const meow = require('meow')
const chalk = require('chalk')
const tasks = require('./')

const blue = chalk.blue
const bold = chalk.bold
const dim = chalk.dim
const green = chalk.green

const {input, flags} = meow({
  description: false,
  help: `
    ${green('easy way to commit git')}

    ${bold('Usage:')}

      ${green('$ git-pusher [options]')}

    ${bold('Options:')}

      ${blue('--commit-message, -m')} ${dim(`# commit message, default is 'make it better'`)}

      ${blue('--any-branch, -a')}     ${dim(`# working in any branch, default is 'master'`)}

      ${blue('--no-check-ignore')}    ${dim(`# not check if has '.gitignore' in root folder`)}

      ${blue('--push, -p')}           ${dim(`# with push`)}

      ${blue('--push-options')}       ${dim(`# extra push options`)}

      ${blue('--first, -f')}          ${dim(`# not check remote history, can use like this 'git-pusher -f --push-options="-u origin master"'`)}
  `
}, {
  alias: {
    h: 'help',
    v: 'version',
    m: 'commitMessage',
    a: 'anyBranch',
    p: 'push',
    f: 'first'
  }
})

tasks(flags)
  .run()
  .then(() => console.log(`\n ${chalk.gray.bgGreen.bold(success)} all done! \n`))
  .catch(err => console.log(`\n ${chalk.gray.bgRed.bold(error)} ${err.message} \n`))
