const User = require('../models/userModel');
const Exercise = require('../models/exerciseModel');

exports.addExercise = async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const exercise = new Exercise({
      userId: _id,
      description,
      duration,
      date: date ? new Date(date) : new Date()
    });

    const savedExercise = await exercise.save();
    res.json({
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date.toDateString(),
      _id: user._id
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getLogs = async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let query = { userId: _id };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    let exercises = Exercise.find(query).select('description duration date');
    if (limit) exercises = exercises.limit(parseInt(limit));

    const log = await exercises.exec();

    res.json({
      username: user.username,
      count: log.length,
      _id: user._id,
      log: log.map(ex => ({
        description: ex.description,
        duration: ex.duration,
        date: ex.date.toDateString()
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
