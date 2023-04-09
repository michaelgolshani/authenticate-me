const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, Group, User, Membership, Venue, EventImage, Attendance } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleQueryParameters, validateEvent } = require('../../utils/validation');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const router = express.Router();







//1. Get all Events

router.get("/", async (req, res, next) => {

  const { name, type, startDate } = req.query
  let { page, size } = req.query


  let query = {
    where: {},
    include: []
  };



  // Validate query parameters
  const errors = {};
  if (page < 1 || page > 10) {
    errors.page = 'Page must be between 1 and 10';
  }
  if (size < 1 || size > 20) {
    errors.size = 'Size must be between 1 and 20';
  }
  if (name && typeof name !== 'string') {
    errors.name = 'Name must be a string';
  }
  if (type && !['Online', 'In Person'].includes(type)) {
    errors.type = "Type must be 'Online' or 'In Person'";
  }
  if (startDate && isNaN(Date.parse(startDate))) {
    errors.startDate = 'Start date must be a valid datetime';
  }

  // If errors exist, return a 400 response with the errors object
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Bad Request', errors });
  }


  page === undefined ? 1 : parseInt(page);
  size === undefined ? 20 : parseInt(size);
  if (page >= 1 && size >= 1) {
    query.limit = size;
    query.offset = size * (page - 1);
  }


  if (name) {
    query.where.name = { [Op.like]: `%${name}%` };
  }
  if (type) {
    query.where.type = { [Op.eq]: type };
  }
  if (startDate) {
    query.where.startDate = { [Op.gte]: startDate };

  }



  // Get events with where and include options applied
  const events = await Event.findAll({
    ...query,
    include: [
      {
        model: Group,
        attributes: ['id', 'name', 'city', 'state']
      },
      {
        model: Venue,
        attributes: ['id', 'city', 'state']
      },
      {
        model: Attendance
      },
      {
        model: EventImage
      },
      ...query.include,
    ],
    attributes: [
      'id',
      'groupId',
      'venueId',
      'name',
      'type',
      'startDate',
      'endDate',
    ],

    // order: [['startDate', 'ASC']]
  });

  let preview;
  const eventObjects = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    eventObjects.push(event.toJSON())
  }

  for (let i = 0; i < eventObjects.length; i++) {
    const event = eventObjects[i];


    const attendances = await Attendance.findAll({
      where: {
        eventId: event.id
      }
    })
    event.numAttending = attendances.length;

    delete event.Attendances


    // console.log(event.EventImages)

    if (event.EventImages.length > 0) {
      for (let i = 0; i < event.EventImages.length; i++) {
        const image = event.EventImages[i]
        if (image.preview === true) {
          event.previewImage = image.url
          preview = event.previewImage
        }
      }
      if (!event.previewImage) {
        event.previewImage = "No event image for this group"
        preview = event.previewImage
      }

    } else {
      event.previewImage = "No event image for this group"
      preview = event.previewImage
    }

    delete event.EventImages
    //console.log(event)
  }

  //console.log(events)

  const eventsWithGroupAndVenue = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
   // console.log(i, event)
    eventsWithGroupAndVenue.push({
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      numAttending: event.Attendances.length,
      previewImage: event.previewImage,
      Group: event.Group,
      Venue: event.Venue
    });
  }

  return res.status(200).json({ Events: eventObjects });

});







//2. Add an image to an Event based on the Events id

router.post("/:eventId/images", requireAuth, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { url, preview } = req.body;
    const { user } = req

    // Find the event
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json(
        {
          message: "Event couldn't be found"
          // statusCode: 404
        });
    }

    // Check if the user is authorized to add an image
    const group = await Group.findOne({
      where: {
        id: event.groupId,
        organizerId: user.id
      }
    });
    const member = await Membership.findOne({
      where: {
        groupId: event.groupId,
        userId: user.id,
        status: 'co-host'
      }
    })
    if (!group && !member) {
      return res.status(404).json({
        message: "Group couldn't be found"
        //statusCode: 404,
      });
    }

    // Create the image
    const image = await EventImage.create(
      {
        url,
        preview,
        eventId
      });

    // Return the created image
    return res.status(200).json({
      id: image.id,
      url: image.url,
      preview: image.preview
    });
  } catch (error) {
    next(error);
  }
});





