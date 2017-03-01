const path = require('path')
const execa = require('execa')
const Listr = require('listr')
const findDirPath = require('find-dir-path')
const pathExists = require('path-exists')

module.exports = opts => {
  const repositoryDir = findDirPath.sync('.git')

  const tasks = [
    {
      title: 'Ensure project is git repository',
      task: () => {
        if (!repositoryDir) {
          throw new Error(`Not a git repository, init and config first.`)
        }
      }
    },
    {
      title: 'Ensure .gitignore exists in project root path',
      task: () => {
        if (!pathExists.sync(path.resolve(repositoryDir, '.gitignore'))) {
          throw new Error(`No '.gitignore' file in ${repositoryDir}, add one or use --no-check-ignore.`)
        }
      }
    },
    {
      title: 'Check current branch',
      task: () => execa.stdout('git', ['symbolic-ref', '--short', 'HEAD'])
        .then(branch => {
          if (branch !== 'master') {
            throw new Error('Not on `master` branch. Use --any-branch to publish anyway.')
          }
        })
    },
    {
      title: 'Check local working tree',
      task: () => execa.stdout('git', ['status', '--porcelain'])
        .then(status => {
          if (status === '') {
            throw new Error('Clean working tree. Nothing to commit.')
          }
        })
    },
    {
      title: 'Add file contents to the index',
      task: () => execa.stdout('git', ['add', '-A'])
        .then(status => {
          if (status !== '') {
            throw new Error(`Add file error: ${status}.`)
          }
        })
    },
    {
      title: 'Record changes to the repository',
      task: () => execa.stdout('git', ['commit', '-m', opts.commitMessage || 'make it better', '--quiet'])
        .then(status => {
          if (status !== '') {
            throw new Error(`Record changes error: ${status}`)
          }
        })
    },
    {
      title: 'Check remote history',
      task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD'])
        .then(status => {
          if (status !== '0') {
            throw new Error('Remote history differs. Please pull changes.')
          }
        })
    },
    {
      title: 'Push remote refs along with associated objects',
      task: () => execa.stdout('git', ['push', '--quiet'].concat(opts.pushOptions ? opts.pushOptions.split(' ') : []))
        .then(result => {
          if (result !== '') {
            throw new Error(`Push error: ${result}`)
          }
        })
    }
  ]

  if (!opts.checkIgnore) {
    tasks.splice(1, 1)
  }
  if (opts.anyBranch) {
    tasks.splice(2, 1)
  }
  if (!opts.push) {
    tasks.pop()
  }

  return new Listr(tasks)
}
