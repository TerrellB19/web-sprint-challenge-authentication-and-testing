const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'shh'



const restrict = (req, res, next) => {
  
  const token = req.headers.authorization;

  // req.headers.authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo0LCJ1c2VybmFtZSI6ImZyZWRkeSIsImlhdCI6MTY5MDQ1NDU4NywiZXhwIjoxNjkwNTQwOTg3fQ.L1YceMqmWTtjj6Tvh0dku0LLzZcCOfgvu-XyaQTYWpU"

  if(!token){
     next({status: 401, message: "token required"})
  } else{
   jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
     if(err){
       next({status: 401, message: "Token invalid"})
     }else{
       req.decodedToken = decodedToken
       next()
     }
   })
  }
}

module.exports = restrict
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */



