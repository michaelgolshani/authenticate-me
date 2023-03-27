const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, Venue, User, Membership, Event } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');


const { validationResult } = require('express-validator');


const router = express.Router();



// 1. GET ALL GROUPS
router.get('/', async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: Membership,

      },
      {
        model: GroupImage
      }
    ]
  })

  const groupObjects = [];
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    groupObjects.push(group.toJSON())
  }


  for (let i = 0; i < groupObjects.length; i++) {
    const group = groupObjects[i];

    const memberships = await Membership.findAll({
      where: {
        groupId: group.id
      }
    })
    group.numMembers = memberships.length;

    delete group.Memberships


    if (group.GroupImages.length > 0) {
      for (let i = 0; i < group.GroupImages.length; i++) {

        const image = group.GroupImages[i]
        if (image.preview === true) {
          group.previewImage = image.url
        }
      }
      if (!group.previewImage) {
        group.previewImage = "No group image for this group"
      }

    } else {
      group.previewImage = "No group image for this group"
    }

    delete group.GroupImages
  }


  return res.json(
    {
      Groups: groupObjects
    });
});



// 2. GET ALL GROUPS JOINED OR ORGANIZED BY CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;


  const groups = await Group.findAll({
    where: {
      [Op.or]: [{ organizerId: user.id }] // { id: { [Op.in]: user.groupIds } }],
    },
    include: [
      {
        model: GroupImage
      },
      {
        model: Membership
      }
    ]
  });

  if (!groups) {
    return res.status(404).json({
      message: "Group couldn't be found"
    })
  }

  const groupObjects = [];
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    groupObjects.push(group.toJSON())
  }



  for (let i = 0; i < groupObjects.length; i++) {
    const group = groupObjects[i];

    const memberships = await Membership.findAll({
      where: {
        groupId: group.id
      }
    })
    group.numMembers = memberships.length;

    delete group.Memberships


    if (group.GroupImages.length > 0) {
      for (let i = 0; i < group.GroupImages.length; i++) {
        console.log(group.GroupImages)
        const image = group.GroupImages[i]
        if (image.preview === true) {
          group.previewImage = image.url
        }
      }
      if (!group.previewImage) {
        group.previewImage = "No group image for this group"
      }

    } else {
      group.previewImage = "No group image for this group"
    }



    delete group.GroupImages
  }


  return res.status(200).json({
    Groups: groupObjects
  });
});


// 3. Get details of a Group from an id

router.get('/:groupId', async (req, res) => {



  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: GroupImage,
        attributes: ['id', 'url', 'preview'],
      },
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: Venue,
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
      },
      {
        model: Membership,
        attributes: ['status']
      },
    ],
  });



  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found"
      //statusCode: 404,
    });
  }

  // const groupObjects = [];
  // for (let i = 0; i < 1; i++) {
  //   const groupObject = group.toJSON();
  //   groupObjects.push(groupObject)
  // }



  // for (let i = 0; i < groupObjects.length; i++) {
  //   const group = groupObjects[i];

  //   const memberships = await Membership.findAll({
  //     where: {
  //       groupId: group.id
  //     }
  //   })
  //   group.numMembers = memberships.length;

  //   delete group.Memberships


  //   if (group.GroupImages.length > 0) {
  //     for (let i = 0; i < group.GroupImages.length; i++) {
  //       console.log(group.GroupImages)
  //       const image = group.GroupImages[i]
  //       if (image.preview === true) {
  //         group.previewImage = image.url
  //       }
  //     }
  //     if (!group.previewImage) {
  //       group.previewImage = "No group image for this group"
  //     }

  //   } else {
  //     group.previewImage = "No group image for this group"
  //   }



  //   delete group.GroupImages
  // }




  const groupData = {
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
    numMembers: group.Memberships.length,
    GroupImages: group.GroupImages,
    Organizer: group.User,
    Venues: group.Venues,
  };

  res.status(200).json(groupData);
});





