
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const menu = require('../app/models/menu');
const pizzaData = menu.find({});
console.log("Router loaded");

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const ordersController = require('../app/http/controllers/customers/ordersController');
const AdminOrdersController = require('../app/http/controllers/admin/ordersController');
const AdminStatusController = require('../app/http/controllers/admin/statusController');
// const guest = require('../app/http/middleware/guest');

// Middleware
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')
router.use(express.static(__dirname + "./public/"));
var storage = multer.diskStorage({
  destination: "./public/img/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})
var upload = multer({
    storage: storage,
  }).single('avatar')
  /* GET home page. */
  router.post('/uploads', upload, function (req, res, next) {
    var imageName = req.file.filename;
    // success = req.file.filename + " Uploaded Successfully !";
    var pizzaDetail = new menu({
        name:req.body.name,
        price:req.body.price,
        size:req.body.size,
        image: imageName
    });
    pizzaDetail.save(function (err, doc) {
      if (err) throw err;
      pizzaData.exec(function (err, data) {
        if (err) throw err;
        res.render('admin/addpizza');
      })
    })
  });

  router.get('/addpizza' , admin ,(req , res)=> {
    return res.render('admin/addpizza');
});


router.get('/',homeController.home);
router.get('/login',guest, authController.login);
router.post('/login',authController.postLogin);
router.get('/register',guest, authController.register);
router.post('/register',authController.postRegister)
router.post('/logout',authController.logout)
router.get('/cart',cartController.cart);
// router.post('/update-cart',cartController.update);
router.post('/update-cart',cartController.update);

//  Customer Routes
router.post('/orders', auth ,ordersController.store);
router.get('/customer/orders', auth, ordersController.index);
router.get('/customer/orders/:id', auth, ordersController.show);

// Admin routes
router.get('/admin/orders', admin , AdminOrdersController.index);
router.post('/admin/order/status',admin,AdminStatusController.update)

module.exports = router;