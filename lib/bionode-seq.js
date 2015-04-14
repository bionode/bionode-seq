// # bionode-seq
// > Module for DNA, RNA and protein sequences manipulation.
// >
// > doi: [?](?)
// > author: [Bruno Vieira](http://bmpvieira.com)
// > email: <mail@bmpvieira.com>
// > license: [MIT](https://raw.githubusercontent.com/bionode/bionode-seq/master/LICENSE)
//
// ---
//
// ## Usage
// See the methods below.

var seq = module.exports

var _baseMatrix = { A: 'T', C: 'G', W: 'S', M: 'K', R: 'Y', B: 'V', D: 'H' }

var _dnaComplementBasesMatrix = Object.create(_baseMatrix)
var _rnaComplementBasesMatrix = Object.create(_baseMatrix)
var _transcribeBasesMatrix = Object.create(_baseMatrix)
var _translateCodonsMatrix = {
  'GCU': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A', 'CGU': 'R', 'CGC': 'R',
  'CGA': 'R', 'CGG': 'R', 'AGA': 'R', 'AGG': 'R', 'AAU': 'N', 'AAC': 'N',
  'GAU': 'D', 'GAC': 'D', 'UGU': 'C', 'UGC': 'C', 'CAA': 'Q', 'CAG': 'Q',
  'GAA': 'E', 'GAG': 'E', 'GGU': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G',
  'CAU': 'H', 'CAC': 'H', 'AUU': 'I', 'AUC': 'I', 'AUA': 'I', 'UUA': 'L',
  'UUG': 'L', 'CUU': 'L', 'CUC': 'L', 'CUA': 'L', 'CUG': 'L', 'AAA': 'K',
  'AAG': 'K', 'AUG': 'M', 'UUU': 'F', 'UUC': 'F', 'CCU': 'P', 'CCC': 'P',
  'CCA': 'P', 'CCG': 'P', 'UCU': 'S', 'UCC': 'S', 'UCA': 'S', 'UCG': 'S',
  'AGU': 'S', 'AGC': 'S', 'ACU': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
  'UGG': 'W', 'UAU': 'Y', 'UAC': 'Y', 'GUU': 'V', 'GUC': 'V', 'GUA': 'V',
  'GUG': 'V', 'UAA': '*', 'UGA': '*', 'UAG': '*', 'XAA': 'X', 'XAC': 'X',
  'XAG': 'X', 'XAU': 'X', 'XCA': 'X', 'XCC': 'X', 'XCG': 'X', 'XCU': 'X',
  'XGA': 'X', 'XGC': 'X', 'XGG': 'X', 'XGU': 'X', 'XUA': 'X', 'XUC': 'X',
  'XUG': 'X', 'XUU': 'X', 'XAX': 'X', 'XCX': 'X', 'XGX': 'X', 'XUX': 'X',
  'XXA': 'X', 'XXC': 'X', 'XXG': 'X', 'XXU': 'X', 'XXX': 'X',
  'gcu': 'a', 'gcc': 'a', 'gca': 'a', 'gcg': 'a', 'cgu': 'r', 'cgc': 'r',
  'cga': 'r', 'cgg': 'r', 'aga': 'r', 'agg': 'r', 'aau': 'n', 'aac': 'n',
  'gau': 'd', 'gac': 'd', 'ugu': 'c', 'ugc': 'c', 'caa': 'q', 'cag': 'q',
  'gaa': 'e', 'gag': 'e', 'ggu': 'g', 'ggc': 'g', 'gga': 'g', 'ggg': 'g',
  'cau': 'h', 'cac': 'h', 'auu': 'i', 'auc': 'i', 'aua': 'i', 'uua': 'l',
  'uug': 'l', 'cuu': 'l', 'cuc': 'l', 'cua': 'l', 'cug': 'l', 'aaa': 'k',
  'aag': 'k', 'aug': 'm', 'uuu': 'f', 'uuc': 'f', 'ccu': 'p', 'ccc': 'p',
  'cca': 'p', 'ccg': 'p', 'ucu': 's', 'ucc': 's', 'uca': 's', 'ucg': 's',
  'agu': 's', 'agc': 's', 'acu': 't', 'acc': 't', 'aca': 't', 'acg': 't',
  'ugg': 'w', 'uau': 'y', 'uac': 'y', 'guu': 'v', 'guc': 'v', 'gua': 'v',
  'gug': 'v', 'uaa': '*', 'uga': '*', 'uag': '*', 'xaa': 'x', 'xac': 'x',
  'xag': 'x', 'xau': 'x', 'xca': 'x', 'xcc': 'x', 'xcg': 'x', 'xcu': 'x',
  'xga': 'x', 'xgc': 'x', 'xgg': 'x', 'xgu': 'x', 'xua': 'x', 'xuc': 'x',
  'xug': 'x', 'xuu': 'x', 'xax': 'x', 'xcx': 'x', 'xgx': 'x', 'xux': 'x',
  'xxa': 'x', 'xxc': 'x', 'xxg': 'x', 'xxu': 'x', 'xxx': 'x'
}

