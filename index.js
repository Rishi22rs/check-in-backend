const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const postRouter = require("./routes/post");
const { allPosts } = require("./controllers/post");

app.get("/", (req, res) => {
  res.send("Yeah i am fine");
});

//Middlewares
app.use(bodyParser({ limit: "50mb" }));
app.use(cors());
app.use('/uploads/images',express.static('images'))

app.use("/api", postRouter);

app.listen(6969, () => console.log(`runnin fine at ${6969} xD`));
