var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
    forConstiuency: {
        required: true,
        type: String
    }
})


var candidateSchema = new Schema({
    candidateId: {
        unique: true,
        required: true,
        type: String
    },
    candidateName: {
        required: true,
        type: String
    },
    candidateAddress: {
        required: true,
        type: String
    },
    candidatePicture: {
        required: true,
        type: String
    },
    party: {
        required: true,
        type: String
    },
    votes: {
        type: [voteSchema]
    }
})

var electionSchema = new Schema({

  electionName: {
      required: true,
      type: String
  },
  country: {
      required: true,
      type: String
  },
  electionType: {
      required: true,
      type: String
  },
  forConsituencies: {
      required: true,
      type: [String]
  },
  closeDate: {
      required: true,
      type: Date
  },
  candidates: {
      required: true,
      type: [candidateSchema]
  }

});

var Election = mongoose.model('Election', electionSchema);

module.exports = Election;