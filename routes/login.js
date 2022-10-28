// @ts-check

const express = require('express');

const passport = require('passport');

const mongoClient = require('./mongo');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) {
      return res.send(
        `${(info, message)}<br><a href="/login"> 로그인 페이지로 이동 </a>'`
      );
    }
    req.login(user, (err) => {
      if (err) throw err;
      res.redirect('/board');
    })(req, res, next);
  });

  const client = await mongoClient.connect();
  const userCursor = client.db('kdt1').collection('user');
  const idResult = await userCursor.findOne({ id: req.body.id });

  if (idResult !== null) {
    if (idResult.password === req.body.password) {
      // 로그인 성공한 시점에 session.login을 통해 확인 가능
      req.session.login = true;
      req.session.userId = req.body.id;
      res.redirect('/board');
    } else {
      res.status(300);
      res.send(
        '비밀번호가 틀렸습니다.<br><a href="/login">로그인 페이지로 이동</a>'
      );
    }
  } else {
    res.status(300);
    res.send(
      '해당 id가 없습니다. <br><a href="/login">로그인 페이지로 이동</a>'
    );
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;
