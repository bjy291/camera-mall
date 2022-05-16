const router = require('express').Router();
const main = require('../routing/main');
router.get('/',main.main); //메인페이지

router.post('/basketadd',main.basketadd); //장바구니추가
router.get(['/help','/help=:pno'],main.help); //faq페이지
router.get(['/helpread','/helpread?num=:pno'],main.helpread); //faq페이지

module.exports = router;