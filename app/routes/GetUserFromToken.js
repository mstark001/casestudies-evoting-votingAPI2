var jwt = require('jsonwebtoken');
var config = require('../../config/enviromentVariables');


async function getUserFromToken(req, res) {
  var token = req.headers['x-access-token2'];
  if (!token)
    return null;
  return await jwt.verify(token, config.localSecret, function(err, decoded) {
    if (err)
      return null;

    return decoded;
  });
}

module.exports = getUserFromToken;