const router = require('express').Router();
const login = require('../routing/login');



router.get('/', login.loginget); //로그인페이지
router.post('/', login.loginpost); //로그인
router.get('/logout', login.logout); //로그아웃
module.exports = router;