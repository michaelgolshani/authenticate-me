const express = require('express');


const { EventImage, Group, Membership, User, Event } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const {Op} = require('sequelize')

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

  // const event = await Event.findByPk(image.eventId);

  // if(!event){
  //   return res.status(404).json({
  //     message: "Event couldn't be found"
  //   })
  // }

  const cohostMember = await Membership.findOne({
    where: {
      userId: user.id,

    }
  })


  // Find the associated event
  const event = await Event.findOne({
    where: {
      id: image.eventId
    },
    include: [
      {
        model: Group,
        as: 'group',
        where: {
          [Op.or]: [
            { organizerId: user.id },
            {
              '$group.Memberships.status$': 'co-host',
              '$group.Memberships.userId$': user.id
            },
          ],
        },
        include: [
          {
            model: Membership,
            as: 'Memberships',
            where: {
              userId: user.id
            },
          },
        ],
      },
    ],
  });

  if (!event) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }

  // Delete the image
  await image.destroy();

  res.status(200).json({
    message: 'Successfully deleted',
  });

})




module.exports = router
