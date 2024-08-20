const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const executionRoute = require('./routes/executionRoute');
const postRoute = require('./routes/postRoute');
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const url = "mongodb://127.0.0.1:27017/BLOG"; // Updated database name
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("Error connecting to MongoDB:", err);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Use the execution route
app.use('/api/run', executionRoute);
app.use('/api/post', postRoute);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
