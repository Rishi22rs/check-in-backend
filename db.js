const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "checkin",
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("db connected...");
});

module.exports = connection;