// Validations for "Create A Group"
const validateGroup = [
  check('name')
    .exists({ checkFalsy: true })
    //.withMessage('Name is required')
    .withMessage('Name must be 60 characters or less')
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
      message: "Group couldn't be found"
      //statusCode: 404,
    });
  }

  if (group.organizerId !== req.user.id) {
    return res.status(404).json({
      message: "Forbidden"
      //statusCode: 404,
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

router.put('/:groupId', validateGroup, requireAuth, async (req, res) => {

  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    return res.status(400).json({
      "message": "Validation Error",
      "errors": errors
    })
  }

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
      message: "Group couldn't be found"
      //statusCode: 404
    });
  }

  // Check if the user is the organizer of the group
  if (group.organizerId !== user.id) {
    return res.status(404).json({
      message: "Forbidden"
      //statusCode: 404
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
  const { user } = req;
  const { groupId } = req.params;


  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json(
      {
        message: "Group couldn't be found"
        //statusCode: 404
      });
  }

  if (group.organizerId !== user.id) {
    return res.status(404).json({
      message: "Forbidden"
    });
  }

  await group.destroy();

  return res.status(200).json(
    {
      message: 'Successfully deleted'
      //statusCode: 200
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
  const { user } = req;
  let { groupId } = req.params;

  groupId = parseInt(groupId)  // had to parseINT groupID since it was returning as a string?

  const group = await Group.findOne({
    where: {
      id: groupId,

    }
  });

  if(!group) {
    return res.status(404).json({
      message: "Group couldn't be found"
    })
  }


  const organizerGroup = await Group.findOne({
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


  if (!organizerGroup && !member) {
    return res.status(404).json({
      message: "Forbidden"
      //statusCode: 404,
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
  const { user } = req;
  const { groupId } = req.params;

  const group = await Group.findOne({
    where: {
      id: groupId,
      //organizerId: user.id   // verifies if the USER has the organizer id and is authenticated
    }
  });


  console.log(group)
  console.log("---------")

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found"
      //statusCode: 404
    });
  }

  //AUTHENTICATION

  const member = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: user.id,
      status: 'co-host' // verifies if member of the group with a status of "co-host"
    }
  });

  console.log("-----------------------------")
  console.log(member)
  console.log("-----------------------------")
  console.log("group.organizerId", group.organizerId)
  console.log("-----------------------------")
  console.log("user.id", user.id)
  console.log("-----------------------------")
  //console.log("member.status", member.status)
  console.log("-----------------------------")


  if (group.organizerId !== user.id && !member) {
    return res.status(404).json({
      message: "Forbidden"
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














const validateEvent = [
  check('venueId')
    .custom(async (value) => {
      const venue = await Venue.findOne(
        {
          where:
          {
            groupId: value
          }
        });
      if (!venue) {
        throw new Error('Venue does not exist');
      }
      return true;
    }),
  check('venueId')
    .exists({ checkFalsy: true })
    .withMessage('Venue does not exist'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isLength({ max: 60, min: 5 })
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  check('capacity')
    .isInt()
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Price is invalid'),
  check('description')
    .exists({ checkFalsy: true })
    .isString()
    .withMessage('Description is required'),
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date must be in the future'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is less than start date')
];





// 10. Create an Event for a Group specified by its id

router.post("/:groupId/events", validateEvent, requireAuth, async (req, res, next) => {

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



  const { groupId } = req.params
  const { user } = req
  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body



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
      message: "Group couldn't be found"
    })
  }

  // Create the event
  const event = await Event.create({
    venueId,
    groupId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate,
  });

  const eventId = event.id

  res.status(200).json({
    id: eventId,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate
  });
})



//11. Get all Events by group id

router.get('/:groupId/events', requireAuth, async (req, res, next) => {

  const groupId = req.params.groupId;

  const group = await Group.findOne({ where: { id: groupId } });

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found"
    });
  }

  const events = await Event.findAll({
    where: { groupId: groupId },
    include: [
      {
        model: Group,
        attributes: ['id', 'name', 'city', 'state']
      },
      {
        model: Venue,
        attributes: ['id', 'city', 'state']
      }
    ],
    order: [['startDate', 'ASC']]
  });

  const eventsWithGroupAndVenue = events.map(event => {
    return {
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      numAttending: event.numAttending,
      previewImage: event.previewImage,
      Group: event.Group,
      Venue: event.Venue
    };
  });

  return res.status(200).json({ Events: eventsWithGroupAndVenue });
});


//12. Get all Members of a group specified by its id

router.get('/:groupId/members', async (req, res) => {
  const { groupId } = req.params;
  const { user } = req
  console.log(user)
  console.log(user.id)
  const group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found"
    });
  }

  const cohostMember = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: user.id,
      status: 'co-host'
    }
  })

  let memberships;

  if (group.organizerId == user.id || cohostMember) {
    memberships = await Membership.findAll({
      where: {
        groupId: groupId,
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    });
  } else {
    memberships = await Membership.findAll({
      where: {
        groupId: groupId,
        status: {
          [Op.ne]: 'pending'
        }
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    });
  }

  const members = memberships.map(membership => {
    return {
      id: membership.User.id,
      firstName: membership.User.firstName,
      lastName: membership.User.lastName,
      Membership: {
        status: membership.status
      }
    };
  });

  return res.status(200).json({
    Members: members
  });
});



