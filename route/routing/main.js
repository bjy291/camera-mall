var mysql=require('mysql');
var con=mysql.createConnection({
        host:'114.71.137.109',
        user:'201544089',
        password:'201544089',
        database:'SW_201544089',
        charset:'utf8'
})
con.connect();
exports.main=function(req,res){ //메인페이지
        var maxpost=4; //페이지당 상품수
        var pno=req.params.pno; //페이지넘버
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from product";
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select product.*, img.*, min(prod_price) as optprice from product join img using(num) group by product.num ORDER by product.num DESC limit ?,?;";
                        con.query(sql,[start,maxpost],function(err,result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:postcnt%maxpost == 0 ? Math.trunc(postcnt/maxpost) : Math.trunc(postcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작상품넘버
                                                endpost:maxpost*pno-1< postcnt ?  maxpost*pno-1 : postcnt-1  //마지막상품넘버
                                        }
                                        var sql="select product.num,count(*) as cnt from product join productreview using(num) GROUP BY 1";
                                        con.query(sql,function(err,star){
                                                if(err) console.log(err);
                                                else{
                                                        if(req.session.displayname){
                                                                var dname=req.session.displayname;
                                                                res.render('main',{name:dname,id:req.session.user,product:result,pager:pager,pno:pno});
                                                        }else{
                                                                res.render('main',{product:result,pager:pager,pno:pno});
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
        var sql="insert into basket(num,id,cnt) values(?,?,?)";
        con.query(sql,[num,id,cnt],function(err,result){
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
exports.helpread=function(req,res){
        var pno=req.query.num;
        var sql="select faq.* from faq where fnum=?";
        con.query(sql,pno,function(err,result){
                if(err) console.log(err);
                else{      
                        if(req.session.displayname){
                                var dname=req.session.displayname;
                                res.render('helpread',{name:dname,id:req.session.user,result:result,pno:pno});
                        }else{
                                res.render('helpread',{result:result,pno:pno});
                        }
                }
        })
                
        
};
exports.search=function(req,res){ //검색
        console.log(req.query);
        var search=req.query.search;
        var maxpost=10; //페이지당 상품수
        var pno=req.params.pno; //페이지넘버
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from product";
        if(!search){
                res.redirect('/');
        }else{
                sql=sql+" where name like '%"+search+"%'";
        }
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select product.*, productimg.*, min(prod_price) as optprice from product join productimg using(num) ";
                        if(search){
                                sql=sql+" where name like '%"+search+"%'";
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
                                        var sql="select product.num,count(*) as cnt from product join productreview using(num) GROUP BY 1";
                                        con.query(sql,function(err,star){
                                                if(err) console.log(err);
                                                else{
                                                        if(req.session.displayname){
                                                                var dname=req.session.displayname;
                                                                res.render('main',{name:dname,id:req.session.user,product:result,pager:pager,pno:pno,search:search});
                                                        }else{
                                                                res.render('main',{product:result,pager:pager,pno:pno,search:search});
                                                        }
                                                }
                                        })
                                }
                        })
                }
        })
};