const app = require('./app')
const { port } = require("./utils/config");
const {info} = require("./utils/logger");

app.listen(port, () => {
    info(`Server running on port ${port}`)
})