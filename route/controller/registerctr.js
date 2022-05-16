const router = require('express').Router();
const register=require('../routing/register');

router.get('/',register.regiget);  //회원가입페이지
router.post('/',register.regipost); //회원가입
router.post('/idcheck',register.idcheck); //아이디중복확인
router.post('/emailcheck',register.emailcheck); //이메일중복확인
module.exports = router;