// 3. Get Details of event by Id

router.get("/:eventId", requireAuth, async (req, res, next) => {

  const eventId = req.params.eventId;

  const event = await Event.findByPk(eventId, {
    include: [
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state"]
      },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lat", "lng"]
      },
      {
        model: EventImage,
        attributes: ["id", "url", "preview"]
      },
      {
        model: Attendance
      }
    ]
  })

  if (!event) {
    return res.status(404).json({
      message: "Event couldn't be found"
    });
  }

  const attendances = await Attendance.findAll({
    where: {
      eventId: event.id
    }
  });

  const eventObject = event.toJSON();
  eventObject.numAttending = attendances.length;
  delete eventObject.Attendances;

  return res.status(200).json(eventObject);

})




//4. Edit an Event

router.put('/:eventId', validateEvent, requireAuth, async (req, res) => {


  const { eventId } = req.params;
  const userId = req.user.id
  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

  //console.log(req.user)
  //console.log(userId)
  //console.log(req.body)


  //Validation errors

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

  // // check if event exists
  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json(
      {
        message: 'Event could not be found'
        // statusCode: 404
      });
  }


  // check if venue exists
  const venue = await Venue.findByPk(venueId);
  if (!venue) {
    return res.status(404).json(
      {
        message: 'Venue could not be found'
        //statusCode: 404
      });
  }


  // check if group exists
  const group = await Group.findByPk(event.groupId);
  if (!group) {
    return res.status(404).json(
      {
        message: 'Group could not be found'
        //statusCode: 404
      });
  }



  // // check if current user is authorized to edit the event
  const member = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: userId,
      status: 'co-host'
    }
  })


  if (group.organizerId !== userId && !member) {
    return res.status(404).json({
      message: "Group couldn't be found"
      //statusCode: 404
    });
  }






  // // check if current user is authorized to edit the event
  // if (!isCurrentUserAuthorizedToEditEvent(event)) {
  //   return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
  // }
  // update event
  event.venueId = venueId;
  event.name = name;
  event.type = type;
  event.capacity = capacity;
  event.price = price;
  event.description = description;
  event.startDate = startDate;
  event.endDate = endDate;
  return res.status(200).json(event);
});


//5. Request to attend an event

router.post('/:eventId/attendance', requireAuth, async (req, res) => {

  const { eventId } = req.params;
  const { user } = req
  const userId = user.id

  // check if event exists
  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json(
      {
        message: 'Event could not be found'
      });
  }

  // // check if current user is a member of the group
  const member = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: userId
    }
  })

  //Throw error if not a member
  if (!member) {
    return res.status(404).json({
      message: "Forbidden"
      //statusCode: 404
    });
  }

  // check if user already has a pending attendance for the event
  const attendance = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: userId
    }
  });

  if (attendance && attendance.status === 'pending') {
    return res.status(400).json({
      message: "Attendance has already been requested"
    });
  }

  // check if user is already an accepted attendee of the event
  if (attendance && attendance.status === 'attending') {
    return res.status(400).json({
      message: "User is already an attendee of the event"
    });
  }

  // create a new attendance record for the user and event with pending status
  await Attendance.create({
    eventId: eventId,
    userId: userId,
    status: 'pending'
  });

  return res.status(200).json({
    userId: userId,
    status: 'pending'
  });


})


// 6. Change Attendance Status

router.put('/:eventId/attendance', requireAuth, async (req, res) => {
  const { eventId } = req.params;
  const { user } = req;
  const { userId, status } = req.body;

  // check if event exists
  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({
      message: 'Event could not be found'
    });
  }

  // check if user has membership in the group with a status of 'co-host'
  const membership = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: user.id,
      status: 'co-host'
    }
  });

  // check if group exists
  const group = await Group.findByPk(event.groupId);
  if (!group) {
    return res.status(404).json(
      {
        message: 'Group could not be found'
        //statusCode: 404
      });
  }

  // check if user is the organizer of the event
  if (group.organizerId !== user.id && !membership) {
    return res.status(403).json({
      message: 'Forbidden'
    });
  }

  // check if attendance exists
  const attendance = await Attendance.findOne({
    where: {
      eventId,
      userId
    }
  });

  if (!attendance) {
    return res.status(404).json({
      message: 'Attendance between the user and the event does not exist'
    });
  }

  // check if status is 'pending'
  if (status === 'pending') {
    return res.status(400).json({
      message: 'Cannot change an attendance status to pending'
    });
  }

  attendance.status = status;
  await attendance.save();

  res.status(200).json({
    id: attendance.id,
    eventId: attendance.eventId,
    userId: attendance.userId,
    status: attendance.status
  });
});


