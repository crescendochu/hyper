var fs = require("fs");
const port = 3000;
var express = require("express"),
  app = express();

var data = [];

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.post("/1", function (req, res) {
  var id = new Date().getTime();
  var userData = JSON.stringify(req.body);
  data.push({
    id: id,
    data: userData,
  });
  console.log(data);

  // fs.writeFile("test.txt", JSON.stringify(req.body), (err) => {
  //   if (err) throw err;
  //   console.log("The file has been saved!");
  //   return;
  // });

  // res.send("ok");
});

app.listen(port);
