const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/cases',         require('./routes/cases'));
app.use('/api/volunteers',    require('./routes/volunteers'));
app.use('/api/reports',       require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/settings',      require('./routes/settings'));
app.use('/api/map',           require('./routes/map'));
app.use('/api/translate',     require('./routes/translate'));
app.use('/api/ai',            require('./routes/ai'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'ResQLink API running' }));

app.use(errorHandler);

module.exports = app;