_rnaComplementBasesMatrix['A'] = 'U'
delete _rnaComplementBasesMatrix['T']

_transcribeBasesMatrix['A'] = 'U'

mirrorAndLowerCaseMatrices([
  _dnaComplementBasesMatrix,
  _rnaComplementBasesMatrix,
  _transcribeBasesMatrix
])

_transcribeBasesMatrix['T'] = 'A'
_transcribeBasesMatrix['t'] = 'a'

function mirrorAndLowerCaseMatrices(matricesArray) {
  matricesArray.forEach(function(matrix) {
    for (var k in matrix) {
      var v = matrix[k]
      matrix[k.toLowerCase()] = v.toLowerCase()
      matrix[v] = k
      matrix[v.toLowerCase()] = k.toLowerCase()
    }
  })
}

// ### Check sequence type

// Takes a sequence string and checks if it's DNA, RNA or protein (returns 'dna', 'rna', 'protein' or undefined). Other optional arguments include threshold, length and index (see below).
//
//     seq.checkType("ATGACCCTGAGAAGAGCACCG");
//     => "dna"
//     seq.checkType("AUGACCCUGAAGGUGAAUGAA");
//     => "rna"
//     seq.checkType("MAYKSGKRPTFFEVFKAHCSDS");
//     => "protein"
//     seq.checkType("1234567891234567ATGACC");
//     => undefined
//
// By default, the method has a 90% threshold, however, this can be altered as required.
//
//     seq.checkType("1234567891234567ATGACC", 0.8);
//     => undefined
//     seq.checkType("--------MAYKSGKRPTFFEV", 0.7);
//     => "protein"
//
// The length value specifies the length of the sequence to be analyse (default 10000). If your sequence is extremely long, you may want to analyse a shorter sub-section to reduce the computational burden.
//
//     seq.checkType('A Very Long Sequence', 0.9, 1000);
//     => Type based on the first 1000 characters
//
// The index value specifies the point on the sequence from which the sequence is to be analysed. Perhaps you know that there are lot of gaps at the start of the sequence.
//
//     seq.checkType("--------MAYKSGKRPTFFEV", 0.9, 10000, 8);
//     => "protein"
//
seq.checkType = function (sequence, threshold, length, index) {
  if (threshold === undefined) {
    threshold = 0.9
  }
  if (length === undefined) {
    length = 10000
  }
  if (index === undefined) {
    index = 1
  }
  var seq = sequence.slice(index - 1, length)

  var dnaSeq = seq.replace(/N/gi,'')
  var dnaTotal = dnaSeq.length
  var acgMatch = ((dnaSeq.match(/[ACG]/gi) || []).length) / dnaTotal
  var tMatch = ((dnaSeq.match(/[T]/gi) || []).length) / dnaTotal
  var uMatch = ((dnaSeq.match(/[U]/gi) || []).length) / dnaTotal
  
  var proteinSeq = seq.replace(/X/gi,'')
  var proteinTotal = proteinSeq.length
  var proteinMatch = ((seq.match(/[ARNDCQEGHILKMFPSTWYV\*]/gi) || []).length) / proteinTotal

  if (((acgMatch + tMatch) >= threshold) || ((acgMatch + uMatch) >= threshold)) {
    if (tMatch >= uMatch) {
      return 'dna'
    } else if (uMatch >= tMatch) {
      return 'rna'
    } else {
      return 'dna'
    }
  } else if (proteinMatch >= threshold) {
    return 'protein'
  }
}

