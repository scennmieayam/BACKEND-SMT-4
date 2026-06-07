const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const postsRouter = require('./routes/posts');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: 'crud-express-mysql',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error'),
  };
  next();
});

app.get('/', (req, res) => {
  res.redirect('/posts');
});

app.use('/posts', postsRouter);

app.use((req, res) => {
  res.status(404).send('Halaman tidak ditemukan');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
