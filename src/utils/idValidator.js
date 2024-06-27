const mongoose = require('mongoose');

const idValidator = (req, res, next) => {
  const id = req.params.id;
  // Check if id is provided
  if (!id) {
    return res.badRequest({message: 'ID is not provided.'});
  }

  // Check if id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.badRequest({message: 'Provided ID is not valid.'});
  }

  next();
};

module.exports = idValidator;