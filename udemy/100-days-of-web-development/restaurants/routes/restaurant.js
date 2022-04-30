const express = require('express');
const router = express.Router();
const restData = require('../util/restaurantsFile'); // 경로 신경쓰기

router.get('/restaurants', function(req,res){
    let order = req.query.order; //body는 post에만 가능하지만 
    let nextOrder = 'desc';

    if (order !== 'asc' && order !=='desc'){
        order = 'asc';
    }
    if (order ==='desc'){
        nextOrder = 'asc';
    } 

    const storedRestaurants = restData.getStoredRestaurantFile();
    // 정렬 ( 생량ㄱ가능 ) 이거 1이랑 -1 순서 바뀌면 반대로 정렬
    storedRestaurants.sort(function(restA, restB){
        if(
            (order === 'asc' && restA.name > restB.name) ||
            (order === 'desc' && restB.name > restA.name )
        ){
            return 1;
        } 
        return -1;
    });

    res.render('restaurants', {
        numberOfRestaurants : storedRestaurants.length ,
        restaurants : storedRestaurants,
        nextOrder : nextOrder
    });
});




router.get('/restaurants/:id', function(req,res){
    const restaurantId = req.params.id;
    const storedRestaurants = restData.getStoredRestaurantFile();

    for(const restaurant of storedRestaurants ){
        if(restaurant.id === restaurantId){
            return res.render('detail-restaurant',{restaurantId:restaurantId, rest : restaurant });
        }
    }
    // 만약 찾지 못한다면 return되지 않고 해당 위치로 오게 됨 => 404.ejs 페이지 렌더링
    res.status(404).render('404');
});

router.get('/recommend', function(req,res){
    res.render('recommend');
});

router.post('/recommend', function(req,res){ //form에서 작성한 name 타입을 키워드로 불러오면 됨
    const restaurant = req.body;
    restaurant.id = uuid.v4();
    
    const restaurantFile = restData.getStoredRestaurantFile();

    restaurantFile.push(restaurant);

    restData.writeFile(restaurantFile);
    res.redirect('/confirm');
});


module.exports = router;