const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const auth = require('./middleware/auth');

app.use('/api/auth', require('./routes/auth'));

app.use('/api/patients', auth, require('./routes/patients'));
app.use('/api/services', auth, require('./routes/services'));
app.use('/api/bills', auth, require('./routes/bills'));
app.use('/api/payments', auth, require('./routes/payments'));
app.use('/api/dashboard', auth, require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

module.exports = app;