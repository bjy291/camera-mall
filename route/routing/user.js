var mysql=require('mysql');
var con=mysql.createConnection({
        host:'114.71.137.109',
        user:'201544089',
        password:'201544089',
        database:'SW_201544089',
        charset:'utf8'
})
con.connect();
exports.information=function(req,res){ 
        if(req.session.displayname){
                var dname=req.session.displayname;
                var id=req.session.user;
                var sql='select * from user where id=?';
                con.query(sql,req.session.user,function(err,result){
                        if(err) console.log(err);
                        else{
                                res.render('ifm',{name:dname,id:req.session.user,user:result[0]});
                        }
                })
        }else{
                console.log("zzz");
                res.render('ifm',{regiok:true});
        }
};
exports.informationpost=function(req,res){ //개인정
        var user={
                pw:req.body.pw,
                id:req.body.id,
                phone:req.body.phone,
                addr:req.body.addr
        }
        var sql="select count(*) as result from user where id=?";
        con.query(sql,[user.id],function(err,result){
                if(err) console.log(err);
                else{
                        if(result[0].result){
                                var sql="update user set pw=?, phone=?, addr=? where id=?";
                                con.query(sql,[user.pw,user.phone,user.addr,user.id],function(err,result){
                                        if(err) console.log(err);
                                        else{
                                               
                                                res.send('<script>alert("개인정보 수정에 성공하셧습니다.");location.href="/"</script>');
                                        }
                                });
                        }else{
                         
                                res.send('<script>alert("개인정보 수정을 실패하셨습니다.");location.href="/user/information"</script>');
                        }
                }
        });
};
exports.basket=function(req,res){ //장바구니
        var id=req.session.user;
        var sql="select * from basket,product,img where id=? and basket.num=product.num and product.num=img.num order by bnum";
        con.query(sql,id,function(err,result){
                if(err) console.log(err);
                else{
                        if(req.session.displayname){
                                var dname=req.session.displayname;
                                res.render('basket',{name:dname,id:req.session.user,basket:result});
                        }else{
                                res.render('basket');
                        }
                }
        })
};
exports.basdel=function(req,res){ //장바구니삭제
        if(req.body.length){
                if(req.body.length>1){
                        for(var i=0;i<req.body.length;i++){
                                var sql="delete from basket where bnum=?";
                                con.query(sql,req.body['num[]'][i],function(err,result){
                                        if(err) console.log(err);
                                })
                        }
                        res.send('true');
                }else{
                        var num=req.body.num;
                        var sql="delete from basket where bnum=?";
                        con.query(sql,req.body['num[]'],function(err,result){
                                if(err) console.log(err);
                                else{
                                        if(result.affectedRows){
                                                res.send("true");
                                        }else{
                                                res.send("false");
                                        }
                                }
                        })
                }
        }
        else{
                var num=req.body.num;
                var sql="delete from basket where bnum=?";
                con.query(sql,num,function(err,result){
                        if(err) console.log(err);
                        else{
                                if(result.affectedRows){
                                        res.send("true");
                                }else{
                                        res.send("false");
                                }
                        }
                })
        }
};
exports.passchange=function(req,res){ //비밀번호변경
        var pw={
                pw:req.body.pw,
                newpw:req.body.newpw,
                id:req.session.user
        }
        var sql="select count(*) as result from user where id=? and pw=?";
        con.query(sql,[pw.id,pw.pw],function(err,result){
                if(err) console.log(err);
                else{
                        if(result[0].result){
                                var sql="update user set pw=? where id=? and pw=?";
                                con.query(sql,[pw.newpw,pw.id,pw.pw],function(err,result){
                                        if(err) console.log(err);
                                        else{
                                                res.send(true);
                                        }
                                });
                        }else{
                                res.send(false);
                        }
                }
        });
};
exports.paymentget=function(req,res){ //결제페이지
        if(req.session.displayname){
                var dname=req.session.displayname;
                res.render('payment',{name:dname,id:req.session.user});
        }else{
                res.render('payment');
        }
};
exports.paymentpost=function(req,res){ //장바구니>>결제페이지
        var stat = req.body.stat;
        var stat2 = Number(stat);
        console.log(stat2);
        var pro={
                cnt:req.body.cntstock,
                num:req.body.num5
        }
        var id=req.session.user;
        if(stat2==1){
                        var sql="select * from product,img,user where product.num=? and product.num=img.num and id=?";
                        con.query(sql,[pro.num,id],function(err,result){
                        if(err) console.log(err);
                        else{
                                if(req.session.displayname){
                                        var dname=req.session.displayname;
                                        res.render('payment',{name:dname,id:id,pay:result,bnum:pro.bnum, cntstock:pro.cnt});
                                }else{
                                        res.render('payment');
                                }
                        }
                })
        }else if(stat2==2){
                        var sql="insert into basket(num,id,cnt) values(?,?,?)";
                        con.query(sql,[pro.num,id,pro.cnt],function(err,result){
                        if(err) console.log(err);
                        else{
                                if(result.affectedRows){
                                        res.redirect(href='/user/basket');
                                }else{
                                        res.send("false");
                                }
                        }
                })
        }else if(stat2==3){
                var bnum=JSON.stringify(req.body.post);
                var pcnt=bnum.substring(bnum.indexOf("cnt",0)+6,bnum.length-2);
                var bnums=bnum.substring(bnum.indexOf("bnum",0)+9,bnum.indexOf("cnt",0)-4).split(",");
                console.log(bnums);
                for(var i=0;i<bnums.length;i++){
                        bnums[i]=bnums[i].replace(/[^0-9]/g,'');
                }
                var sql="select * from product,img,basket,user where bnum=? and product.num=img.num and basket.num=product.num and basket.id = user.id";
                                con.query(sql,[bnums,id],function(err,result){
                                if(err) console.log(err);
                                else{
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('payment',{name:dname,id:id,pay:result,bnum:pro.bnum, cntstock:pcnt});
                                        }else{
                                                res.render('payment');
                                        }
                                }
                })              
        }
};
        

