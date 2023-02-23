const express = require('express');


const { Group } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');


const router = express.Router();



// GET ALL GROUPS
router.get('/', async (req, res) => {
  const groups = await Group.findAll();
  return res.json(
    {
    Groups: groups
  });
});


// GET ALL GROUPS JOINED OR ORGANIZED BY CURRENT USER
router.get('/current', async (req, res) => {
  const { user } = req;
  const groups = await Group.findAll({
    where: {
      [Op.or]: [{ organizerId: user.id }, { id: { [Op.in]: user.groupIds } }],
    },
  });
  return res.json({ Groups: groups });
});


//Get details of a Group from an id






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
  handleValidationErrors,
];


// Create a Group

router.post('/', validateGroup, async (req, res) => {
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



module.exports = router
