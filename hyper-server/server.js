var fs = require("fs");
const port = 3000;
var express = require("express"),
  app = express();

var data =[];

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.post("/1", function (req, res) {
  var id = new Date().getTime();
  const userData = JSON.stringify(req.body);
  data = userData;
  // data.push({
  //   id: id,
  //   data: userData,
  // });
  // data.push(userData);
  console.log("here");
  console.log(userData);
  console.log("here-end");

  // fs.appendFile("test.txt", JSON.stringify(req.body), (err) => {
  //   if (err) throw err;
  //   console.log("The file has been saved!");
  //   return;
  // });

  res.send("ok");
});

app.get('/1', function (req, res) {
  res.header("Access-Control-Allow_Origin","*");
  console.log("Getting Data");
  console.log(data);
  data2= JSON.stringify(data)
  console.log(data);
  console.log("Getting Data End");
  // console.log(JSON.stringify(data));
  res.send(data)
})

app.listen(port);
