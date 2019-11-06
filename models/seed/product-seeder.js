var Product =  require('../../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true } )

var products = [new Product({
    imagePath : 'https://cdn.pocket-lint.com/r/s/970x/assets/images/146991-cameras-review-hands-on-canon-eos-rp-review-image1-syo8pjej4g.jpg',
    title : 'Canon 330S',
    price : 750,
    basis : 'Per day',
    owner : 'John'
    
    
}),
new Product({
    imagePath : 'https://www.seanhennessy.ie/image/thumbnails/1a/79/BTM2310_1_jpg-108432-500x500.jpg',
    title : 'Philips Stereo',
    price : 800,
    basis : 'Per day',
    owner :'Mark'
    
    
}),
new Product({
    imagePath : 'https://www.pcgamesn.com/wp-content/uploads/2018/10/Best-gaming-monitor-Asus-ROG-Swift-PG279q.jpg',
    title : 'ASUS Monitor',
    price : 1000,
    basis : 'Per day',
    owner : 'Steve'
    
}),
new Product({
    imagePath : 'https://assets.pcmag.com/media/images/471937-microsoft-xbox-one-x.jpg?width=333&height=245',
    title : 'X-BOX One',
    price : 1200,
    basis : 'Per day',
    owner : 'Henry'
    
    

}),
new Product({
    imagePath : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNKyosiIxMHaOQVJORErp63lFF7u8I-fsmI6tmr2Hl3F-ayoIo',
    title : 'Kiton Blazers',    
    price : 1000,
    basis : 'Per day',
    owner : 'David'
    
    
}),
new Product({
    imagePath : 'https://4.imimg.com/data4/IH/GQ/MY-1652402/two-bearing-generator-500x500.jpg',
    title : 'Honda Generators',    
    price : 2100,
    basis : 'Per day',
    owner : 'Joel'
    
    
}),
new Product({
    imagePath : 'https://4.imimg.com/data4/IH/GQ/MY-1652402/two-bearing-generator-500x500.jpg',
    title : 'Honda ',    
    price : 2500,
    basis : 'Per day',
    owner : 'Ellie'

    
    
}),
];

var done=0;
for(var i=0;i<products.length;i++)
{
    products[i].save(function(err, result){
        done++;
        if(done==products.length)
        {
            exit();
        }
    });

}
function exit(){
    mongoose.disconnect();
}


