const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PUBLIC HEALTH CHECK ENDPOINT
app.get('/health', (req, res) => {
  res.send('MediCrypt backend is healthy!');
});

// Other routes that may require authentication
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const accessRoutes = require('./routes/accessRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/access', accessRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
