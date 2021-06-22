const express = require("express");

const router = express();
const {
  allPosts,
  allPostsNearby,
  addPost,
  followPlace,
  unfollowPlace,
  userPosts,
  likePost,
  unlikePost,
  addcomment,
  removeComment,
  getImage,
} = require("../controllers/post");

router.get("/allposts", allPosts);
router.post("/allnearbyposts", allPostsNearby); //done
router.post("/addpost", addPost);
router.post("/followplace", followPlace);
router.post("/unfollowplace", unfollowPlace);
router.post("/userposts", userPosts);
router.post("/likepost", likePost); //done
router.post("/unlikepost", unlikePost); //done
router.post("/addcomment", addcomment);
router.post("/removecomment", removeComment);
router.post("/getImage", getImage);

module.exports = router;
