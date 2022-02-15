const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');

client.get('myKey',(err, value) => {
    try{
        console.log(value);
    } catch(err){
        console.log(err);
    }
});


/* ClientClosedError: The client is closed */