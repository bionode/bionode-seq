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
      'sequence'
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
      'sequence'
    ],
    'optionalParams': []
  },
  'revese-comp': {
    'func': seq.reverseComplement,
    'requiredParams': [
      'sequence'
    ],
    'optionalParams': []
  },
  'remove-introns': {
    'func': seq.removeIntrons,
    'requiredParams': [
      'sequence',
      'exonsRanges'
    ],
    'optionalParams': []
  },
  'transcribe': {
    'func': seq.transcribe,
    'requiredParams': [
      'sequence'
    ],
    'optionalParams': [
      'exonsRanges'
    ]
  },
  'translate': {
    'func': seq.translate,
    'requiredParams': [
      'sequence'
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
      'sequence',
      'exonsRanges'
    ],
    'optionalParams': []
  },
  'check-canonical-start': {
    'func': seq.checkCanonicalTranslationStartSite,
    'requiredParams': [
      'sequence'
    ],
    'optionalParams': []
  },
  'get-reading-frames': {
    'func': seq.getReadingFrames,
    'requiredParams': [
      'sequence'
    ],
    'optionalParams': []
  },
  'get-open-reading-frames': {
    'func': seq.getOpenReadingFrames,
    'requiredParams': [
      'sequence'
    ],
    'optionalParams': []
  },
  'get-all-open-reading-frames': {
    'func': seq.getAllOpenReadingFrames,
    'requiredParams': [
      'sequence'
    ],
    'optionalParams': []
  },
  'find-longest-open-reading-frame': {
    'func': seq.findLongestOpenReadingFrame,
    'requiredParams': [
      'sequence'
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
  for (const command in commands) {
    console.log('\t' + command)
  }
  options()
  process.exit(0)
}

const commandUsage = function (command) {
  console.log(
        'Usage: bionode-seq ' + command + ' <options>\n\n' +
        'Required parameters supplied in ndJSON format:'
  )
  const requiredParams = commands[command].requiredParams
  for (const i in requiredParams) {
    console.log('\t' + requiredParams[i])
  }
  console.log('\nOptional parameters supplied in ndJSON format:')
  const optionalParams = commands[command].optionalParams
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

const RequiredParamException = function (command, param) {
  this.message = 'The paramter: "' + param + '" was not provided and is required for ' + command
}

const runSeqFunction = function (command, params) {
  // check if the required parameters are satisfied for this command
  const requiredParams = commands[command].requiredParams
  for (const i in requiredParams) {
    if (!params.hasOwnProperty(requiredParams[i])) {
      throw new RequiredParamException(command, requiredParams[i])
    }
  }

  const optionalParams = commands[command].optionalParams

  let result

  // call the function!
  const seqFunc = commands[command].func
  if (requiredParams.length === 1 && optionalParams.length === 0) {
    // only one required parameter, no optional
    result = seqFunc(params[requiredParams[0]])
  } else if (requiredParams.length === 1 && optionalParams.length === 1) {
    // only one required parameter, one optional parameter
    result = seqFunc(params[requiredParams[0]], params[optionalParams[0]])
  } else if (requiredParams.length === 2 && optionalParams.length === 0) {
    // two required parameters, no optional
    result = seqFunc(params[requiredParams[0]], params[requiredParams[1]])
  } else if (requiredParams.length === 1 && optionalParams.length === 3) {
    // one required parameter, 3 optional parameters
    result = seqFunc(
        params[requiredParams[0]],
        params[optionalParams[0]],
        params[optionalParams[1]],
        params[optionalParams[2]]
      )
  }

  return result
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
if (argv._.length === 1 && !argv.input) {
  commandUsage(command)
}

// if there is an output file present, write to the file. Otherwise write to stdout
const output = argv.output ? fs.createWriteStream(argv.output) : process.stdout

const serialize = ndjson.serialize()

// stream the input file into the seq parser
fs.createReadStream(argv.input)
    .pipe(ndjson.parse())
    .pipe(through.obj(function (data, enc, cb) {
      this.push(runSeqFunction(command, data))

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
