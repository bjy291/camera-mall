const router = require('express').Router();
const prod = require('../routing/prod');
router.get(['/','/pagenum=:pno'],prod.prod); 
router.get(['/Canon','/pagenum=:pno'],prod.Canon); 
router.get(['/Sony','/pagenum=:pno'],prod.Sony); 
router.get(['/Lens','/pagenum=:pno'],prod.Lens); 
router.get(['/productDetail','/productDetail?num=:pno'], prod.productdetail); //상품상세페이지
router.post('/basketadd',prod.basketadd); //장바구니추가
router.get(['/help','/help=:pno'],prod.help); //faq페이지
router.get('/search',prod.search); //검색
module.exports = router;