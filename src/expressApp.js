const PORT = process.env.PORT || 3030;
const express = require("express");
const routes = require("./api/routes");
var cors = require("cors");
const app = express();

app.use(cors());
/* 
    add middlewares
*/
app.use(express.json());
app.use(routes);

function startServer() {
  app.listen(PORT, function () {
    console.log(`app listening on PORT ${PORT}`);
  });
}

module.exports = { startServer };
