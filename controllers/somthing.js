const express = require('express');

// -------- MIDDLEWARES -------- 

// Middleware to set get user from database based on user id and set it in req.user
const userMiddleware = async (req, res, next) => {
  // get user id from cookies
  const userId = req.cookies['user-id'];
  if (userId) {
    req.user = await db.users.findFirstOrThrow({ userId: userId })
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

// Middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
  const isAdmin = req.user.role === "admin";
  if (isAdmin) {
    next(); // Proceed if admin
  } else {
    res.status(403).send('Access denied');
  }
};

// Middleware to check if the user is logged in
const protectedMiddleware = (req, res, next) => {
  const user = req.user;
  if (user) {
    next(); // Proceed if user is logged in
  } else {
    res.status(401).send('Unauthorized');
  }
}

// -------- PUBLIC ROUTES -------- 
const publicRouter = express.Router();

publicRouter.get('/', (req, res) => {
  res.send('This route is accessible to anyone');
});

// -------- PROTECTED ROUTES -------- 
const protectedRouter = express.Router();
protectedRouter.use(protectedMiddleware);

protectedRouter.get('/', (req, res) => {
  const user = req.user;
  res.send('This route is only accessible to logged in users');
});

// -------- ADMIN ROUTES -------- 
const adminRouter = express.Router();

adminRouter.use(adminMiddleware);

adminRouter.get('/', (req, res) => {
  res.send('Admin route only');
});

adminRouter.get('/settings', (req, res) => {
  res.send('Admin settings page');
});

// -------- MAIN SERVER CODE  -------- 
const app = express();

// First mount the user middleware so its called before every request
app.use(userMiddleware);

// Mount the routers
app.use('/', publicRouter);
app.use('/app', protectedRouter);
app.use('/admin', adminRouter);

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});