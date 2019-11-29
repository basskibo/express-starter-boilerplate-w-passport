console.log(process.env.REDISTOGO_URL);
const redis = require("redis"),
    client = redis.createClient(process.env.REDISTOGO_URL);


module.exports = {
    setCredentialsForSession: (params, token) =>{
        return new Promise(((res, rej) =>{
            let key = "w-" + params._id;
            client.select(1, function () {
                client.set(key, token, redis.print);
                client.expireat(key, parseInt((+new Date)/1000) + 86400);
                res(true);
            });
        }));

    }


};
