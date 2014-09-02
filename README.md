<p align="center">
  <a href="http://bionode.io">
    <img height="200" width="200" title="bionode" alt="bionode logo" src="https://rawgithub.com/bionode/bionode/master/docs/bionode-logo.min.svg"/>
  </a>
  <br/>
  <a href="http://bionode.io/">bionode.io</a>
</p>
# bionode-seq
> Module for DNA, RNA and protein sequences manipulation.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Gitter chat][gitter-image]][gitter-url]

Install
-------

Install bionode-seq with [npm](//npmjs.org):

```sh
$ npm install bionode
```

Alternatively, just include `bionode-seq.min.js` via a `<script/>` in your page.


Usage
-----

You can require the module in Node.js or in the browser:

```js
var seq = require('bionode-seq')
```
Please read the [documentation](//rawgit.com/bionode/bionode-seq/master/docs/bionode-seq.html) for the methods exposed by bionode-seq.


Contributing
------------

To contribute, clone this repo locally and commit your code on a separate branch.

Please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
$ npm test
```

Please also check for code coverage:

```sh
$ npm run coverage
```

To rebuild and minify the module for the browser:

```sh
$ npm run build-browser
```

To rebuild the documentation using the comments in the code:

```sh
$ npm run build-docs
```
Check the [issues](http://github.com/bionode/bionode-seq/issues) for ways to contribute.

### Contributors
Please see the file [contributors.md](contributors.md) for a list.


Support
-------

If you find a bug please use the [issues](http://github.com/bionode/bionode-seq/issues) tracker to report it.  
If you need help with this particular module, you can use the respective [gitter](http://gitter.im/bionode/bionode-seq) chat room.  
For general help or discussion about the bionode project, you can use the IRC channel [#bionode](https://www.irccloud.com/#!/ircs://irc.freenode.net:6697/%23bionode) on Freenode.  


Contacts
--------

Bruno Vieira <[mail@bmpvieira.com](mailto:mail@bmpvieira.com)> [@bmpvieira](//twitter.com/bmpvieira)  


License
-------

bionode-seq is licensed under the [MIT](https://raw.github.com/bionode/bionode-seq/master/LICENSE) license.  
Check [ChooseALicense.com](http://choosealicense.com/licenses/mit) for details.


[npm-url]: http://npmjs.org/package/bionode-seq
[npm-image]: http://img.shields.io/npm/v/bionode-seq.svg?style=flat
[travis-url]: http:////travis-ci.org/bionode/bionode-seq
[travis-image]: http://img.shields.io/travis/bionode/bionode-seq.svg?style=flat
[coveralls-url]: http:////coveralls.io/r/bionode/bionode-seq
[coveralls-image]: http://img.shields.io/coveralls/bionode/bionode-seq.svg?style=flat
[depstat-url]: http://david-dm.org/bionode/bionode-seq
[depstat-image]: http://img.shields.io/david/bionode/bionode-seq.svg?style=flat
[gitter-image]: http://img.shields.io/badge/gitter-bionode/bionode--seq-brightgreen.svg?style=flat
[gitter-url]: https://gitter.im/bionode/bionode-seq
