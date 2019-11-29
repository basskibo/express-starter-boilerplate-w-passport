let userModel = require('../models/user/userModel');

module.exports = {

    registerUser: (args) => {
        console.log("Starting user registration...");
        return new Promise(((res, rej) =>{
            userModel.register(args.query).then(rsp=>{
                return res(rsp);
            }).catch(err =>{
                // console.log("Error while creating: " , JSON.stringify(err));
               return rej(err);
            });
        }));

    },

    login: (email, password) => {
      return new Promise(((res,  rej) =>{
            console.log("Login started! ");
            userModel.loginUser(email,password).then(foundUser =>{
                // console.log("User with this email is found !");
                res(foundUser);
            }).catch(errorFound =>{
                console.log("Error while looking user by email");
                rej(errorFound);
            });
      }));
    },

    getUserById : (args) =>{
        return new Promise(((res, rej)=>{
            const userId = args.userId;
            userModel.getSingleUserById(userId).then(user =>{
                    res(user);
            }).catch(error =>{
                console.log("Error while getting user: " , JSON.stringify(error));
                return rej(error);
            })

        }));
    }

};
