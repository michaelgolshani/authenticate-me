const express = require('express');

const { Venue, Group, Membership, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult } = require('express-validator');

const router = express.Router();





const validateVenueGroup = [
  check('address')
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .notEmpty()
    .withMessage('State is required'),
  check('lat')
    .isNumeric()
    .withMessage('Latitude is not valid'),
  check('lng')
    .isNumeric()
    .withMessage('Longitude is not valid'),
]






// 1. Edit a Venue specified by its id

router.put("/:venueId", validateVenueGroup, async (req,res,next) => {


const {venueId} = req.params
const {user} = req

const {
  address,
  city,
  state,
  lat,
  lng
} = req.body

const venue = await Venue.findByPk(venueId);

// check if the venue exists

if (!venue) {
  return res.status(404).json({
    message: "Venue couldn't be found"
    //statusCode: 404
  });
}


// check if the user is the organizer of the group or a member with co-host

const group = await Group.findOne({
  where: {
    id: venue.groupId,
    organizerId: user.id
  }
});

const member = await Membership.findOne({
  where: {
    groupId: venue.groupId,
    userId: user.id,
    status: 'co-host'
  }
});


// authenticates if user is organizer or member with co-host
if (!group && !member) {
  return res.status(404).json({
    message: "Venue couldn't be found"
    //statusCode: 404
  });
}


// handles validation
const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

return res.status(400).json({
  "message": "Validation Error",
  "statusCode": 400,
  "errors": errors
})
}


//updates Venue
const updatedVenue = await venue.update({
  address,
  city,
  state,
  lat,
  lng
});


// sends proper response
return res.status(200).json(updatedVenue)

});











module.exports = router