// Takes a sequence type argument and returns a function to complement bases.
seq.createComplementBase = function(sequenceType) {
  var complementBasesMatrix = (sequenceType === 'rna' || sequenceType === 'ambiguousRna') ? _rnaComplementBasesMatrix : _dnaComplementBasesMatrix
  var getComplementBase = function(base) {
    var complement = complementBasesMatrix[base]
    return complement || base
  }
  return getComplementBase
}

// ### Reverse sequence

// Takes sequence string and returns the reverse sequence.
//
//     seq.reverse("ATGACCCTGAAGGTGAA");
//     => "AAGTGGAAGTCCCAGTA"
seq.reverse = function(sequence) {
  return sequence.split('').reverse().join('')
}

// ### (Reverse) complement sequence

// Takes a sequence string and optional boolean for reverse, and returns its complement.
//
//     seq.complement("ATGACCCTGAAGGTGAA");
//     => "TACTGGGACTTCCACTT"
//     seq.complement("ATGACCCTGAAGGTGAA", true);
//     => "TTCACCTTCAGGGTCAT"
//     //Alias
//     seq.reverseComplement("ATGACCCTGAAGGTGAA");
//     => "TTCACCTTCAGGGTCAT"
seq.complement = function(sequence, reverse) {
  var reverse = reverse || false
  var sequenceType = seq.checkType(sequence)
  var getComplementBase = seq.createComplementBase(sequenceType)
  if (reverse) {
    return sequence.split('').reverse().map(getComplementBase).join('')
  }
  else {
    return sequence.split('').map(getComplementBase).join('')
  }
}

// Takes a sequence string and returns the reverse complement (syntax sugar).
seq.reverseComplement = function(sequence) {
  return seq.complement(sequence, true)
}

// ### Transcribe base

// Takes a base character and returns the transcript base.
//
//     seq.getTranscribedBase("A");
//     => "U"
//     seq.getTranscribedBase("T");
//     => "A"
//     seq.getTranscribedBase("t");
//     => "a"
//     seq.getTranscribedBase("C");
//     => "G"
seq.getTranscribedBase = function(base) {
  return _transcribeBasesMatrix[base] || base
}

// ### Get codon amino acid

// Takes an RNA codon and returns the translated amino acid.
//
//     seq.getTranslatedAA("AUG");
//     => "M"
//     seq.getTranslatedAA("GCU");
//     => "A"
//     seq.getTranslatedAA("CUU");
//     => "L"
seq.getTranslatedAA = function(codon) {
  return _translateCodonsMatrix[codon]
}

// ### Remove introns

// Take a sequence and an array of exonsRanges and removes them.
//
//     seq.removeIntrons("ATGACCCTGAAGGTGAATGACAG", [[1, 8]]);
//     => "TGACCCT"
//     seq.removeIntrons("ATGACCCTGAAGGTGAATGACAG", [[2, 9], [12, 20]]);
//     => "GACCCTGGTGAATGA"
seq.removeIntrons = function(sequence, exonsRanges) {
  var sequenceWithoutIntrons = ''
  var exonsRangesSorted = exonsRanges.sort(function(a, b) { return a[0] - b[0] })
  exonsRangesSorted.forEach(function(exonRange) {
    sequenceWithoutIntrons += sequence.substring(exonRange[0], exonRange[1])
  })
  return sequenceWithoutIntrons
}