// 7. Get all Attendees of an Event
router.get('/:eventId/attendees', async (req, res) => {

  const { user } = req;
  const { eventId } = req.params;

  // check if event exists
  const event = await Event.findByPk(eventId);
  if (!event) {
    return res.status(404).json({
      message: 'Event could not be found'
    });
  }

  // check if user is authorized
  const group = await Group.findByPk(event.groupId);
  const member = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: user.id,
      status: 'co-host' // verifies if member of the group with a status of "co-host"
    }
  });

  if (group.organizerId !== user.id && !member) {
    // user is not authorized to view attendees
    const attendees = await Attendance.findAll({
      where: {
        eventId: event.id,
        status: {
          [Op.ne]: 'pending' // exclude attendees with pending status
        }
      },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }]
    });

    const attendeesArray = [];

    for (let i = 0; i < attendees.length; i++) {


      const attendee = attendees[i];

     // console.log(attendee.User)

      attendeesArray.push({
        id: attendee.User.id,
        firstName: attendee.User.firstName,
        lastName: attendee.User.lastName,
        Attendance: {
          status: attendee.status
        }
      });
    }

    return res.status(200).json({
      Attendees: attendeesArray
    });
  }

  // user is authorized to view attendees
  const attendees = await Attendance.findAll({
    where: {
      eventId: event.id
    },
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    }]
  });

  const attendeesArray = [];

  for (let i = 0; i < attendees.length; i++) {

    const attendee = attendees[i];

    // console.log(attendee.User)

    attendeesArray.push({
      id: attendee.User.id,
      firstName: attendee.User.firstName,
      lastName: attendee.User.lastName,
      Attendance: {
        status: attendee.status
      }
    });
  }

  return res.status(200).json({
    Attendees: attendeesArray
  });
})


// 8. Delete an Attendance
router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body;
  const { user } = req;

  const event = await Event.findByPk(eventId);

  if (!event) {
    return res.status(404).json({
      message: "Event couldn't be found"
    });
  }

  const attendance = await Attendance.findOne({
    where: {
      eventId: event.id,
      userId: userId
    }
  });

  const group = await Group.findByPk(event.groupId);

  //console.log(group.organizerId)
  //console.log(user.id)
  //console.log(attendance.userId)


  if (!attendance) {
    return res.status(404).json({
      message: "Attendance does not exist for this User"
    });
  }

  if (group.organizerId !== user.id && attendance.userId !== user.id) {
    return res.status(403).json({
      message: "Only the User or organizer may delete an Attendance"
    });
  }


  await attendance.destroy();

  return res.status(200).json({
    message: "Successfully deleted attendance from event"
  });
});



//9. Delete an event

router.delete('/:eventId', requireAuth, async (req, res) => {

  const { user } = req
  const { eventId } = req.params

 // console.log(user)
  //console.log(user.id)
 //console.log(eventId)


  const event = await Event.findByPk(eventId);

  if (!event) {
    return res.status(404).json(
      {
        message: 'Event could not be found'
        //statusCode: 404
      });
  }

  const group = await Group.findByPk(event.groupId);

  if (!group) {
    return res.status(404).json(
      {
        message: 'Group could not be found'
        //statusCode: 404
      });
  }

  // // check if current user is authorized to edit the event
  const member = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: user.id,
      status: 'co-host'
    }
  })


  if (group.organizerId !== user.id && !member) {
    return res.status(404).json({
      message: "Forbidden"
      //statusCode: 404
    });
  }

  await Event.destroy({ where: { id: eventId } });

  return res.status(200).json(
    {
      message: 'Successfully deleted'
      //statusCode: 200
    });

})

module.exports = router
