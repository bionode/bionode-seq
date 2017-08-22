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

// contains the available commands, as well as the function and necessary parameters
const commands = {
  'check-type': {
    'func': seq.checkType,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': [
      'threshold',
      'length',
      'index'
    ]
  },
  'reverse': {
    'func': seq.reverse,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': []
  },
  'revese-comp': {
    'func': seq.reverseComplement,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': []
  },
  'remove-introns': {
    'func': seq.removeIntrons,
    'requiredParams': [
      'seq',
      'exonsRanges'
    ],
    'optionalParams': []
  },
  'transcribe': {
    'func': seq.transcribe,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': [
      'exonsRanges'
    ]
  },
  'translate': {
    'func': seq.translate,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': [
      'exonsRanges'
    ]
  },
  'reverse-exons': {
    'func': seq.reverseExons,
    'requiredParams': [
      'reverseExons',
      'referenceLength'
    ],
    'optionalParams': []
  },
  'non-canonical-splices': {
    'func': seq.findNonCanonicalSplices,
    'requiredParams': [
      'seq',
      'exonsRanges'
    ],
    'optionalParams': []
  },
  'check-canonical-start': {
    'func': seq.checkCanonicalTranslationStartSite,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': []
  },
  'get-reading-frames': {
    'func': seq.getReadingFrames,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': []
  },
  'get-open-reading-frames': {
    'func': seq.getOpenReadingFrames,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': []
  },
  'get-all-open-reading-frames': {
    'func': seq.getAllOpenReadingFrames,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': []
  },
  'find-longest-open-reading-frame': {
    'func': seq.findLongestOpenReadingFrame,
    'requiredParams': [
      'seq'
    ],
    'optionalParams': [
      'frameSymbol'
    ]
  }
}

const options = function () {
  console.log(
        '\nOptions:\n' +
        '-i, --input\t input file\n' +
        '-o, --output\t output file\n' +
        '-h, --help\t display this message'
  )
}

const usage = function () {
  console.log(
        'Usage: bionode-seq <command> <options>\n' +
        'If no output is provided, the result will be printed to stdout\n' +
        'To view help for a specific command: bionode-seq <command>\n\n' +
        'Commands:'
  )
  for (let command in commands) {
    console.log('\t' + command)
  }
  options()
  process.exit(0)
}

const commandUsage = function (command) {
  console.log(
        'Usage: bionode-seq ' + command + ' <options>\n\n' +
        'Required parameters supplied in JSON format:'
  )
  let requiredParams = commands[command].requiredParams
  for (const i in requiredParams) {
    console.log('\t' + requiredParams[i])
  }
  console.log('\nOptional parameters supplied in JSON format:')
  let optionalParams = commands[command].optionalParams
  if (optionalParams.length === 0) {
    console.log('\tNone')
  } else {
    for (const i in optionalParams) {
      console.log('\t' + optionalParams[i])
    }
  }
  options()
  console.log('Check bionode-seq/lib/bionode-seq.js for specific formats for paramters.')
  process.exit(0)
}

// display general usage message
if (argv.help || argv._.length === 0) {
  usage()
}

const command = argv._[0]

// check if a valid command is provided
if (!commands.hasOwnProperty(command)) {
  console.log(command + ' is not a valid command.\n')
  usage()
}

// display specific command usage message
if (argv._.length === 1) {
  commandUsage(command)
}

// if there is an output file present, write to the file. Otherwise write to stdout
const output = argv.output ? fs.createWriteStream(argv.output) : process.stdout

const serialize = ndjson.serialize()

// stream the input file into the seq parser
fs.createReadStream(argv.input)
    .pipe(ndjson.parse())
    .pipe(through.obj(function (data, enc, cb) {
      console.log('chunk', data)
      this.push(commands[command].func(data.seq))

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