// ### Transcribe sequence

// Takes a sequence string and returns the transcribed sequence (dna <-> rna).
// If an array of exons is given, the introns will be removed from the sequence.
//
//     seq.transcribe("ATGACCCTGAAGGTGAA");
//     => "AUGACCCUGAAGGUGAA"
//     seq.transcribe("AUGACCCUGAAGGUGAA"); //reverse
//     => "ATGACCCTGAAGGTGAA"
seq.transcribe = function(sequence, exonsRanges) {
  if (exonsRanges) {
    var sequenceWithoutIntrons = seq.removeIntrons(sequence, exonsRanges)
    sequence = sequenceWithoutIntrons
  }
  var sequenceType = seq.checkType(sequence)
  if (sequenceType === 'dna' || sequenceType === 'ambiguousDna') {
    return sequence.replace(/t/g, 'u').replace(/T/g, 'U')
  }
  else if (sequenceType === 'rna' || sequenceType === 'ambiguousRna') {
    return sequence.replace(/u/g, 't').replace(/U/g, 'T')
  }
}

// ### Translate sequence

// Takes a DNA or RNA sequence and translates it to protein
// If an array of exons is given, the introns will be removed from the sequence.
//
//     seq.translate("ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC"); //dna
//     => "MTLKVNDRKPN"
//     seq.translate("AUGACCCUGAAGGUGAAUGACAGGAAGCCCAAC"); //rna
//     => "MTLKVNDRKPN"
//     seq.translate("ATGACCCTGAAGGTGAATGACAGGAAGCC", [[3, 21]]);
//     => "LKVND"
seq.translate = function(sequence, exonsRanges) {
  if (exonsRanges) {
    var sequenceWithoutIntrons = seq.removeIntrons(sequence, exonsRanges)
    sequence = sequenceWithoutIntrons
  }
  var sequenceType = seq.checkType(sequence)
  var rna
  if (sequenceType === 'protein') {
    return sequence
  }
  else if (sequenceType === 'dna' || sequenceType === 'ambiguousDna') {
    if (sequenceType === 'ambiguousDna') sequence.replace(/[wsmkrybdhv]/g, 'x').replace(/[WSMKRYBDHV]/g, 'X')
    rna = seq.transcribe(sequence, exonsRanges)
  }
  else if (sequenceType === 'rna' || sequenceType === 'ambiguousRna') {
    if (sequenceType === 'ambiguousRna') sequence.replace(/[wsmkrybdhv]/g, 'x').replace(/[WSMKRYBDHV]/g, 'X')
    rna = sequence
  }
  return rna.match(/.{1,3}/g).map(seq.getTranslatedAA).join('')
}

// ### Reverse exons

// Takes an array of exons and the length of the reference and returns inverted coordinates.
//
//     seq.reverseExons([[2,8]], 20);
//     => [ [ 12, 18 ] ]
//     seq.reverseExons([[10,45], [65,105]], 180);
//     => [ [ 135, 170 ], [ 75, 115 ] ]
seq.reverseExons = function(exonsRanges, referenceLength) {
  var reversedExonsRanges = []
  exonsRanges.forEach(function(exonRange) {
    var start = referenceLength - exonRange[1]
    var stop = referenceLength - exonRange[0]
    reversedExonsRanges.push([start, stop])
  })
  return reversedExonsRanges
}

// ### Find non-canonical splice sites

