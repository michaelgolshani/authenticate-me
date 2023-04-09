const express = require('express');


const { EventImage, Group, Membership, User, Event } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize')

const router = express.Router();


//Delete an Image for an Event

router.delete("/:imageId", requireAuth, async (req, res) => {


  const { imageId } = req.params;
  const { user } = req;

  const image = await EventImage.findByPk(imageId);
  if (!image) {
    return res.status(404).json({
      message: "Event Image could't be found"
    })
  }



  //console.log(user)



  //console.log(image.eventId)
  const event = await Event.findByPk(image.eventId, {
    include: [
      {
        model: Group,
        attributes: ["id", "organizerId"]
      },
      {
        model: EventImage,
        attributes: ["id", "eventId", "url","preview"]
      }
    ]
  })

  //console.log(event)
  //console.log("GroupId", event.Group.organizerId)

  if (!event) {
    return res.status(404).json({
      message: "Event Image couldn't be found"
    })
  }


  const cohostMember = await Membership.findOne({
    where: {
      groupId: event.Group.id,
      userId: event.Group.organizerId,
      status: "co-host",
    }
  })


  if (!cohostMember && event.Group.organizerId !== user.id) {
    return res.status(404).json({
      message: "Forbidden"
    })
  }






  // Delete the image
  await image.destroy();

  res.status(200).json({
    message: 'Successfully deleted',
  });

})




module.exports = router
