const db = require('../../data/dbConfig')

const checkBody = (req, res, next) => {
    try{
        if(req.body.username && req.body.password){
            next()
        } else{
            next({ status: 400, message: "username and password required"})
        }
    } catch(err){
        next(err)
    }
}

const checkNameExsists = async (req, res, next) => {
    try{
        const [user] = await db('users').where({username: req.body.username}).select('username')
        if(user){
            next({ status: 400, message: "username taken" })
        } else {
            next()
        }
    } catch(err){
        next(err)
    }
}

module.exports = {
    checkBody,
    checkNameExsists
}