require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); //allow us to post GET request or POST request;
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(request, response) {


  response.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  //turn data format from java script object to a JSON string format
  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;

  const options = {
    method: "POST",
    auth: "anyName:"+process.env.API_KEY
  }

  //can check docuementation on node js about http
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.redirect("/failure");
    }


  // code to check what data mailchimp send to us:
    response.on("data", function(data) {
      console.log(JSON.parse(data))
    })
  })

  //pass the json data to mailchimp API
  request.write(jsonData);
  request.end();


})

app.get("/success", function(req, res) {
  res.sendFile(__dirname + "/success.html");
})

app.get("/failure", function(req, res) {
  res.sendFile(__dirname + "/failure.html");
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.")
})
