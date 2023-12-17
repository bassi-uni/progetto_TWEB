const express = require('express');
const {getAllRoom, getOneRoom, deleteRoom, createRoom, getAllUserRoom, updateRoom , newMessage, joinRoom} = require('../controllers/room');
const {protect} = require("../controllers/special/authController");
const router = express.Router();

router.route('/').get(getAllRoom).post(protect, createRoom);
router.route('/:id').get(getOneRoom).patch(updateRoom).delete(deleteRoom);
router.route('/user/:id').get(getAllUserRoom);
router.route('/newMessage/:roomID').post(protect, newMessage);
router.route('/join/:roomID').post(protect, joinRoom);
module.exports = router;