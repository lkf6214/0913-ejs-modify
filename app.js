// @ts-check

const express = require('express');

// const bodyParser = require('body-parser');
// express 기본내장이 되어있어서 body-parser 지워야함

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = require('./routes');
// ./routes/index와 같은 말, index,js
const userRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const boardsRouter = require('./routes/board');
// const postsRouter = express.Router();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', router);
// 'localhost:4000/이 숨어있는 것'
app.use('/users', userRouter);
// userRouter부를 땐 이 주소 /users로 가져오겠다
app.use('/posts', postsRouter);
app.use('/board', boardsRouter);

app.use(express.static('public'));
// 프론트 파일

// 꼭 서버실행(listen) 바로 위에 있어야함. =맨 밑에 있어야함
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.end(err.message);
});

app.listen(PORT, () => {
  console.log(`The express server is running at ${PORT}`);
  // console.log(`http://localhost:${PORT}`);
});
