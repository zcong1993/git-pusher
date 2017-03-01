# git-pusher

[![NPM version](https://img.shields.io/npm/v/git-pusher.svg?style=flat)](https://npmjs.com/package/git-pusher) [![NPM downloads](https://img.shields.io/npm/dm/git-pusher.svg?style=flat)](https://npmjs.com/package/git-pusher) [![Build Status](https://img.shields.io/circleci/project/zcong1993/git-pusher/master.svg?style=flat)](https://circleci.com/gh/zcong1993/git-pusher)

> easy way to commit git

> project template [egoist/template-nm](https://github.com/egoist/template-nm)

## Install

```bash
yarn global add git-pusher
```

## Usage

```bash
$ git-pusher [options]
```

### Options

#### --commit-message, -m
type: string

default: 'make it better'

commit message

#### --any-branch, -a
type: bool

default: false

working with any branch, default only for 'master'

#### --no-check-ignore
type: bool

default: false

not check whether '.gitignore' exists in project root folder, be careful when set true

#### --push, -p
type: bool

default: false

commit and push

#### --push-options
type: string

default: null

extra push options, the push command bacome `git push --quiet options` if set

#### --first, -f
type: bool

default: false

no check remote history, can use like this `git-pusher -f --push-options="-u origin master"`

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**git-pusher** © [zcong1993](https://github.com/zcong1993), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by zcong1993 with help from contributors ([list](https://github.com/zcong1993/git-pusher/contributors)).

> [github.com/zcong1993](https://github.com/zcong1993) · GitHub [@zcong1993](https://github.com/zcong1993)
