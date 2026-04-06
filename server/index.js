const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

const auth = require('./middleware/auth');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', auth, require('./routes/patients'));
app.use('/api/services', auth, require('./routes/services'));
app.use('/api/bills', auth, require('./routes/bills'));
app.use('/api/payments', auth, require('./routes/payments'));
app.use('/api/dashboard', auth, require('./routes/dashboard'));

app.get('/', (req, res) => {
  res.json({ message: 'MediCare Hospital Billing API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));