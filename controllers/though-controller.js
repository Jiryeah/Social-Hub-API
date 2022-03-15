const res = require('express/lib/response');
const { Thoughts, Users } = require('../models');

const thoughtsController = {
  getAllThoughts(req, res) {
    Thoughts.find({})
      .then((dbThoughtsData) => res.json(dbThoughtsData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  getThoughtsById({ params }, res) {
    Thoughts.findOne({ _id: params.id })
      .then((dbThoughtsData) => {
        // if no pizza found, send 404
        if (!dbThoughtsData) {
          res.status(404).json({ message: 'No Thought found with this id!' });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  createThought({ params, body }, res) {
    Thoughts.create(body)
      .then(({ _id }) => {
        return Users.findOneAndUpdate(
          { _id: params.usersId },
          { $push: { thought: _id } },
          { new: true }
        );
      })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: 'User thought data not found.' });
          return;
        }
      })
      .catch((err) => res.status(400).json(err));
  },
  updateThoughts({ params }, res) {
    Thoughts.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: 'User thought data not found.' });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => res.status(400).json(err));
  },
  // Bonus functionality
  deleteThoughts({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.id })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          res.status(404).json({ message: 'User thought data not found.' });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
};
