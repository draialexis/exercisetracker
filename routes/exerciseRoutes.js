const express = require('express');
const exerciseController = require('../controllers/exerciseController');

const router = express.Router();

router.post('/users/:_id/exercises', exerciseController.addExercise);
router.get('/users/:_id/logs', exerciseController.getLogs);

module.exports = router;
