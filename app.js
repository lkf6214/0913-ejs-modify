// @ts-check

const express = require('express');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoClient = require('./routes/mongo');

// const bodyParser = require('body-parser');
// express 기본내장이 되어있어서 body-parser 지워야함

const app = express();
const PORT = 4000;

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session
app.use(
  session({
    secret: 'lkf',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      // id, pw 로 사용할 키 값 설정
      usernameField: 'id',
      passwordField: 'password',
    },

    // 실제 로그인 기능 구현 부분
    async (id, password, cb) => {
      // 서버에 유저 정보를 전달하여 id 가 있는지 확인
      const client = await mongoClient.connect();
      const userCursor = client.db('kdt1').collection('users');
      const idResult = await userCursor.findOne({ id });
      // id가 존재하면 비밀번호 까지 있는지 확인하기
      if (idResult !== null) {
        if (idResert.password === password) {
          cb(null, idResult);
        } else {
          // 각각 상황에 맞는 에러 메세지 전달
          cb(null, false, { message: '비밀번호가 틀렸습니다.' });
        }
      } else {
        cb(null, false, { message: '해당 id 가 없습니다.' });
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cd) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('kdt1').collection('users');
  const result = await userCursor.findOne({ id });
  if (result !== null) cb(null, result);
});

const router = require('./routes');
// ./routes/index와 같은 말, index,js
// const userRouter = require('./routes/users');
// const postsRouter = require('./routes/posts');
// // 게시판 필요하면 위에 두개 다시 주석 제거하기
const boardsRouter = require('./routes/board');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const { LoggerLevel } = require('mongodb');
// const postsRouter = express.Router();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', router);
// 'localhost:4000/이 숨어있는 것'
// app.use('/users', userRouter);
// // userRouter부를 땐 이 주소 /users로 가져오겠다
// app.use('/posts', postsRouter);
// // 게시판 필요하면 위에 두개 다시 주석 제거하기
app.use('/board', boardsRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

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
function cb(arg0, result) {
  throw new Error('Function not implemented.');
}
