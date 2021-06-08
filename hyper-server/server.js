var fs = require("fs");
const port = 3000;
var express = require("express"),
  app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

var RESULT_FOLDER = "result";

app.use(express.json());

app.get("/11", function (req, res) {
  //   res.render("form"); // if jade
  //   // You should use one of line depending on type of frontend you are with
  //   res.sendFile(__dirname + "/form.html"); //if html file is root directory
  //   res.sendFile("index.html"); //if html file is within public directory

  console.log(req.body);
  //   console.log(username);
});

app.post("/1", function (req, res) {
  //   var username = req.body.username;
  //   var htmlData = "Hello:" + username;
  //   res.send(htmlData);

  console.log(req.body);
  fs.writeFile("test.txt", JSON.stringify(req.body), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
});

app.listen(port);
