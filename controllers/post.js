const db = require("../db");

//getting all the post from the db
exports.allPosts = (req, res) => {
  let sql = `SELECT * FROM posts`;
  db.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Error in fetching posts", err });
    res.json(result);
  });
};

//getting all the post from the db near your location
exports.allPostsNearby = (req, res) => {
  let sql = `SELECT post_id,user_id,description,latitude,longitude,datetime , 111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(latitude)) * COS(RADIANS('${req.body.latitude}')) * COS(RADIANS(longitude - '${req.body.longitude}')) + SIN(RADIANS(latitude)) * SIN(RADIANS('${req.body.latitude}'))))) AS distance_in_km FROM posts`;
  db.query(sql, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error in fetching posts near you", err });
    }
    // console.log(result[0].RowDataPacket.distance_in_km);
    let r = JSON.stringify(result);
    let q = JSON.parse(r);
    let resu = [];
    console.log(req.body);
    q.map((x) => {
      if (x.distance_in_km < req.body.distance) {
        resu.push(x);
      }
    });
    res.status(200).json(resu);
    // res.status(200).json({ Name: "rishi" });
  });
};

// exports.insertPost=(req,res)=>{
//     let sql = `INSERT INTO POST(user_id)`;
//     db.query(sql, (err, result) => {
//       if (err)
//         return res.status(500).json({ error: "Error in fetching posts", err });
//       res.json(result);
//     });
// }
