const path = require('path')
const execa = require('execa')
const Listr = require('listr')
const findDirPath = require('find-dir-path')
const pathExists = require('path-exists')
const getEmoji = require('./emoji')

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
    skip: ctx => !ctx.checkIgnore,
    task: () => {
      if (!pathExists.sync(path.resolve(repositoryDir, '.gitignore'))) {
        throw new Error(`No '.gitignore' file in ${repositoryDir}, add one or use --no-check-ignore.`)
      }
    }
  },
  {
    title: 'Check current branch',
    skip: ctx => ctx.anyBranch,
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
    task: ctx => {
      ctx.finalCommit = ctx.emoji ? ctx.commitMessage + getEmoji() : ctx.commitMessage
      execa.stdout('git', ['commit', '-m', ctx.finalCommit || 'make it better', '--quiet'])
      .then(status => {
        if (status !== '') {
          throw new Error(`Record changes error: ${status}`)
        }
      })
    }
  },
  {
    title: 'Check remote history',
    skip: ctx => ctx.first || !ctx.push,
    task: () => execa.stdout('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD'])
      .then(status => {
        if (status !== '0') {
          throw new Error('Remote history differs. Please pull changes.')
        }
      })
  },
  {
    title: 'Push remote refs along with associated objects',
    skip: ctx => !ctx.push,
    task: ctx => execa.stdout('git', ['push', '--quiet'].concat(ctx.pushOptions ? ctx.pushOptions.split(' ') : []))
      .then(result => {
        if (result !== '') {
          throw new Error(`Push error: ${result}`)
        }
      })
  }
]

module.exports = new Listr(tasks)
