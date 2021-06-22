const db = require("../db");
const fs = require('fs')

//getting all the post from the db
exports.allPosts = (req, res) => {
  let sql = `SELECT * FROM posts`;
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error in fetching posts.", err });
    res.json(result);
  });
};

//getting all the post from the db near your location
exports.allPostsNearby = (req, res) => {
  let sql = `SELECT post_id,user_id,description,latitude,longitude,upvotes,datetime , 111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(latitude)) * COS(RADIANS(?)) * COS(RADIANS(longitude - ?)) + SIN(RADIANS(latitude)) * SIN(RADIANS(?))))) AS distance_in_km,EXISTS(SELECT 1 FROM vote WHERE post_id = posts.post_id AND user_id = posts.user_id limit 1) as liked FROM posts`;

  db.query(
    sql,
    [req.body.latitude, req.body.longitude, req.body.latitude],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error in fetching posts near you.", err });
      }
      // console.log(result[0].RowDataPacket.distance_in_km);r
      let r = JSON.stringify(result);
      let q = JSON.parse(r);
      let resu = [];
      q.map((x) => {
        if (x.distance_in_km < req.body.distance) {
          resu.push(x);
        }
      });
      res.status(200).json(resu);
      // res.json(result);
      // res.status(200).json({ Name: "rishi" });
    }
  );
};

// exports.insertPost=(req,res)=>{
//     let sql = `INSERT INTO POST(user_id)`;
//     db.query(sql, (err, result) => {
//       if (err)
//         return res.status(500).json({ error: "Error in fetching posts", err });
//       res.json(result);
//     });
// }

exports.addPost = (req, res) => {
  if (req.files === null) {
    res.status(400).json({ err: "No file uploaded." });
  }
  const salt = Date.now();
  if (req.files) {
    const file = req.files.fileData;
    file.mv(`${__dirname}/${salt + file.name}`, (err) => {
      if (err) {
        return res.status(500).json(err);
      }
    });

    let sql = `INSERT INTO posts (user_id,img_url,description,latitude,longitude,datetime) VALUES(?,?,?,?,?,?)`;
    let c = 0;
    db.query(
      sql,
      [
        req.body.user_id,
        `${API}${salt + file.name}`,
        req.body.description,
        req.body.latitude,
        req.body.longitude,
        req.body.datetime,
      ],
      (err, result) => {
        if (err)
          return res.json({
            error: "Error in uploading the post.",
            Error: err,
          });
        res.json(result);
      }
    );
  }
};

exports.followPlace = (req, res) => {
  const sql = `INSERT INTO following_location (user_id,latitude,longitude,datetime) VALUES (?,?,?,?)`;

  db.query(
    sql,
    [req.body.userid, req.body.latitude, req.body.longitude, req.body.datetime],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error while following the place", Error: err });
      res.json(result);
    }
  );
};

exports.unfollowPlace = (req, res) => {
  const sql = `DELETE FROM following_location WHERE following_location_id=?`;

  db.query(sql, [req.body.following_location_id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Error while unfollowing the place.", Error: err });
    res.json(result);
  });
};

exports.userPosts = (req, res) => {
  const sql = `SELECT * FROM posts WHERE user_id=?;SELECT SUM(upvotes) as total_posts FROM posts`;

  db.query(sql, [req.body.user_id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Error while fetching the posts.", Error: err });
    res.json(result);
  });
};

exports.likePost = (req, res) => {
  const sql = `UPDATE posts SET upvotes=upvotes+1 WHERE post_id=?;
  INSERT INTO vote (post_id,user_id,datetime) VALUES (?,?,?)`;

  db.query(
    sql,
    [req.body.post_id, req.body.post_id, req.body.user_id, req.body.datetime],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error while upvoting the post.", Error: err });
      res.json(result);
    }
  );
};

exports.unlikePost = (req, res) => {
  const sql = `UPDATE posts SET upvotes=upvotes-1 WHERE post_id=? AND user_id=?;
  DELETE FROM vote WHERE post_id=? AND user_id=?`;

  db.query(
    sql,
    [req.body.post_id, req.body.user_id, req.body.post_id, req.body.user_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error while downvoting the post.", Error: err });
      res.json(result);
    }
  );
};

exports.addcomment = (req, res) => {
  const sql = `INSERT INTO comment (user_id,comment,datetime) VALUES (?,?,?)`;

  db.query(
    sql,
    [req.body.user_id, req.body.comment, req.body.datetime],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error while posting the comment.", Error: err });
      res.json(result);
    }
  );
};

exports.removeComment = (req, res) => {
  const sql = `DELETE FROM comment WHERE comment_id=?`;

  db.query(sql, [req.body.comment_id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Error while removing the comment.", Error: err });
    res.json(result);
  });
};

exports.getImage = (req, res) => {
  console.log("hit ")
  fs.writeFile('./images/out.jpg', req.body.base64, 'base64', (err) => {
    if (err) throw err
  })
  res.json({ result: "done" });
};
