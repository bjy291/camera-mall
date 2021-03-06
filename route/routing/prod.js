var mysql=require('mysql');
var con=mysql.createConnection({
        host:'114.71.137.109',
        user:'201544089',
        password:'201544089',
        database:'SW_201544089',
        charset:'utf8'
})
con.connect();
exports.prod=function(req,res){ //메인페이지
        var maxpost=8; //페이지당 상품수
        var pno=req.params.pno; //페이지넘버
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from product where prod_comp = 'Nikon'";
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select product.*, img.*,imgtext.* from product join img using(num) join imgtext using(num) where prod_comp = 'Nikon' and group by product.num ORDER by product.num DESC limit ?,?;";
                        con.query(sql,[start,maxpost],function(err,result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작상품넘버
                                                endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                        }
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('prod',{name:dname,id:req.session.user,product:result,pager:pager,pno:pno});
                                        }else{
                                                res.render('prod',{product:result,pager:pager,pno:pno});
                                        }
                                }
                        })
                }
        })
};
exports.Canon=function(req,res){ //메인페이지
        var maxpost=8; //페이지당 상품수
        var pno=req.params.pno; //페이지넘버
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from product where prod_comp = 'Canon'";
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select product.*, img.*,imgtext.* from product join img using(num) join imgtext using(num) where prod_comp = 'Canon' group by product.num ORDER by product.num DESC limit ?,?;";
                        con.query(sql,[start,maxpost],function(err,result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작상품넘버
                                                endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                        }
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('Canon',{name:dname,id:req.session.user,product:result,pager:pager,pno:pno});
                                        }else{
                                                res.render('Canon',{product:result,pager:pager,pno:pno});
                                        }
                                }
                        })
                }
        })
};
exports.Lens=function(req,res){ //메인페이지
        var maxpost=8; //페이지당 상품수
        var pno=req.params.pno; //페이지넘버
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from product where prod_comp = 'Lens'";
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select product.*, img.*,imgtext.* from product join img using(num) join imgtext using(num) where prod_comp = 'Lens' group by product.num ORDER by product.num DESC limit ?,?;";
                        con.query(sql,[start,maxpost],function(err,result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작상품넘버
                                                endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                        }
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('Lens',{name:dname,id:req.session.user,product:result,pager:pager,pno:pno});
                                        }else{
                                                res.render('Lens',{product:result,pager:pager,pno:pno});
                                        }
                                }
                        })
                }
        })
};
exports.Sony=function(req,res){ //메인페이지
        var maxpost=8; //페이지당 상품수
        var pno=req.params.pno; //페이지넘버
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from product where prod_comp = 'Sony'";
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select product.*, img.*,imgtext.* from product join img using(num) join imgtext using(num) where prod_comp = 'Sony' group by product.num ORDER by product.num DESC limit ?,?;";
                        con.query(sql,[start,maxpost],function(err,result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작상품넘버
                                                endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                        }
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('Sony',{name:dname,id:req.session.user,product:result,pager:pager,pno:pno});
                                        }else{
                                                res.render('Sony',{product:result,pager:pager,pno:pno});
                                        }
                                }
                        })
                }
        })
};
exports.productdetail=function(req,res){ //상세정보페이지
        var pno=req.query.num;
        var sql="select product.*,img.*,imgtext.* from product join img using(num) join imgtext using(num) where num=?";
        con.query(sql,pno,function(err,result){
                if(err) console.log(err);
                else{
                        var sql="select * from product where num=?";
                        con.query(sql,pno,function(err,opt){
                                if(err) console.log(err);
                                else{
                                        var sql="select * from productreview where num=?";
                                        con.query(sql,pno,function(err,review){
                                                if(err) console.log(err);
                                                else{
                                                        if(req.session.displayname){
                                                                var dname=req.session.displayname;
                                                                res.render('prodetail',{name:dname,id:req.session.user,pro:result[0],review:review,num:result[0].num});
                                                        }else{
                                                                res.render('prodetail',{pro:result[0],min:min[0]});
                                                        }
                                                }
                                        })
                                }
                        })
                }
        })
};
exports.basketadd=function(req,res){ //장바구니추가
        var num=req.body.num;
        
        var cnt=req.body.cnt;
        var id=req.session.user;
        var deli=req.body.deli;
        var sql="insert into basket(num,id,cnt,delivery) values(?,?,?,?,?)";
        con.query(sql,[num,id,cnt,deli],function(err,result){
                if(err) console.log(err);
                else{
                        if(result.affectedRows){
                                res.send("true");
                        }else{
                                res.send("false");
                        }
                }
        })
};
exports.help=function(req,res){ //고객센터
        var maxpost=10; //페이지당 상품수
        var pno=req.params.pno; //페이지넘버
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from faq";
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select * from faq  ORDER by fnum DESC limit ?,?;";
                        con.query(sql,[start,maxpost],function(err,result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작상품넘버
                                                endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                        }
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('help',{name:dname,id:req.session.user,faq:result,pager:pager,pno:pno});
                                        }else{
                                                res.render('help',{faq:result,pager:pager,pno:pno});
                                        }
                                }
                        })
                }
        })
};
exports.search=function(req,res){ //검색
        console.log(req.query);
        var search=req.query.search;
        var maxpost=8; //페이지당 상품수
        var pno=req.params.pno; //페이지넘버
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from product";
        if(!search){
                res.redirect('/prod');
        }else{
                sql=sql+" where prod_name like '%"+search+"%'";
        }
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select product.*, img.* from product join img using(num)";
                        if(search){
                                sql=sql+" where prod_name like '%"+search+"%'";
                        }
                        sql=sql+" group by product.num ORDER by product.num DESC limit ?,?";
                        con.query(sql,[start,maxpost],function(err,result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작상품넘버
                                                endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                        }
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('prod',{name:dname,id:req.session.user,product:result,pager:pager,pno:pno,search:search});
                                        }else{
                                                res.render('prod',{product:result,pager:pager,pno:pno,search:search});
                                        }
                                }
                        })
                }
        })
};