// 13. Request a Membership for a Group based on the Group's id
router.post("/:groupId/membership", requireAuth, async (req, res, next) => {

  const { groupId } = req.params;
  const { user } = req;

  
  const status = "pending";

  // Find the group
  const group = await Group.findOne({
    where: {
      id: groupId,
    },
  });
  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found"
    });
  }

  // Check if the user already has a pending membership request for the group
  const existingPendingMembership = await Membership.findOne({
    where: {
      groupId: group.id,
      userId: user.id,
      status: "pending",
    },
  });

  console.log(group.id)
  console.log("/////////////")
  console.log(existingPendingMembership)

  if (existingPendingMembership) {
    return res.status(400).json({
      message: "Membership has already been requested"
    });
  }

  // Check if the user is already a member of the group
  const existingMembership = await Membership.findOne({
    where: {
      groupId: group.id,
      userId: user.id,
      status: ["co-host", "pending", "member"]
    },
  });
  if (existingMembership) {
    return res.status(400).json({
      message: "User is already a member of the group"
    });
  }

  // Create a new membership request for the group
  const membership = await Membership.create({
    groupId: group.id,
    userId: user.id, // The user id for the new membership should come from req.user
    status,
  });

  // Return the created membership request
  return res.status(200).json({ memberId: membership.userId, status: membership.status });

});




// 14. Change Membership Status

router.put("/:groupId/membership", requireAuth, async (req, res) => {

  const { user } = req;
  const { groupId } = req.params;
  const { memberId } = req.body;
  const { status } = req.body;


  const validUser = await User.findByPk(memberId)
  if (!validUser) {
    return res.status(404).json({
      message: "User couldn't be found"
    })
  }

  // Check if group exists
  const group = await Group.findOne({
    where:
    {
      id: groupId
    }
  })

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found"
    });
  }


  // Check if membership exists
  const member = await Membership.findOne({
    where:
    {
      groupId: groupId,
      userId: memberId
    }
  })

  if (!member) {
    return res.status(404).json({
      message: 'Membership between the user and the group does not exist',
    });
  }

  const cohostMember = await Membership.findOne({
    where:
    {
      groupId: groupId,
      userId: user.id,
      status: "co-host"
    }
  })


  // AUTHORIZATION
  // To change the status from "pending" to "member":
  if (member.status == 'pending' && status == "member") {

    if (group.organizerId !== user.id && !cohostMember) {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }
  }

  // To change the status from "member" to "co-host"
  if (member.status == 'member' && status == "co-host") {
    if (group.organizerId !== user.id) {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }
  }

  // Check if status is "pending"
  if (status == "pending") {
    return res.status(400).json({
      message: "Validations Error",
      errors: {
        status: "Cannot change a membership status to pending"
      }
    });
  }

  member.status = status
  await member.save()

  res.status(200).json({
    id: member.id,
    groupId: parseInt(groupId),
    memberId: memberId,
    status: member.status
  })

});




//15. Delete membership to a group specified by id
router.delete('/:groupId/membership', requireAuth, async (req, res) => {
  const { groupId } = req.params;
  const { memberId } = req.body;
  const { user } = req;

  // check if group exists
  const group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({
      message: 'Group could not be found'
    });
  }

  // if(memberId !== user.id){
  //   return res.status(400).json({
  //     message: 'Forbidden'
  //   })
  // }


  // check if member exists
  const validUser = await User.findByPk(memberId);
  if (!validUser) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: { memberId: 'User could not be found' },
    });
  }

  // check if membership exists for member
  const member = await Membership.findOne({
    where: {
      groupId,
      userId: memberId
    },
  });
  if (!member) {
    return res.status(404).json(
      {
        message: 'Membership does not exist for this User'
      });
  }

  // check if user is authorized to delete membership
  if (group.organizerId !== user.id && member.userId !== user.id) {
    return res.status(403).json(
      {
        message: 'Forbidden'
      }
    );
  }

  // delete membership
  await member.destroy();

  return res.status(200).json({
    message: 'Successfully deleted membership from group',
  });
});






module.exports = router
