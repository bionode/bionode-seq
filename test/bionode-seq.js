var seq = require('../')
var test = require('tape')
var data = require('./data')

test("check sequence type", function(t) {
  t.plan(5)
  t.equal(seq.checkType(data.dnaSequence), 'dna', "should return strings 'dna' for sequence following IUPAC guidelines.")
  t.equal(seq.checkType(data.rnaSequence), 'rna', "should return strings 'rna' for sequence following IUPAC guidelines.")
  t.equal(seq.checkType(data.ambiguousDnaSequence), 'ambiguousDna', "should return strings 'ambiguousDna' for ambiguous DNA sequence.")
  t.equal(seq.checkType(data.ambiguousRnaSequence), 'ambiguousRna', "should return strings 'ambiguousRna' for ambiguous RNA sequence.")
  t.equal(seq.checkType(data.exon1Protein), 'protein', "should return strings 'protein' for protein sequence")
})



test("create complement base", function(t) {
  t.plan(1)
  t.equal(typeof seq.createComplementBase('dna'), 'function', "should return a function to complement bases depending on sequence type")
})


test("reverse", function(t) {
  t.plan(1)
  t.equal(seq.reverse(data.dnaSequence), data.dnaReverseSequence, "should return a reversed string from sequence")
})

test("complement", function(t) {
  t.plan(2)
  t.equal(seq.complement(data.dnaSequence), data.dnaComplementSequence, "should return complement string for DNA sequence")
  t.equal(seq.complement(data.rnaSequence), data.rnaComplementSequence, "should return complement string for RNA sequence")
})

test("reverse complement", function(t) {
  t.plan(1)
  t.equal(seq.reverseComplement(data.dnaSequence), data.dnaReverseComplementSequence, "should return a reverse complemented string for a DNA sequence")
})

test("transcribe base", function(t) {
  t.plan(8)
  t.equal(seq.getTranscribedBase('A'), 'U', "should transcribe base A to U")
  t.equal(seq.getTranscribedBase('a'), 'u', "should transcribe base a to u")
  t.equal(seq.getTranscribedBase('T'), 'A', "should transcribe base T to A")
  t.equal(seq.getTranscribedBase('t'), 'a', "should transcribe base t to a")
  t.equal(seq.getTranscribedBase('C'), 'G', "should transcribe base C to G")
  t.equal(seq.getTranscribedBase('c'), 'g', "should transcribe base c to g")
  t.equal(seq.getTranscribedBase('G'), 'C', "should transcribe base G to C")
  t.equal(seq.getTranscribedBase('g'), 'c', "should transcribe base g to c")
})

test("transcribe", function(t) {
  t.plan(2)
  t.equal(seq.transcribe(data.dnaSequence), data.rnaSequence, "should return rna string from dna string")
  t.equal(seq.transcribe(data.rnaSequence), data.dnaSequence, "should return dna string from rna string")
})

test("transcribe with exons", function(t) {
  t.plan(1)
  t.equal(seq.transcribe(data.simDNASequence, data.simExonsRanges), data.simRNASequenceNoIntrons, "should return rna string from dna string and remove introns if exons positions provided")
})

test("reverse exons", function(t) {
  t.plan(15)
  var exonsRangesReversed = seq.reverseExons(data.exonsRanges, data.length)
  t.deepEqual(exonsRangesReversed, data.exonsRangesReversed, "should return right exons coordinates reversed from array of exons and reference length")

  var dnaReverseSequence = seq.reverse(data.dnaSequence)
  exonsRangesReversed.forEach(function(exonRangeReversed, i) {
    var exonDnaSequenceReversed = dnaReverseSequence.slice(exonRangeReversed[0], exonRangeReversed[1])
    var exonDnaSequence = seq.reverse(exonDnaSequenceReversed)
    var trueExonDnaSequence = data.exonsDnaSequences[i]
    t.equal(exonDnaSequence, trueExonDnaSequence, "More redundant tests to really check exons sequences and makes sure all is working as expected")
  })
})

test("find non canonical splices", function(t) {
  t.plan(1)
  t.deepEqual(seq.findNonCanonicalSplices(data.dnaSequence, data.exonsRanges), [19272], "should return array with splices sites from reference and exons ranges")
})

test("check canonical translation start site", function(t) {
  t.plan(2)
  t.equal(seq.checkCanonicalTranslationStartSite(data.simDNASequenceCanonicalTranslation), true, "should return true if provided sequence starts with ATG/AUG")
  t.equal(seq.checkCanonicalTranslationStartSite(data.simDNASequenceNonCanonicalTranslation), false, "should return false if provided sequence doesn't start with ATG/AUG")
})

test("find longest open reading frame", function(t) {
  t.plan(1)
  t.deepEqual(seq.findLongestOpenReadingFrame(data.simDNASequence), [data.simDNALongestReadingFrame, '+3'], "should return the dna or rna string of the longest reading frame")
})

test("translate to amino acids", function(t) {
  t.plan(2)
  t.deepEqual(seq.translate(data.simDNASequence), data.simAASequence, "should return the amino acids string from a DNA string")
  t.deepEqual(seq.translate(data.simRNASequence), data.simAASequence, "should return the amino acids string from a RNA string")
})
