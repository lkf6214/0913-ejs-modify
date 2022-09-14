// @ts-check

const express = require('express');

const router = express.Router();

// 주소가 아무것도 없을때 req, res 설정하겠다
router.get('/', (req, res) => {
  res.render('index');
});
module.exports = router;
