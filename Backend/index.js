const express = require("express");
const app = express();
const { port } = require("./utils/config");
const {info} = require("./utils/logger");

app.listen(port => {
    info(`Server running on port ${port}`)
})