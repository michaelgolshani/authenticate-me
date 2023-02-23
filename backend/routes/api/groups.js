const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, Venue , User, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');


const { validationResult } = require('express-validator');


const router = express.Router();



// 1. GET ALL GROUPS
router.get('/', async (req, res) => {
  const groups = await Group.findAll();
  return res.json(
    {
    Groups: groups
  });
});







// 2. GET ALL GROUPS JOINED OR ORGANIZED BY CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;


  const groups = await Group.findAll({
    where: {
      [Op.or]: [{ organizerId: user.id }] // { id: { [Op.in]: user.groupIds } }],
    },
  });
  return res.json({ Groups: groups });
});


// 3. Get details of a Group from an id

router.get('/:groupId', requireAuth,async (req,res) => {





})




// Validations for "Create A Group"
const validateGroup = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isLength({ max: 60 })
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .exists({ checkFalsy: true })
    .withMessage('About is required')
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more'),
  check('type')
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .isBoolean()
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
];


// 4. Create a Group
router.post('/', validateGroup, async (req, res) => {
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

  const { name, about, type, private, city, state } = req.body;

  const group = await Group.create({
    name,
    about,
    type,
    private,
    city,
    state,
    organizerId: req.user.id,
  });

  res.status(201).json({
    id: group.id,
    organizerId: group.organizerId,
    name: group.name,
    about: group.about,
    type: group.type,
    private: group.private,
    city: group.city,
    state: group.state,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  });
});



// 5. Add an image to a group
router.post('/:groupId/images', requireAuth, async (req, res) => {

    const group = await Group.findByPk(req.params.groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group couldn't be found",
        statusCode: 404,
      });
    }

    if (group.organizerId !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized: You must be the organizer of this group to add an image",
        statusCode: 401,
      });
    }

    const { url, preview } = req.body;

    const image = await GroupImage.create({
      groupId: group.id,
      url,
      preview,
    });

    res.status(200).json({
      id: image.id,
      url: image.url,
      preview: image.preview,
    });

});







// 6. Edit a Group

router.put('/:groupId', requireAuth, async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;
  const {
    name,
    about,
    type,
    private,
    city,
    state
  } = req.body;

  // Check if the group exists
  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404
    });
  }

  // Check if the user is the organizer of the group
  if (group.organizerId !== user.id) {
    return res.status(403).json({
      message: "Unauthorized",
      statusCode: 403
    });
  }

  // Validate input fields


  // Update the group
  const updatedGroup = await group.update({
    name,
    about,
    type,
    private,
    city,
    state
  });

  return res.status(200).json(updatedGroup);
});




// 7. DELETE a Group

router.delete('/:groupId', requireAuth, async (req, res) => {
  const {user} = req;
  const {groupId} = req.params;


  const group = await Group.findOne(
    { where:
      { id: groupId,
        organizerId: user.id }
      });


  if (!group) {
    return res.status(404).json(
      {
       message: "Group couldn't be found",
       statusCode: 404
      });
  }

  await group.destroy();

  return res.status(200).json(
    {
      message: 'Successfully deleted',
      statusCode: 200
    });
});






//Validations for a Venue Group

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


//8. Create a new Venue for a Group specified by its id

router.post('/:groupId/venues', validateVenueGroup, requireAuth, async (req, res) => {
  const {user} = req;
  const { groupId } = req.params;

  const group = await Group.findOne({
    where: {
      id: groupId,
      organizerId: user.id
    }
  });

  const member = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: user.id,
      status: 'co-host'
    }
  })


  if (!group && !member) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }


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

  const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.create({
      groupId,
      address,
      city,
      state,
      lat,
      lng,
    });

    res.status(200).json({
      id: venue.id,
      groupId: venue.groupId,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      lat: venue.lat,
      lng: venue.lng,
    });

  })





// 9. Get All Venues for a Group specified by its id

router.get('/:groupId/venues', requireAuth, async (req, res) => {
  const {user} = req;
  const { groupId } = req.params;

  const group = await Group.findOne({
    where: {
      id: groupId,
      organizerId: user.id
    }
  });

  const member = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: user.id,
      status: 'co-host'
    }
  });

  if (!group && !member) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404
    });
  }


  const venues = await Venue.findAll({
    where: {
      groupId: group.id
    }
  });

  res.status(200).json({
    Venues: venues
  });
});










module.exports = router
