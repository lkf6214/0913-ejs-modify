// @ts-check
//  회원가입 기능을 모듈화

const express = require('express');

const mongoClient = require('./mongo');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', async (req, res) => {
  // db접속부터
  const client = await mongoClient.connect();
  const userCursor = client.db('kdt1').collection('user');
  const duplicated = await userCursor.findOne({ id: req.body.id });
  console.log(duplicated);

  if (duplicated === null) {
    const result = await userCursor.insertOne({
      id: req.body.id,
      password: req.body.password,
    });
    if (result.acknowledged) {
      res.status(200);
      res.send('회원 가입 성공!<br><a href="/login">로그인 페이지로 이동</a>');
    } else {
      res.status(500);
      res.send(
        '회원 가입 문제 발생.<br><a href="/register">회원가입 페이지로 이동</a>'
      );
    }
  } else {
    res.status(300);
    res.send(
      '중복된 id 가 존재합니다.<br><a href="/register">회원가입 페이지로 이동</a>'
    );
  }
});

// './' = 이미 연결되어있으니까 localhost:4000/register 이라는 뜻
module.exports = router;
