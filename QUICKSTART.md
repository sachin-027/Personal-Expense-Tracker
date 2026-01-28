# QUICK START GUIDE - Expense Tracker

## Step 1: Install Backend Dependencies

Open PowerShell in the backend folder and run:

```powershell
cd "c:\Users\sachi\Desktop\Expanse tracker\backend"
npm install
```

## Step 2: Install Frontend Dependencies

Open a new PowerShell window in the frontend folder and run:

```powershell
cd "c:\Users\sachi\Desktop\Expanse tracker\frontend"
npm install
```

## Step 3: Start the Backend Server

In the backend PowerShell window:

```powershell
npm start
```

You should see:
- "Server running on port 5000"
- "MongoDB Connected: ..."

## Step 4: Start the Frontend

In the frontend PowerShell window:

```powershell
npm start
```

The application will automatically open in your browser at http://localhost:3000

## Step 5: Create Your Account

1. Click "SignUp" on the login page
2. Choose a profile avatar
3. Enter your name, email, and password (minimum 8 characters)
4. Click "SIGN UP"

## Step 6: Start Using the App

- **Dashboard**: View your financial overview with charts and summaries
- **Income**: Add your income sources (Salary, Freelance, etc.)
- **Expense**: Track your expenses (Shopping, Travel, Bills, etc.)
- **Download**: Export your data as Excel reports

## Troubleshooting

### If backend fails to start:
- Check if MongoDB connection string is correct in `backend/.env`
- Ensure you have internet connection (for MongoDB Atlas)

### If frontend fails to start:
- Make sure backend is running first on port 5000
- Check if port 3000 is available

### If you can't login:
- Make sure you've created an account first using SignUp
- Password must be at least 8 characters

## Default Configuration

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Database**: MongoDB Atlas (already configured)

## Features You Can Use

✅ User authentication with JWT
✅ Add/Delete income and expenses
✅ View interactive charts (Pie, Bar, Line)
✅ Download Excel reports
✅ Responsive design for mobile and desktop
✅ Real-time data updates

## Support

If you encounter any issues:
1. Make sure both backend and frontend are running
2. Check the console for error messages
3. Ensure MongoDB connection is working
4. Try clearing browser cache and refreshing

Enjoy tracking your expenses! 💰📊
