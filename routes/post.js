const express = require("express");

const router = express();
const { allPosts, allPostsNearby } = require("../controllers/post");

router.get("/allposts", allPosts);
router.post("/allnearbyposts", allPostsNearby);

module.exports = router;
