
// function authController (){
//     return {
//         login(req,res) {
//         res.render('auth/login')
//     },
//     register(req,res) {
//         res.render('auth/register')
//     }
//  }
// }
// module.exports = authController;
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const _getRedirectUrl = (req)=>{
    return req.user.role === 'admin' ? '/admin/orders' :'/customer/orders'
}

module.exports.login = function(req,res) {
    res.render('auth/login')
}

module.exports.register = function(req,res) {
    res.render('auth/register')
}

module.exports.postRegister = async function (req,res){
     const {name,email,password } = req.body;
    // validate request
    if(!name || !email || !password){
        req.flash('error','All fields are required');
        req.flash('name',name);
        req.flash('email',email);
        return res.redirect('/register');
    }
    //  check if email exists 
    User.exists({email:email},(err , result) =>{
        if(result){
            req.flash('error','Email is already taken');
            req.flash('name',name);
            req.flash('email',email);  
            return res.redirect('/register'); 
        }
    })
    // Hash password =>use bcrypt pakage is used to hash the password
    const hashedPassword = await bcrypt.hash(password , 10)
    // create a user
    const user = new User({
        name:name,
        email:email,
        password:hashedPassword
    })
    user.save().then((user)=>{
        return res.redirect('/')

    }).catch(err =>{

        req.flash('error','Somethong went wrong!');   
        return res.redirect('/register');
    })
    //  console.log(req.body);
}
module.exports.postLogin = function (req,res,next){
    const {email,password } = req.body;
    // validate request
    if( !email || !password){
        req.flash('error','All fields are required');
        
        
        return res.redirect('/login');
    }
    passport.authenticate('local',(err,user,info) =>{
        if(err){
            req.flash('error',info.message);
            return next(err);
        }
        if(!user){
            req.flash('error',info.message);
            return res.redirect('/login');
        }
        req.logIn(user,(err)=>{
            if(err){
                req.flash('error',info.message);  
                return next(err);
            }
            
            return res.redirect(_getRedirectUrl(req));

        })
    })(req,res,next)

}
module.exports.logout = function(req,res){
    req.logout();
    return res.redirect('/login');
}