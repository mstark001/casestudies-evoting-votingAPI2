var User = require('./models/user');
var Election = require('./models/election');
var enviromentVariables = require('../../config/enviromentVariables');

var GetUserFromToken = require('../routes/GetUserFromToken');

var ObjectID = require('mongodb').ObjectID;
var db = null;

var jwt = require('jsonwebtoken');
var crypto = require("crypto");
var bcrypt = require('bcryptjs');
var config = require('../../config/enviromentVariables');

class ElectionController {

    createElection(req, res){
      try
      {
        let election = new Election();
        election.electionName = req.body.electionName;
        election.country = req.body.country;
        election.electionType = req.body.electionType;
        election.forConsituencies = req.body.forConsituencies;
        election.candidates = req.body.candidates;
        election.closeDate = req.body.closeDate;
        election.amountOfWinners = req.body.amountOfWinners;

        Election.create(election.toJSON(), (err, out) => {
            if (err) { 
                res.status(500).send({ 'ERROR': 'An error has occurred '+err }); 
            } else {
                res.send(out);
            }
        });
      }
      catch (err)
      {
        console.log(err);
        res.status(500).send({"ERROR": 'An error has occurred '+err});
      }
    }

    getElection(req, res){
      try
      {
        const id = req.params.id;
        const idObject = { '_id': new ObjectID(id) };
        Election.findOne(idObject, (err, out) => {
            if (err) {
                res.status(500).send({'ERROR':'An error has occurred '+err});
            } else {
                res.send(out);
            }
        });
      }
      catch (err)
      {
        console.log(err);
        res.status(500).send({"ERROR": 'An error has occurred '+err});
      }
    }

    getElections(req, res){
      try
      {
        Election.find({}, (err, out) => {
            if (err) {
              res.status(500).send({'ERROR':'An error has occurred '+err});
            } else {
              res.send(out);
            }
        });
      }
      catch (err)
      {
        console.log(err);
        res.status(500).send({"ERROR": 'An error has occurred '+err});
      }
    }

    updateElection(req, res){
      try
      {
        const id = req.params.id;
        const idObject = { '_id': new ObjectID(id) };

        let election = new Election();
        election.electionName = req.body.electionName;
        election.country = req.body.country;
        election.electionType = req.body.electionType;
        election.forConsituencies = req.body.forConsituencies;
        election.candidates = req.body.candidates;
        election.closeDate = req.body.closeDate;
        election.amountOfWinners = req.body.amountOfWinners;
        election._id = id;

      
        Election.updateOne(idObject, election.toJSON(), (err, out) => {
          if (err) {
              res.status(500).send({'ERROR':'An error has occurred '+err});
          } else {
              res.send(out);
          } 
        });
      }
      catch (err)
      {
        console.log(err);
        res.status(500).send({"ERROR": 'An error has occurred '+err});
      }
    }

    deleteElection(req, res){
      try
      {
        const id = req.params.id;
        const idObject = { '_id': new ObjectID(id) };
        Election.deleteOne(idObject, (err, out) => {
          if (err) {
            res.status(500).send({'ERROR':'An error has occurred '+err});
          } else {
            res.send(out + ' deleted');
          } 
        });
      }      
      catch (err)
      {
        console.log(err);
        res.status(500).send({"ERROR": 'An error has occurred '+err});
      }
    }


    getCurrentElections(req, res){
        try{
            Election.find({}, async (err, out) => {
                if (err) {
                    res.status(500).send({'ERROR':'An error has occurred '+err});
                } else {
                    
                    let user = await GetUserFromToken(req, res);
                    
                    const userId = user._id;

                    const userIdObject = { '_id': new ObjectID(userId) };
                    User.findOne(userIdObject, (err, userOut) => {
                        if (err) {
                            res.status(500).send({'ERROR':'An error has occurred '+err});
                        } else {
                            if (userOut.submittedVotes == null)
                                userOut.submittedVotes = [];

                            let elections = [];
                            for (let i = 0; i < out.length; i++)
                            {

                                let notFound = true;
                                let j = 0;
                                while (notFound && j < userOut.submittedVotes.length)
                                {
                                    let submitted = userOut.submittedVotes[j].toString();
                                    if (submitted === out[i]._id.toString())
                                        notFound = false;
                                    j++;
                                }

                                if (out[i].forConsituencies.includes(enviromentVariables.consistuency) &&
                                out[i].closeDate >= new Date() &&
                                notFound )
                                {
                                    elections.push(out[i]);
                                }
                            }
                            res.send(elections);
                        }
                    });




                }

            })

        }
        catch (err){
            console.log(err);
            res.status(500).send({"ERROR": 'An error has occurred '+err});
        }
    }