// Takes a sequence and exons ranges and returns an array of non canonical splice sites.
//
//     seq.findNonCanonicalSplices("GGCGGCGGCGGTGAGGTGGACCTGCGCGAATACGTGGTCGCCCTGT", [[0, 10], [20, 30]]);
//     => [ 20 ]
//     seq.findNonCanonicalSplices("GGCGGCGGCGGTGAGGTGAGCCTGCGCGAATACGTGGTCGCCCTGT", [[0, 10], [20, 30]]);
//     => []
seq.findNonCanonicalSplices = function(sequence, exonsRanges) {
  var nonCanonicalSplices = []
  var exonsRangesSorted = exonsRanges.sort(function(a, b) { return a[0] - b[0] })
  exonsRangesSorted.forEach(checkNonCanonicalIntron)
  function checkNonCanonicalIntron(exonRange, i) {
    var donor = exonRange
    var acceptor = exonsRangesSorted[i + 1]
    if (!acceptor) return null
    var intronRange = [donor[1], acceptor[0]]
    var intronStartBases = sequence.slice(intronRange[0], intronRange[0] + 2).toLowerCase().replace('t', 'u')
    var intronStopBases = sequence.slice(intronRange[1] - 2, intronRange[1]).toLowerCase()
    if (intronStartBases !== 'gu')
      nonCanonicalSplices.push(intronRange[0])
    if (intronStopBases !== 'ag')
      nonCanonicalSplices.push(intronRange[1])
  }
  return nonCanonicalSplices
}

// ### Check canonical translation start site

// Takes a sequence and returns boolean for canonical translation start site.
//
//     seq.checkCanonicalTranslationStartSite("ATGACCCTGAAGGT");
//     => true
//     seq.checkCanonicalTranslationStartSite("AATGACCCTGAAGGT");
//     => false
seq.checkCanonicalTranslationStartSite = function(sequence) {
  return sequence.substring(0, 3).toLowerCase().replace('t', 'u') === 'aug'
}

// ### Get reading frames

// Takes a sequence and returns an array with the six possible Reading Frames (+1, +2, +3, -1, -2, -3).
//
//     seq.getReadingFrames("ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC");
//     => [ 'ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC',
//          'TGACCCTGAAGGTGAATGACAGGAAGCCCAAC',
//          'GACCCTGAAGGTGAATGACAGGAAGCCCAAC',
//          'GTTGGGCTTCCTGTCATTCACCTTCAGGGTCAT',
//          'TTGGGCTTCCTGTCATTCACCTTCAGGGTCAT',
//          'TGGGCTTCCTGTCATTCACCTTCAGGGTCAT' ]
seq.getReadingFrames = function(sequence) {
  var reverse = seq.reverseComplement(sequence)
  return [sequence, sequence.substring(1), sequence.substring(2), reverse, reverse.substring(1), reverse.substring(2)]
}

// ### Get open reading frames

// Takes a Reading Frame sequence and returns an array of Open Reading Frames.
//
//     seq.getOpenReadingFrames("ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC");
//     => [ 'ATGACCCTGAAGGTGAATGACAGGAAGCCCAAC' ]
//     seq.getOpenReadingFrames("AUGACCCUGAAGGUGAAUGACAGGAAGCCCAAC");
//     => [ 'AUGACCCUGAAGGUGAAUGACAGGAAGCCCAAC' ]
//     seq.getOpenReadingFrames("ATGAGAAGCCCAACATGAGGACTGA");
//     => [ 'ATGAGAAGCCCAACATGA', 'GGACTGA' ]
seq.getOpenReadingFrames = function(sequence) {
  var sequenceType = seq.checkType(sequence)
  var stopCodons
  if (sequenceType === 'dna' || sequenceType === 'ambiguousDna') {
    stopCodons = ['TAA', 'TGA', 'TAG', 'taa', 'tga', 'tag']
  }
  else if (sequenceType === 'rna' || sequenceType === 'ambiguousRna') {
    stopCodons = ['UAA', 'UGA', 'UAG', 'uaa', 'uga', 'uag']
  }
  var openReadingFrames = []
  var openReadingFrame = ''
  sequence.match(/.{1,3}/g).forEach(function(codon) {
    openReadingFrame += codon
    if (stopCodons.indexOf(codon) !== -1 && openReadingFrame.length > 0) {
      openReadingFrames.push(openReadingFrame)
      openReadingFrame = ''
    }
  })
  openReadingFrames.push(openReadingFrame)
  return openReadingFrames
}

