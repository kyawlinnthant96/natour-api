const dotenv = require("dotenv")
const app = require('./app')
dotenv.config({path: "./config.env"});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`app is listen on port ${port}`)
})


