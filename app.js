import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve up the css and images statically
app.use(express.static("public"));

// listen for http requests
app.listen(8081, () => {
  console.log("CORS-enabled web server listening on port 8081");
});
