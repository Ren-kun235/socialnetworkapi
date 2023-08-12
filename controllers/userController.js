const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require("../models");

const userThoughts = async () =>
    User.aggregate()
        .count("userThought")
        .then((userThought) => userThought);

const thought = async (userId) =>
    User.aggregate([
        { $match: { _id: ObjectId(userId) } },
        {
            $unwind: "$reaction",
        },
        {
            $group: {
                _id: ObjectId(userId),
                allThought: { $: "$reaction"},
            },
        },
    ]);
    module.exports = {
        getUser(req, res) {
          User.find()
            .then(async (users) => {
              const userObj = {
                users,
                thought: await thought(),
              };
              return res.json(userObj);
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json(err);
            });
        },
        getSingleUser(req, res) {
          User.findOne({ _id: req.params.userId })
            // .select('-__v')
            .then(async (user) =>
              !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json({
                    user,
                    thought: await reaction(req.params.userId),
                  })
            )
            .catch((err) => {
              console.log(err);
              return res.status(500).json(err);
            });
        },
        createUser(req, res) {
          User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
        },
        deleteUser(req, res) {
          User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
              !user
                ? res.status(404).json({ message: 'No such user exists' })
                : Thought.findOneAndUpdate(
                    { user: req.params.userId },
                    { $pull: { user: req.params.userId } },
                    { new: true }
                  )
            )
            .then((thought) =>
              !thought
                ? res.status(404).json({
                    message: 'User deleted, but no thoughts found',
                  })
                : res.json({ message: 'User successfully deleted' })
            )
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            });
        },
        addThought(req, res) {
          console.log('You are adding a thought');
          console.log(req.body);
          User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { thought: req.body } },
            { runValidators: true, new: true }
          )
            .then((user) =>
              !user
                ? res
                    .status(404)
                    .json({ message: 'No user found with that ID :(' })
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
        },
        removeThought(req, res) {
          User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { thought: { thoughtId: req.params.thoughtId } } },
            { runValidators: true, new: true }
          )
            .then((user) =>
              !user
                ? res
                    .status(404)
                    .json({ message: 'No user found with that ID :(' })
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
        },
      };
      