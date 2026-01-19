const logger = require("../utils/logger");

function errorHandler(err,req,res,next){
  logger.error(err.message, err)

  res.status(500).send('Something went wrong')
}

module.exports = errorHandler;