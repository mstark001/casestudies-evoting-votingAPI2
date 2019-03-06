var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

  firstName: {
      required: true,
      type: String
  },
  lastName: {
      required: true,
      type: String
  },
  postCode: {
      required: true,
      type: String
  },
  eUID: {
     required: true,
     type: String
  },
  isAuditor: {
      required: true,
      type: Boolean
  },
  countryId: {
      required: true,
      type: String
  },
  nationality: {
      required: true,
      type: String
  },
  dateOfBirth: {
      required: true,
      type: Date
  },
  fullAddress: {
      required: true,
      type: String
  },
  submittedVotes: {
      type: [String]
  }



});

var User = mongoose.model('User', userSchema);

module.exports = User;