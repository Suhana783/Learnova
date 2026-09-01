const express = require('express');
const app = express();
const morgan = require('morgan');

// middlewares
app.use(express.json());
app.use(morgan('dev'));

// health
app.get('/', (req, res) => {
    return res.send('route is working fine');
});

// Routes
app.use('/api/auth', require('./route/auth.route'));
app.use('/api/courses', require('./route/course.route'));
app.use('/api/users', require('./route/user.route'));
app.use('/api/enroll', require('./route/enroll.route'));
app.use('/api/assignments', require('./route/assignment.route'));

// Error handler 
app.use(require('./middlewares/error.middleware'));

module.exports = app;