exports.orderadd=function(req,res){ //주문정보삽입
        var data={
                id:req.session.user,
                total:req.body.total,
                locadd:req.body.locadd1,
                locdetail:req.body.locdetail1,
                oname:req.body.oname1,
                ophone:req.body.ophone1,
                oreq:req.body.si
        }
        console.log(req.body);
        var sql="insert into orders(id,total,oname,ophone,locadd,locdetail,oreq) values(?,?,?,?,?,?,?)";
        con.query(sql,[data.id,data.total,data.oname,data.ophone,data.locadd,data.locdetail,data.oreq],function(err,result){
                if(err) console.log(err);
                else{
                        var innum=result.insertId;
                        if(req.body.procnt>1){
                                for(var i=0;i<req.body.tocnt;i++){
                                        var sql="insert into ordersdetail(num,onum,cnt,delivery) values(?,?,?,?)";
                                        con.query(sql,[req.body.num[i],innum,req.body.cnt[i],req.body.deli[i]],function(err,result){
                                                if(err) console.log(err);
                                        })
                                        if(req.body.bnum){
                                                var sql="delete from basket where bnum=?";
                                                con.query(sql,req.body.bnum[i],function(err,result){
                                                        if(err) console.log(err);
                                                })
                                        }
                                }
                        }else{
                                var sql="insert into ordersdetail(num,onum,cnt) values(?,?,?)";
                                con.query(sql,[req.body.num,innum,req.body.cnt],function(err,result){
                                        if(err) console.log(err);
                                })
                                if(req.body.bnum){
                                        var sql="delete from basket where bnum=?";
                                        con.query(sql,req.body.bnum,function(err,result){
                                                if(err) console.log(err);
                                        })
                                }
                        }
                        res.redirect('/user/orderifm');
                }
        })
};
exports.orderinfo=function(req,res){ //주문상세페이지
        var onum=req.query.no;
        var sql="select * from orders where onum=?";
        con.query(sql,onum,function(err,order){
                if(err) console.log(err);
                else{
                        var sql="select distinct orders.onum,ordersdetail.num,opnum,prod_comp,order_date,cnt,total,prod_name,status,prod_price from orders join ordersdetail using(onum) join product using(num) where onum=?";
                        con.query(sql,onum,function(err,detail){
                                if(err) console.log(err);
                                else{
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('orderinfo',{name:dname,id:req.session.user,orders:order,details:detail});
                                        }else{
                                                res.render('orderinfo',{orders:order,details:detail});
                                        }
                                }
                        })
                }
        })
}
exports.orderupdate=function(req,res){ //주문정보수정
        var sql="update orders set oname=?,a_name=?,a_phone=?,locnum=?,locadd=?,locdetail=? where onum=?";
        con.query(sql,[req.body.oname,req.body.aname,req.body.aphone,req.body.locnum,req.body.locadd,req.body.locdetail,req.body.onum],function(err,result){
                if(err) console.log(err);
                else{
                        if(result.affectedRows){
                                res.send('true');
                        }else{
                                res.send("false");
                        }
                }
        })
}
exports.orderifm=function(req,res){ //주문정보페이지
        var id=req.session.user;
        var maxpost=20; //페이지당 주문수
        var pno=req.params.pno; //페이지넘버
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as mbcnt from orders join ordersdetail using(onum) where id=?";
        con.query(sql,id,function(err,result){
                if(err) console.log(err);
                else{
                        var mbcnt=result[0].mbcnt;
                        var sql="select ordersdetail.num,orders.onum,opnum,ordersdetail.cnt,product.prod_name,orders.total,orders.order_date,img.img_name,status";
                        var sql=sql+" from orders,ordersdetail,product,img where id=? and orders.onum=ordersdetail.onum and ordersdetail.num=product.num and product.num=img.num ORDER BY onum desc limit ?,?;";
                        con.query(sql,[id,start,maxpost],function(err,result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:mbcnt%maxpost == 0 ? Math.trunc(mbcnt/maxpost) : Math.trunc(mbcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작주문넘버
                                                endpost:maxpost*pno-1< mbcnt ?  maxpost*pno-1 : mbcnt-1  //마지막주문넘버
                                        }
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('orderifm',{name:dname,id:req.session.user,orders:result,pager:pager,pno:pno});
                                        }else{
                                                res.render('orderifm');
                                        }
                                }
                        })
                }
        })
};
exports.buyconfirm=function(req,res){ //구매확정
        var opnum=req.body.opnum;
        var sql="update ordersdetail set status=5 where opnum=?";
        con.query(sql,opnum,function(err,result){
                if(err) console.log(err);
                else{
                        if(result.affectedRows){
                                res.send("true");
                        }else{
                                res.send("false");
                        }
                }
        })
}
exports.review=function(req,res){ //리뷰작성페이지
        var num=req.query.num;
        var opnum=req.query.opnum;
        console.log(num);
        var sql="select prod_name,img_name,ordersdetail.cnt from ordersdetail join product using(num) join img using(num) where opnum =?";
        con.query(sql,opnum,function(err,result){
                if(err) console.log(err);
                else{
                        res.render('review',{rev:result[0],num:num,opnum:opnum});
                }
        })
}
exports.reviewpost=function(req,res){ //리뷰작성
        var star=req.body.star;
        var review=req.body.review;
        var num=req.body.num;
        var optnum=req.body.optnum;
        var id=req.session.user;
        if(id){
                var sql="insert into productreview(num,optnum,id,rtext,star) values(?,?,?,?,?)";
                con.query(sql,[num,optnum,id,review,star],function(err,result){
                        if(err) console.log(err);
                        else{
                                if(result.affectedRows){
                                        res.send("true");
                                }else{
                                        res.send("false");
                                }
                        }
                })
        }
}