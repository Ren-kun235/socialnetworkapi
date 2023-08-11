const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    createUser,
    deleteUser,
    addThought,
    removeThought,
} = require("../../controllers/userController");

router.route("/").get(getUsers).post(createUser);

router.route("/:userId").get(getSingleUser).delete(deleteUser);

router.route("/:userId/thought").post(addThought);

router.route("/:userId/thought/:thoughtId").delete(removeThought);

module.exports = router;