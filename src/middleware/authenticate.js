import User from '../models/user';

/** 
  * Check for basic authentication and lookup user
  * Authorization: Basic YWxhZGRpbkBnbWFpbC5jb206T3BlblNlc2FtZQ==
  * https://en.wikipedia.org/wiki/Basic_access_authentication
  * aladdin@gmail.com:OpenSesame
  */
const authenticate = ({ config, db }) => (req, res, next) => {
  console.log('AUTHENTICATE');
  if(req.headers.authentication) {
    try {
      const authentication = req.headers.authentication.split(" ")[1];
      const credentials = Buffer.from(authentication, 'base64').toString("ascii").split(":");
      console.log('authentication', authentication);
      console.log('credentials', credentials);
      const [ email, password ] = credentials;
      User.authenticate(db, email, password).then((user) => {
        /** Add user to the request object for next routes */
        req.user = user;
        next();
      }).catch((error) => {
        res.status(401).send("Invalid email or password");
      });
    } catch(error) {
      res.status(400).send("Invalid authentication attempt format")
    }
  } else {
    // no authentication attempt
    next();
  }
}

export default authenticate;