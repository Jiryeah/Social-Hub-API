const { Thought, Users } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find()
      // descending order
      .sort({ createdAt: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No Thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return Users.findOneAndUpdate(
          { _id: params.usersId },
          { $push: { Thought: _id } },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'User Thought data not found.' });
          return;
        }
      })
      .catch((err) => res.status(400).json(err));
  },
  updateThought({ params }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'User Thought data not found.' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
  // Bonus functionality
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'User Thought data not found.' });
          return;
        }
        return User.findOneAndUpdate(
          { thoughts: params.Id },
          { $pull: { thoughts: params.Id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: `Thought has been created but there's user with this id!` });
        }
        res.json({ message: 'Thought deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, { $push: { reactions: body } }, { new: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtController;
