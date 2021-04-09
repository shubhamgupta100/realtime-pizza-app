// function homeController() {
//   return {
//       index(req,res) {
//         res.render('home');
//       }
//   }    
// }


// module.exports = homeController;
const Menu = require('../../models/menu')
module.exports.home = async function(req,res){
    //  Menu.find().then(function(pizzas){
    //     console.log(pizzas);
    //     return  res.render('home',{pizzas:pizzas});

    //  })

    const pizzas = await Menu.find()
    // console.log(pizzas);
    return  res.render('home',{pizzas:pizzas});

    
      
    

}

