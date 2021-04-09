// const homeController = require('../app/http/controllers/homeController');
// const authController = require('../app/http/controllers/authController');
// const cartController = require('../app/http/controllers/customers/cartController');
// // const app = express();
// function initRoutes(app) {
    
//     app.get('/',homeController().index);

     
//     app.get('/cart',cartController().index)
//     app.get('/login',authController().login)
//     app.get('/register',authController().register)

// }

// module.exports = initRoutes

const express = require('express');
const router = express.Router();
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