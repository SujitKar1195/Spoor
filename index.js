require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');
const Task = require('./db/taskModel');

const app = express();
const PORT = process.env.PORT || 8080;

let corsOptions = {
  origin: [
    'http://localhost:8000',
    'https://vercel.com/skar54322gmailcoms-projects/b-goal-ways',
  ],
};

app.use(cors(corsOptions));

const connectDatabase = require('./db/connection');
const {checkForAuthenticationCookie} = require('./middlewares/authentication');
const {validateToken} = require('./services/authentication');
// view
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// middleware
app.use(express.static(path.resolve('./')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use('/user', userRoute);
app.use('/task', taskRoute);

app.get('/', async (req, res) => {
  const token = req.cookies['token'];
  if (!token) return res.redirect('/user/login');
  const userPayload = validateToken(token);
  const userId = userPayload['_id'];
  const allTasks = await Task.find({createdBy: userId});
  return res.render('home', {
    user: req.user,
    tasks: allTasks,
  });
});
// server
function server() {
  connectDatabase();
  app.listen(PORT, () => {
    console.log(`server is listening on port:${PORT}`);
  });
}

server();