// ### Get all open reading frames

// Takes a sequence and returns all Open Reading Frames in the six Reading Frames.
//
//     seq.getAllOpenReadingFrames("ATGACCCTGAAGGTGAATGACA");
//     => [ [ 'ATGACCCTGAAGGTGAATGACA' ],
//          [ 'TGA', 'CCCTGA', 'AGGTGA', 'ATGACA' ],
//          [ 'GACCCTGAAGGTGAATGA', 'CA' ],
//          [ 'TGTCATTCACCTTCAGGGTCAT' ],
//          [ 'GTCATTCACCTTCAGGGTCAT' ],
//          [ 'TCATTCACCTTCAGGGTCAT' ] ]
seq.getAllOpenReadingFrames = function(sequence) {
  var readingFrames = seq.getReadingFrames(sequence)
  var allOpenReadingFrames = readingFrames.map(seq.getOpenReadingFrames)
  return allOpenReadingFrames
}

// ### Find longest open reading frame

// Takes a sequence and returns the longest ORF from all six reading frames and
// corresponding frame symbol (+1, +2, +3, -1, -2, -3). If a frame symbol is specified,
// only look for longest ORF on that frame.
// When sorting ORFs, if there's a tie, choose the one that starts with start codon Methionine.
// If there's still a tie, return one randomly.
//
//     seq.findLongestOpenReadingFrame("ATGACCCTGAAGGTGAATGACA");
//     => [ 'ATGACCCTGAAGGTGAATGACA', '+1' ]
//     seq.findLongestOpenReadingFrame("ATGACCCTGAAGGTGAATGACA", "-1");
//     => "TGTCATTCACCTTCAGGGTCAT"
seq.findLongestOpenReadingFrame = function(sequence, frameSymbol) {
  var frameSymbols = ['+1', '+2', '+3', '-1', '-2', '-3']
  if (frameSymbol) {
    var framePosition = frameSymbols.indexOf(frameSymbol)
    var readingFrame = seq.getReadingFrames(sequence)[framePosition]
    var openReadingFrames = seq.getOpenReadingFrames(readingFrame)
    var longestOpenReadingFrame = getLongestOpenReadingFrame(openReadingFrames)
    return longestOpenReadingFrame
  }
  else {
    // Get longest ORFs for all six possible reading frames
    var longestOpenReadingFrames = seq.getAllOpenReadingFrames(sequence).map(getLongestOpenReadingFrame)
    // Get longest ORF
    var longestOpenReadingFrame = getLongestOpenReadingFrame(longestOpenReadingFrames.slice())
    var framePosition = longestOpenReadingFrames.indexOf(longestOpenReadingFrame)
    var frameSymbol = frameSymbols[framePosition]
    return [longestOpenReadingFrame, frameSymbol]
  }

  // Helper that sorts by length, giving priority to ones that start with ATG/AUG
  function sortReadingFrames(a, b) {
    var aSort = a.length
    var bSort = b.length
    if (bSort - aSort === 0) {
      var aStartCodon = a.slice(0, 3).toUpperCase().replace('T', 'U')
      var bStartCodon = b.slice(0, 3).toUpperCase().replace('T', 'U')
      if (aStartCodon === 'AUG') { aSort++ }
      if (bStartCodon === 'AUG') { bSort++ }
    }
    return bSort - aSort
  }

  // Helper that takes an array and returns longest Reading Frame
  function getLongestOpenReadingFrame(array) {
    return array.sort(sortReadingFrames)[0]
  }

}
