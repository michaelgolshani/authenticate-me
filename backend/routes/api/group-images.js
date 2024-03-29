const express = require('express');


const { GroupImage,Group,Membership, } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();



// Delete an Image for a Group
router.delete('/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const {user} = req;

    const image = await GroupImage.findByPk(imageId);

    if (!image) {
      return res.status(404).json({
        message: "Group Image couldn't be found"
      });
    }

    const group = await Group.findByPk(image.groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group couldn't be found"
      });
    }

    const cohostMember = await Membership.findOne({
      where: {
        groupId: group.id,
        userId: user.id,
        status: 'co-host'
      }
    });

    if (group.organizerId !== user.id && !cohostMember) {
      return res.status(401).json({
        message: "Forbidden"
      });
    }

    await image.destroy();

    return res.status(200).json({
      message: "Successfully deleted"
    });


});





module.exports = router
