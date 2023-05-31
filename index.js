const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const config = require("./config/config");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const app = express();

dotenv.config();

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/Images", express.static("Images"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose
  .connect(
    `${config.database.db_protocol}://${config.database.db_user}:${config.database.db_pass}@${config.database.db_host}/${config.database.db_name}`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => console.log(error));

app.use("/", routes);

app.listen(config.port, () => {
  console.log("Express app running on PORT:", config.port);
});
