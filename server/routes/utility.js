/*
This file stores some helpful middleware functions :)
*/

exports.validatePassword = function(password) {
    let regex = /\d/g;
    let regex1 = /[A-Za-z]/g
    if (password.length < 8) {
        console.log("less")
        return 0;
    }
    if (!regex.test(password)) {
        console.log("1");
        return 0;
    }
    if (!regex1.test(password)) {
        console.log("a");
        return 0;
    }
    return 1;
}

exports.validateUserCookies = function(req, res, next){
    return next();
}