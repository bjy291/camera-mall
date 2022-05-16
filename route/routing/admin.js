var mysql=require('mysql');
var fs=require('fs');
var con=mysql.createConnection({
        host:'114.71.137.109',
        user:'201544089',
        password:'201544089',
        database:'SW_201544089',
        charset:'utf8'
})
con.connect();
exports.member=function(req,res){ //회원관리페이지
        var maxpost=20; //페이지당 회원수
        var pno=req.query.page; //페이지넘버
        var type=req.query.type;
        var val=req.query.val;
        var query=req.query;
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as mbcnt from user";
        if(type){
                if(type !="all"){
                        sql=sql+" where "+type+" like '%"+val+"%'";
                }else{
                        sql=sql+" where id like '%"+val+"%' or pw like '%"+val+"%' or name like '%"+val+"%' or phone like '%"+val+"%' or email like '%"+val+"%'  ";
                }
        }
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var mbcnt=result[0].mbcnt;
                        var sql="select * from user";
                        if(type){
                                if(type!='all'){
                                        sql=sql+" where "+type+" like '%"+val+"%'";
                                }else{
                                        sql=sql+" where id like '%"+val+"%' or pw like '%"+val+"%' or name like '%"+val+"%' or phone like '%"+val+"%' or email like '%"+val+"%'  ";
                                }
                        }
                        var sql=sql+" order by id desc limit ?,?";
                        con.query(sql,[start,maxpost],function(err,result){
                                if(err) console.log(err);
                                else{
                                        var pager={
                                                pagecnt:mbcnt%maxpost == 0 ? Math.trunc(mbcnt/maxpost) : Math.trunc(mbcnt/maxpost) +1, //총페이지수
                                                startpost:maxpost*pno-maxpost, //시작상품넘버
                                                endpost:maxpost*pno-1< mbcnt ?  maxpost*pno-1 : mbcnt-1  //마지막상품넘버
                                        }
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('member',{name:dname,id:req.session.user,result:result,pager:pager,pno:pno,query:query,type:type});
                                        }else{
                                                res.render('member',{result:result,pager:pager,pno:pno,query:query});
                                        }
                                }
                        })
                }
        })
};
exports.memdel=function(req,res){ //회원삭제
        var id=req.body.id;
        var sql="delete from user where id=?";
        con.query(sql,id,function(err,result){
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
exports.memmodi=function(req,res){ //회원정보수정
        console.log(req.body);
        var mem={
                pid:req.body.pid,
                id:req.body.id,
                pw:req.body.pw,
                name:req.body.name,
                phone:req.body.phone,
                email:req.body.email,
                birth:req.body.birth
        }
        var sql="update user set id=?,pw=?,name=?,phone=?,email=?,birth=? where id=?";
        con.query(sql,[mem.id,mem.pw,mem.name,mem.phone,mem.email,mem.birth,mem.pid],function(err,result){
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
exports.product=function(req,res){ //상품관리페이지
        var maxpost=8; //페이지당 상품수
        var pno=req.query.page; //페이지넘버
        var type1=req.query.type1;
        var type2=req.query.type2;
        var val=req.query.val;
        var query=req.query;
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from product";
        if(!(!type1)){
                if(type1!='all'){
                        if(type2!=undefined){
                                if(type2!='all'){
                                        sql=sql+" and prod_comp ='"+type2+"'";
                        }}if(val!=undefined){
                                sql=sql+" and prod_name like '%"+val+"%'";
                }}else{
                        if(type2!=undefined){
                                if(type2!='all'){
                                        sql=sql+" where prod_comp ='"+type2+"'";
                                        if(val!=undefined){
                                                sql=sql+" and prod_name like '%"+val+"%'";
                                        }
                                }else if(val!=undefined){
                                        sql=sql+" where prod_name like '%"+val+"%'";
                                }
                        }else if(val!=undefined){
                                sql=sql+" where prod_name like '%"+val+"%'";
        }}}
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select product.* from product";
                        if(!(!type1)){
                                if(type1!='all'){
                                        if(type2!=undefined){
                                                if(type2!='all'){
                                                        sql=sql+" and prod_comp ='"+type2+"'";
                                        }}if(val!=undefined){
                                                sql=sql+" and prod_name like '%"+val+"%'";
                                }}else{
                                        if(type2!=undefined){
                                                if(type2!='all'){
                                                        sql=sql+" where prod_comp ='"+type2+"'";
                                                        if(val!=undefined){
                                                                sql=sql+" and prod_name like '%"+val+"%'";
                                                        }
                                                }else if(val!=undefined){
                                                        sql=sql+" where prod_name like '%"+val+"%'";
                                                }
                                        }else if(val!=undefined){
                                                sql=sql+" where prod_name like '%"+val+"%'";
                        }}}
                        var sql=sql+" group by product.num ORDER by product.num DESC limit ?,?";
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
                                                res.render('product',{name:dname,id:req.session.user,result:result,pager:pager,pno:pno,query:query});
                                        }else{
                                                res.render('product',{result:result,pager:pager,pno:pno});
                                        }
                                }
                        })
                }
        })
};
exports.prodel=function(req,res){ //상품 삭제
        var num=req.body.num;
        var sql="delete from product where num=?";
        con.query(sql,num,function(err,result){
                if(err) console.log(err);
                else{
                        if(result.affectedRows){
                                var sql="select img_path from img where num=?";
                                con.query(sql,num,function(err,result){
                                        if(err) console.log(err);
                                        else{
                                                if(result[0].img_path){
                                                        var img_path=result[0].img_path;
                                                        if (img_path!="C:\\Users\\82015\\Desktop\\camera\\dbimg\\thumbnail.png"){
                                                                fs.exists(img_path,function(ex){ //썸네일 삭제
                                                                        if(ex){
                                                                                fs.unlink(img_path,function(err){
                                                                                        if(err) console.log(err);
                                                                })}})
                                                        }
                                                        var sql="delete from img where num=? " //사진 db제거
                                                        con.query(sql,num,function(err,result){
                                                                if(err) console.log(err);
                                                                else{
                                                                        if(result.affectedRows) res.send(true);
                                                                        else res.send(false);
                                                                }
                                                        })
                                                }
                                        }
                                })
                        }else res.send(false);
                }
        })
};
exports.promodi=function(req,res){ //상품수정페이지
        var num=req.query.num;
        var sql="select * from product natural join img where num=?";
        con.query(sql,num,function(err,pro){
                if(err) console.log(err);
                else{
                        var sql="select a.* from product a where num=?";
                        con.query(sql,num,function(err,result){
                                if(err) console.log(err);
                                else{
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('productmodify',{name:dname,id:req.session.user,pro:pro[0],opt:result});
                                        }else{
                                                res.render('productmodify');
                                        }
                                }
                        })
                }
        })
};
exports.promodify=function(req,res){ //상품수정
        var pro={
                no:req.body.no,
                name:req.body.name,
                kind:req.body.kind,
                num:req.body.num,
                comp:req.body.comp,
                count:req.body.count,
                price:req.body.price,
                text:req.body.text
        }
        var sql="update product set pkind=?,name=?,comp=?,ptext=? where num=?";
        con.query(sql,[pro.kind,pro.name,pro.comp,pro.text,pro.no],function(err,result){
                if(err) console.log(err);
                else{
                        if(result.affectedRows){
                                res.redirect('/admin/product');
                        }else{
                                res.send('<script>alert("수정이 실패하였습니다");location.back()"</script>');
                        }
                }
        })
};
exports.proupload=function(req,res){ //상품등록페이지
        var sql="SHOW TABLE STATUS LIKE 'product'";
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var sql="delete from product where num=?";
                        con.query(sql,result[0].Auto_increment,function(err,result){
                                if (err) console.log(err);
                        })
                }
        })
        if(req.session.displayname){
                var dname=req.session.displayname;
                res.render('productupload',{name:dname,id:req.session.user});
        }else{
                res.render('productupload');
        }
};
exports.prouploadpost=function(req,res){ //상품등록
        var pro={
                name:req.body.name,
                comp:req.body.comp,
                // text:encodeURIComponent(req.body.text)
                text:req.body.text,
                stock:req.body.stock,
                price:req.body.price
        }
        var stat = 1
        var sql='insert into product(prod_name,prod_stock,prod_price,prod_comp,prod_text,prod_stat) values(?,?,?,?,?,?)';
        con.query(sql,[pro.name,pro.stock,pro.price,pro.comp,pro.text,stat],function(err,result){
                if(err) console.log(err);
                else{
                        if(result.affectedRows){
                                res.redirect('/admin/product');
                        }
                }
        })
};
exports.noimg=function(req,res){ //썸네일없음
        var no=req.body.no;
        var img_path="C:\\Users\\82015\\Desktop\\camera\\dbimg\\thumbnail.png";
        var img_origin="thumbnail.png";
        var img_name="thumbnail.png";
        var sql='insert into img(num,img_name) values(?,?)';
        con.query(sql,[no,img_name],function(err,result){
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
exports.simgupload=function(req,res){ //썸네일업로드
        var file={
                path:req.file.path,
                origin:req.file.originalname,
                name:req.file.filename
        }
        var num=req.body.no;
        var sql="select img_name,count(*) as count from img where num=?";
        con.query(sql,num,function(err,result){
                if(err) console.log(err);
                else{
                        var count=result[0].count;
                        var img_name=result[0].img_name;
                        if(count){
                                fs.exists(img_name,function(ex){ //기존썸네일 삭제
                                        if(ex){
                                                fs.unlink(img_name,function(err){
                                                        if(err) console.log(err);
                                })}})
                                var sql="update img set img_name=? where num=?";
                                con.query(sql,[file.name,num],function(err,result){
                                        if(err) console.log(err);
                                        else{
                                                if(result.affectedRows){
                                                        res.send({"src":file.name});
                                                }else res.send();
                                        }
                                })
                        }else{
                                var sql='insert into img(num,img_name) values(?,?)';
                                con.query(sql,[num,file.name],function(err,result){
                                        if(err) console.log(err);
                                        else{
                                                if(result.affectedRows){
                                                        res.send({"src":file.name});
                                                }else res.send();
                                        }
                                })
                        }
                }
        })
};
exports.simgupload2=function(req,res){ //상품이미지
        var file={
                path:req.file.path,
                origin:req.file.originalname,
                name:req.file.filename
        }
        var num=req.body.no;
        var sql="select img_name_1,count(*) as count from imgtext where num=?";
        con.query(sql,num,function(err,result){
                if(err) console.log(err);
                else{
                        var count=result[0].count;
                        var img_name=result[0].img_name_1;
                        if(count){
                                fs.exists(img_name,function(ex){ //기존썸네일 삭제
                                        if(ex){
                                                fs.unlink(img_name,function(err){
                                                        if(err) console.log(err);
                                })}})
                                var sql="update imgtext set img_name_1=? where num=?";
                                con.query(sql,[file.name,num],function(err,result){
                                        if(err) console.log(err);
                                        else{
                                                if(result.affectedRows){
                                                        res.send({"src":file.name});
                                                }else res.send();
                                        }
                                })
                        }else{
                                var sql='insert into imgtext(num,img_name_1) values(?,?)';
                                con.query(sql,[num,file.name],function(err,result){
                                        if(err) console.log(err);
                                        else{
                                                if(result.affectedRows){
                                                        res.send({"src":file.name});
                                                }else res.send();
                                        }
                                })
                        }
                }
        })
};
exports.bimgupload=function(req,res){ //이미지업로드
        if(req.file){
                var file={
                        path:req.file.path,
                        origin:req.file.originalname,
                        name:req.file.filename
                }
                res.send({
                        "uploaded":1,
                        "filename":file.name,
                        "url":'/dbimg/'+file.name,
                        "error":{
                                "message":"업로드 성공"
                }});
        }else{
                res.send({
                        "uploaded":0,
                        "error":{
                                "message":"업로드 실패"
                }});
        }
};


exports.getnum=function(req,res){ //Auto_increment Get
        var sql="SHOW TABLE STATUS LIKE 'product'";
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        res.send({num:result[0].Auto_increment});
                }
        })
};
exports.order=function(req,res){ //주문관리
        var maxpost=10; //페이지당 상품수
        var pno=req.query.page; //페이지넘버
        var type1=req.query.type1;
        var type2=req.query.type2;
        var val=req.query.val;
        var query=req.query;
        console.log(query);
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from orders natural join ordersdetail natural join product";
        if(!(!type1)){
                if(type1!='all'){
                        sql=sql+" where prod_comp ='"+type1+"'";
                        if(type2!=undefined){
                                if(type2!='all'){
                                        sql=sql+" and status ='"+type2+"'";
                                        if(val!=undefined){
                                                sql=sql+" and prod_name like '%"+val+"%'";
                                        }
                        }}else if(val!=undefined){
                                sql=sql+" and prod_name like '%"+val+"%'";
                }}else{
                        if(type2!=undefined){
                                if(type2!='all'){
                                        sql=sql+" where status ='"+type2+"'";
                                        if(val!=undefined){
                                                sql=sql+" and prod_name like '%"+val+"%'";
                                        }
                                }else if(val!=undefined){
                                        sql=sql+" where prod_name like '%"+val+"%'";
                                }
                        }else if(val!=undefined){
                                sql=sql+" where prod_name like '%"+val+"%'";
        }}}
        console.log(sql);
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        // var sql="select orders.onum,ordersdetail.num,order_date,cnt,total,name,optname,optprice,status from orders join ordersdetail using(onum) join product using(num) join productopt using(num) group by orders.onum desc limit ?,?";
                        // var sql="select distinct orders.onum,ordersdetail.num,order_date,cnt,total,name,status,optname,optprice from orders join ordersdetail using(onum) join product using(num) join productopt using(num) order by 1 desc limit ?,?"
                        var sql="select distinct orders.onum,ordersdetail.num,opnum,order_date,cnt,total,prod_name,status,prod_price,orders.id,oreq from orders join ordersdetail using(onum) join product using(num)";
                        if(!(!type1)){
                                if(type1!='all'){
                                        sql=sql+" and prod_comp ='"+type1+"'";
                                        if(type2!=undefined){
                                                if(type2!='all'){
                                                        sql=sql+" and status ='"+type2+"'";
                                        }}if(val){
                                                sql=sql+" and prod_name like '%"+val+"%'";
                                }}else{
                                        if(type2!=undefined){
                                                if(type2!='all'){
                                                        sql=sql+" and status ='"+type2+"'";
                                                        if(val!=undefined){
                                                                sql=sql+" and prod_name like '%"+val+"%'";
                                                        }
                                                }else if(val!=undefined){
                                                        console.log(1);
                                                        sql=sql+" and prod_name like '%"+val+"%'";
                                                }
                                        }else if(val!=undefined){
                                                console.log(2);
                                                sql=sql+" where prod_name like '%"+val+"%'";
                        }}}
                        sql=sql+" order by 1 desc limit ?,?";
                        console.log(sql);
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
                                                res.render('order',{name:dname,id2:req.session.user,orders:result,pager:pager,pno:pno,query:query});
                                        }else{
                                                res.render('order',{result:result,pager:pager,pno:pno,query:query});
                                        }
                                }
                        })
                }
        })
};
exports.orderdetail=function(req,res){ //주문상세페이지
        console.log(req.query.num);
        var onum=req.query.num;
        var sql="select * from orders where onum=?";
        con.query(sql,onum,function(err,order){
                if(err) console.log(err);
                else{
                        var sql="select distinct ordersdetail.delivery,orders.onum,ordersdetail.num,opnum,order_date,cnt,total,prod_name,status,prod_price from orders join ordersdetail using(onum) join product using(num) where onum=?";
                        con.query(sql,onum,function(err,detail){
                                if(err) console.log(err);
                                else{
                                        if(req.session.displayname){
                                                var dname=req.session.displayname;
                                                res.render('orderdetail',{name:dname,id:req.session.user,orders:order,details:detail});
                                        }else{
                                                res.render('orderdetail',{orders:order,details:detail});
                                        }
                                }
                        })
                }
        })
}
exports.orderupdate=function(req,res){//주문정보수정
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
exports.statusch=function(req,res){ //주문상태 체인지
        var sql="update ordersdetail set status=? where opnum=?";
        con.query(sql,[req.body.after,req.body.opnum],function(err,result){
                if(err) console.log(err);
                else{
                        if(result.affectedRows){
                                res.send('true');
                        }else{
                                res.send('false')
                        }
                }
        })
}
exports.faq=function(req,res){ //faq페이지
        var maxpost=10; //페이지당 상품수
        var pno=req.query.page; //페이지넘버
        var val=req.query.val;
        var query=req.query;
        if(!pno)  var pno=1;
        var start=maxpost*pno-maxpost;
        var sql="select count(*) as postcnt from faq";
        if(val){
                sql=sql+" where ftitle like '%"+val+"%'";
        }
        con.query(sql,function(err,result){
                if(err) console.log(err);
                else{
                        var postcnt=result[0].postcnt;
                        var sql="select * from faq";
                        if(val){
                                sql=sql+" where ftitle like '%"+val+"%'";
                        }sql=sql+" order by fnum desc limit ?,?"
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
                                                res.render('faq',{name:dname,id:req.session.user,result:result,pager:pager,pno:pno,query:query});
                                        }else{
                                                res.render('faq',{result:result,pager:pager,pno:pno,query:query});
                                        }
                                }
                        })
                }
        })
};
exports.faqupload=function(req,res){ //faq등록페이지
        if(req.session.displayname){
                var dname=req.session.displayname;
                res.render('faqupload',{name:dname,id:req.session.user});
        }else{
                res.render('faqupload');
        }
};
exports.faquploadpost=function(req,res){ //faq등록
        console.log(req.body);
        var title=req.body.title;
        var text=req.body.text;
        var sql="insert into faq(ftitle,ftext) values(?,?)";
        con.query(sql,[title,text],function(err,result){
                if(err) console.log(err);
                else{
                        if(result.affectedRows){
                                res.redirect("/help");
                        }else{
                                res.send('<script>alert("faq등록이 실패하였습니다");location.href="/faq"</script>');
                        }
                }
        })
};
exports.faqmodi=function(req,res){ //faq수정페이지
        var num=req.query.num;
        var sql="select * from faq where fnum=?";
        con.query(sql,num,function(err,result){
                if(err) console.log(err);
                else{
                        console.log(result);
                        if(result){
                                if(req.session.displayname){
                                        var dname=req.session.displayname;
                                        res.render('faqmodify',{name:dname,id:req.session.user,faq:result[0]});
                                }else{
                                        res.render('faqmodify');
                                }
                        }else{
                                res.send('<script>alert("faq 수정 오류!!");location.href="/admin/faq"</script>');
                        }
                }
        })
};
exports.faqmodify=function(req,res){ //faq수정
        var num=req.body.num;
        var title=req.body.title;
        var text=req.body.text;
        var sql="update faq set ftitle=?,ftext=? where fnum=?";
        con.query(sql,[title,text,num],function(err,result){
                if(err) console.log(err);
                else{
                        if(result.affectedRows){
                                res.send('<script>alert("수정 완료!!");location.href="/faq"</script>');
                        }else{
                                res.send('<script>alert("수정 오류!!");location.href="/faq"</script>');
                        }
                }
        })
};
exports.faqdel=function(req,res){ //faq삭제
        var num=req.body.num;
        var sql="delete from faq where fnum=?";
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
};