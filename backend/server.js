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

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: allowedOrigins,
}));
app.use(express.json());

app.use('/api', homeRoute);
app.use('/api', aboutRoutes);
app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running at port : ${PORT}`);
});