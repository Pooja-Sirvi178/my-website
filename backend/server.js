require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const homeRoute = require('./routes/homeRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', homeRoute);
app.use('/api', aboutRoutes);
app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running at port : ${PORT}`);
});