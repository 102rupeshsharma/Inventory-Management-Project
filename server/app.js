require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
// const seedUsers = require('./seed/seedUsers');
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();


// connectDB().then(() => {
//   seedUsers();
// });
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'SmartAsset API is running.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
