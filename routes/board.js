const express = require('express');

const router = express.Router(); // express의 router 기능을 쓰겠다
const mongoClient = require('./mongo');

const { MongoClient, ServerApiVersion, MinKey } = require('mongodb');

const uri =
  'mongodb+srv://lkf6214:f19940501@cluster0.etnufua.mongodb.net/?retryWrites=true&w=majority';

// callback !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! async await로 수정
router.get('/', async (req, res) => {
  // 글 전체 목록 보여주기
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const ARTICLE = await cursor.find({}).toArray();
  const articleLen = ARTICLE.length;
  res.render('board', { ARTICLE, articleCounts: articleLen });
});

router.get('/write', (req, res) => {
  // 글 쓰기 모드로 이동
  res.render('board_write');
});

router.post('/write', async (req, res) => {
  // 글 추가 기능 수행
  // required 처리를 front 에서 해줬기 때문에 사실 예외처리 안해줘도 된다..?
  if (req.body.title && req.body.content) {
    const newArticle = {
      title: req.body.title,
      content: req.body.content,
    };
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    await cursor.insertOne(newArticle);
    res.redirect('/board');
  } else {
    const err = new Error('데이터가 없습니다');
    err.statusCode = 404;
    throw err;
  }
});

router.get('/modify/title/:title', async (req, res) => {
  // 글 수정 모드로 이동
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const selectedArticle = await cursor.findOne({ title: req.params.title });
  res.render('board_modify', { selectedArticle });
});

// async await 하면 코드 제일 깔끔해지는 부분
router.post('/modify/title/:title', async (req, res) => {
  // 글 수정 기능 수행
  if (req.body.title && req.body.content) {
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    await cursor.updateOne(
      { title: req.params.title },
      { $set: { title: req.body.title, content: req.body.content } }
    );
    res.redirect('/board');
  } else {
    const err = new Error('요청 값이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

// 글 삭제
router.delete('/delete/title/:title', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const result = await cursor.deleteOne({ title: req.params.title });

  if (result.acknowledged) {
    res.send('삭제 완료');
  } else {
    const err = new Error('삭제 실패');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
