const dotenv = require('dotenv')
const app = require('./app')
const mongoose = require('mongoose')
dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)
// const DB = process.env.DATABASE_LOCAL
mongoose.connect(DB)
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully')
})

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`)
})

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected')
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`app is listen on port ${port}`)
})
