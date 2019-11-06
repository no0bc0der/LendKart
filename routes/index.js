var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var Post = require('../models/post');
var app = express();
var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true } )
var url='mongodb://localhost:27017/shopping';
var mongo = require('mongodb');
 //var Schema = mongoose.Schema;
 var assert = require('assert');
 var MongoClient = require('mongodb').MongoClient;
 //var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());     
// app.use(express.urlencoded());

const stripe = require('stripe')
("sk_test_5AazKrKoF3E4bouVMFcmwgFu00T4jCoxj3");
const notifier = require('node-notifier');






router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Lendkart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
});

router.get('/get-prod/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        notifier.notify('Open Cart to checkout');
        res.redirect('/');
    });
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/scart');
});
router.get('/scart', function(req, res, next) {
   if (!req.session.cart) {
       return res.render('shop/scart', {products: null});
   } 
    var cart = new Cart(req.session.cart);
    res.render('shop/scart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});






router.get('/postp',function(req,res,next){
    res.render('user/postp');
  });

  router.post('/postp',function(req,res,next){
     var item={
         title : req.body.title,
         imagePath :req.body.imagePath,
         price : req.body.price,
         basis : req.body.basis,
         name :req.body.name
     };
    
        MongoClient.connect('mongodb://localhost:27017', function (err, client) {
            if (err) throw err;
          
            var db = client.db('shopping');

   
            db.collection('newproduct').insertOne(item,function(err,result){
                assert.equal(null,err);
                notifier.notify('Item added to db ,will be listed once it is verified');
               client.close();
            });

     });
     res.redirect('/');
    });


router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/scart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/scart');
    }
    var cart = new Cart(req.session.cart);
    
    // var stripe = require("stripe")(
    //     "sk_test_5AazKrKoF3E4bouVMFcmwgFu00T4jCoxj3"
    // );
   
    const charge=  stripe.charges.create({
        amount: cart.totalPrice * 100 ,

        currency: "inr",
        source: "tok_mastercard", 
        description: "Lend charge"
    },
    function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        // return order.save();
        order.save(function(err, result) {
            req.flash('success', 'Successfully bought the product!');
            req.session.cart = null;
            res.redirect('/');
        });
    }); 
});
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}