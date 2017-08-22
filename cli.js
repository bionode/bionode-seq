#!/usr/bin/env node

const fs = require('fs')
const minimist = require('minimist')
const through = require('through2')
const ndjson = require('ndjson')
const seq = require('./index.js')

const argv = minimist(process.argv.slice(2), {
  alias: {
    input: 'i',
    output: 'o',
    help: 'h'
  }
})

const commands = {
  'check-type': seq.checkType,
  'reverse': seq.reverse,
  'revese-comp': seq.reverseComplement,
  'remove-introns': seq.removeIntrons,
  'transcribe': seq.transcribe,
  'translate': seq.translate,
  'reverse-exons': seq.reverseExons,
  'non-canonical-splices': seq.findNonCanonicalSplices,
  'check-canonical-start': seq.checkCanonicalTranslationStartSite,
  'get-reading-frames': seq.getReadingFrames,
  'get-open-reading-frames': seq.getOpenReadingFrames,
  'get-all-open-reading-frames': seq.getAllOpenReadingFrames,
  'find-longest-open-reading-frame': seq.findLongestOpenReadingFrame
}

let usage = function () {
  console.log(
        'Usage: bionode-seq <command> <options>\n' +
        'If no output is provided, the result will be printed to stdout\n\n' +
        'Commands:'
  )
  for (let command in commands) {
    console.log('\t' + command)
  }
  console.log(
        '\nOptions:\n' +
        '-i, --input\t input file\n' +
        '-o, --output\t output file\n' +
        '-h, --help\t display this message'
  )
  process.exit(0)
}

if (argv.help || argv._.length === 0) {
  usage()
}

const command = argv._[0]

// check if a valid command is provided
if (!commands.hasOwnProperty(command)) {
  console.log(command + ' is not a valid command.\n')
  usage()
}

// if there is an output file present, write to the file. Otherwise write to stdout
const output = argv.output ? fs.createWriteStream(argv.output) : process.stdout

const serialize = ndjson.serialize()

// stream the input file into the seq parser
fs.createReadStream(argv.input)
    .pipe(ndjson.parse())
    .pipe(through.obj(function (data, enc, cb) {
      console.log('chunk', data)
      this.push(commands[command](data.seq))

      // get next object in stream
      cb()
    }))
    .pipe(serialize)
    .pipe(output)
    .on('error', function (err) {
      console.log('There was an error:\n', err)
    })
    .on('end', function () {
      serialize.end()
      output.close()
    })
