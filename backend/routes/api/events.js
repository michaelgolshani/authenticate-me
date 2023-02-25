const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, Group, User, Membership, Venue, EventImage} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { validationResult } = require('express-validator');
const router = express.Router();


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
    return true; }),
check('venueId')
  .exists({checkFalsy:true})
  .withMessage('Venue does not exist'),
check('name')
  .exists({ checkFalsy: true })
  .withMessage('Name is required')
  .isLength({ max: 60, min:5 })
  .withMessage('Name must be at least 5 characters'),
check('type')
  .isIn(['Online', 'In person'])
  .withMessage("Type must be 'Online' or 'In person'"),
check('capacity')
  .isInt()
  .withMessage('Capacity must be an integer'),
check('price')
  .exists({ checkFalsy: true })
  .isFloat()
  .withMessage('Price is invalid'),
check('description')
  .exists({ checkFalsy: true })
  .isString()
  .withMessage('Description is required'),
check('startDate')
    .exists({checkFalsy: true})
    .withMessage('Start date must be in the future'),
check('endDate')
    .exists({checkFalsy: true})
    .withMessage('End date is less than start date')
];




//1. Get all Events

router.get ("/", async (req, res, next) => {

  const events  = await Event.findAll();
  return res.json({
    Events: events
  })
})





//2. Add an image to en Event based on the Events id

router.post("/:eventId/images", requireAuth, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { url, preview } = req.body;
    const {user} = req

    // Find the event
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json(
        { message: "Event couldn't be found",
          statusCode: 404
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
        message: "Group couldn't be found",
        statusCode: 404,
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

router.get("/:eventId", requireAuth, async (req,res,next) => {

  const eventId = req.params.eventId;

  Event.findByPk(eventId, {
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
      }
    ]
  })
  .then(event => {
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event couldn't be found", statusCode: 404 });
    }
  })
  .catch(err => {
    next(err);
  });

})




//Edit an Event

router.put('/:eventId', validateEvent, requireAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation error', statusCode: 400, errors: errors.mapped() });
  }

  const { eventId } = req.params;
  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
  // check if venue exists
  const venue = findVenueById(venueId);
  // if (!venue) {
  //   return res.status(404).json({ message: 'Venue could not be found', statusCode: 404 });
  // }
  // // check if event exists
  // const event = findEventById(eventId);
  // if (!event) {
  //   return res.status(404).json({ message: 'Event could not be found', statusCode: 404 });
  // }
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




module.exports = router
