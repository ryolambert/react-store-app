const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

//  📝 Middleware: Any function that will run in the middle between our request and the response.
/*Brief Diag of Middleware on a server
  REQ /dogs.html

  Our Middleware-
    authenticate
    transform the dogs
    locally translate the dogs

  RES /[dogs, so]
*/
// 👇 this allows us to use any express middleware
server.express.use(cookieParser());

// TODO Use express middleware to populate current user
// Decoding the JWT so we can obtain user Id on each request
server.express.use((req, res, next) => {
  /*
  * Test to see if middleware is functioning
  console.log("Hey, I'm a middleware");
  res.send("test");
  next();
  */
  // * 1. Pull token out of request.
  console.log(req.cookies);
  const { token } = req.cookies;
  //  console.log(token);
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
