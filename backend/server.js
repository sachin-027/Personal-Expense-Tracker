const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/expense', require('./routes/expenseRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
