var ElectionController = require('../controllers/electionController.js');
const VerifyLoginToken = require('./VerifyLoggedIn');
const VerifyAuditToken = require('./VerifyAuditor');
const VerifyRedirectToken = require('./VerifyRedirect');

module.exports = function(routes) {

  let electionController = new ElectionController();

  //Create
  routes.post('/elections', VerifyAuditToken, electionController.createElection);
  //Read
  routes.get('/elections/id/:id', VerifyAuditToken, electionController.getElection);
  //Read All
  routes.get('/elections', VerifyAuditToken, electionController.getElections);
  //Update
  routes.put('/elections/:id', VerifyAuditToken, electionController.updateElection);
  //Delete
  routes.delete('/elections/:id', VerifyAuditToken, electionController.deleteElection);
  
  //Read All AVAILABLE for Area and current date
  routes.get('/elections/current', VerifyLoginToken, electionController.getCurrentElections);
  //Record Vote
  routes.post('/elections/vote', VerifyLoginToken, electionController.recordVote);
  //Record Vote spoil
  routes.post('/elections/spoil', VerifyLoginToken, electionController.recordVoteSpoil);
  //Record User as Voted in Election
  routes.get('/elections/:id/markAsVoted', VerifyLoginToken, electionController.recordUserAsVoted);

  //login to local server
  routes.post('/elections/login', VerifyRedirectToken, electionController.login);
}; 