    async recordVote(req, res){
        try{
            let vote = {
                "forConstiuency" : req.body.consistuency
            };


            const electionId = req.body.electionId;
 

            let user = await GetUserFromToken(req, res);

            const userId = user._id;
            const userIdObject = { '_id': new ObjectID(userId) };
            User.findOne(userIdObject, (err, out) => {
                if (out.submittedVotes == null)
                    out.submittedVotes = [];

                if (!(out.submittedVotes.includes(electionId))) {
                    out.submittedVotes.push(electionId);
                    User.updateOne(userIdObject, out.toJSON(), (err, res) => {})
                }
            });


            const id = req.body.electionId
            const idObject = { '_id': new ObjectID(id) };

            let candidateId = req.body.candidateId;

            Election.findOne(idObject, async (err, out) => {
                if (err) {
                    res.status(500).send({'ERROR':'An error has occurred '+err});
                } else {

                    let user = await GetUserFromToken(req, res);


                    const userId = user._id;
                    const userIdObject = { '_id': new ObjectID(userId) };
                    User.findOne(userIdObject, (err, userOut) => {
                        if (err) {
                            res.status(500).send({'ERROR':'An error has occurred '+err});
                        }
                        else {
                            if (userOut.submittedVotes != null)
                            {
                                if (userOut.submittedVotes.includes(id) && out.electionType == "FPTP") {
                                    res.send({'SUCCESS':'VOTE PLACED'});
                                }
                                else {
                                    let updatedCandidate = out.candidates.find(e => e.candidateId == candidateId);
                                    
                                    let index = 0;
                                    while (out.candidates[index].candidateId != updatedCandidate.candidateId)
                                        index++;

                                    if (updatedCandidate == undefined)
                                        res.status(500).send({'ERROR':'An error has occurred Candidate could not be found'});
                                    else
                                    {
                                        updatedCandidate.votes.push(vote);
                
                                        //Finally, need to update the election
                                        let election = new Election();
                                        election.electionName = out.electionName;
                                        election.country = out.country;
                                        election.electionType = out.electionType;
                                        election.forConsituencies = out.forConsituencies;
                                        election.closeDate = out.closeDate;
                                        election.amountOfWinners = out.amountOfWinners;
                                        election._id = id;
                
                                        let candidates = out.candidates;
                                        candidates[index] = updatedCandidate;
                
                                        election.candidates = candidates;
                
                                        Election.updateOne(idObject, election.toJSON(), (err, newOut) => {
                                            if (err) {
                                                res.status(500).send({'ERROR':'An error has occurred '+err});
                                            } else {
                                                res.send({'SUCCESS':'VOTE PLACED'});
                                            } 
                                          });
                                    }
                                }
                            }
                        }
                    })


                }
            })
            
        } catch (err){
            console.log(err);
            res.status(500).send({"ERROR": 'An error has occurred '+err});
        }
    }


    async recordUserAsVoted(req, res){
        try{
            const electionId = req.params.id;
 

            let user = await GetUserFromToken(req, res);

            const userId = user._id;
            const userIdObject = { '_id': new ObjectID(userId) };
            User.findOne(userIdObject, (err, out) => {
                if (out.submittedVotes == null)
                    out.submittedVotes = [];

                if (out.submittedVotes.includes(electionId))
                    res.send({"SUCCESS": "Voted Placed"});
                else {
                    out.submittedVotes.push(electionId);
                    User.updateOne(userIdObject, out.toJSON(), (err, res) => {
                        if (err)
                            res.status(500).send({"ERROR": 'An error has occurred '+err});
                        else {
                            res.send({"SUCCESS": "Voted Placed"});
                        }
                    })
                }
            });

        } catch (err){
            console.log(err);
            res.status(500).send({"ERROR": 'An error has occurred '+err});
        }
    }

    async login(req, res){
        try
        {
          let postCode = req.body.postCode;
          let postCodeObject = { '_id': new Object(postCode) };
  
   
    
          await User.find({postCode: postCode}, async (err, out) => {
            if (err) {
              res.status(500).send('FAILURE '+err);
            } else {
              if (out == null)
                res.status(500).send('FAILURE Could not find anyone at that postcode');
              else {
                
                for (let i = 0; i < out.length; i++)
                {
                    if (bcrypt.compareSync(req.body.userCode + req.body.postCode, out[i].eUID))
                    {
  
                      // create a token
                      var token = jwt.sign({
                        _id: out[i]._id,
                        firstName: out[i].firstName,
                        lastName: out[i].lastName,
                        isAuditor : out[i].isAuditor,
                        postCode : out[i].postCode,
                        countryId : out[i].countryId,
                        nationality : out[i].nationality,
                        dateOfBirth : out[i].dateOfBirth,
                        fullAddress : out[i].fullAddress,
                      }, config.localSecret, {
                        expiresIn: 1000000000000000086400 // expires in a very long time (Need so tests still work)
                      });
                      res.send(token);
                      return;
                    }
                }
  
                res.status(500).send('FAILURE No Matching users at that postcode');
              }
            }
          });
        }
        catch (err)
        {
          console.log(err);
          res.status(500).send({"ERROR": 'An error has occurred'});
        }
      }


}

module.exports = ElectionController;
