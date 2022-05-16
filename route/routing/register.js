var mysql=require('mysql');
var con=mysql.createConnection({
        host:'114.71.137.109',
        user:'201544089',
        password:'201544089',
        database:'SW_201544089',
        charset:'utf8'
})
con.connect();
exports.regiget=function(req,res){ //회원가입
        if(req.session.displayname){
                var dname=req.session.displayname;

                res.render('register',{name:dname,id:req.session.user});
        }else{
                res.render('register',{regiok:true});
        }
};
exports.idcheck=function(req,res){ //아이디중복확인
        var id=req.body.id;
        var sql='select count(*) as result from user where id=?';
        con.query(sql,id,function(err,result){
                if(err) console.log(err);
                else{
                        res.send({"result":result[0].result})
                }
        })
};
exports.emailcheck=function(req,res){ //이메일중복확인
        var email=req.body.email;
        var sql='select count(*) as result from user where email=?';
        con.query(sql,email,function(err,result){
                if(err) console.log(err);
                else{
                        res.send({"result":result[0].result})
                }
        })
};
exports.regipost=function(req,res){ //회원가입
        var user={
                id:req.body.id,
                pw:req.body.pw,
                name:req.body.name,
                phone:req.body.phone,
                addr:req.body.addr
        }
        var sql='insert into user(id,pw,name,phone,addr,stat) values(?,?,?,?,?,1)';
        con.query(sql,[user.id,user.pw,user.name,user.phone,user.addr,user.stat],function(err,result){
                if(err) console.log(err);
                else{
                        var ok=result.affectedRows;
                        if(ok==1){
                                res.send('<script>alert("회원가입에 성공하셧습니다.");location.href="/login"</script>');
                        }else{
                                res.send('<script>alert("회원가입을 실패하셨습니다.");history.back();</script>',{result:ok});
                        }
                }
        })
};