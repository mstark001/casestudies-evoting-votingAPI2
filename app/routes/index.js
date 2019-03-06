
const electionRoutes = require('./electionRoutes');

module.exports = function(app) {
  electionRoutes(app);
};