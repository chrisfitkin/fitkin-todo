/** Add/Remove/Update/Delete a user. Each user will have a first, 
 *  last name, email address, and password. 
 */
var crypto = require('crypto');

const User = {

  find: (db, query) => new Promise((resolve, reject) => {
    if (query.dueDate) {
      query.dueDate = parseDate(query.dueDate);
    }
    db.users.find(query, (error, users) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve(users.map(user => hidePassword(user)));
      }
    });
  }),

  findOne: (db, id) => new Promise((resolve, reject) => {
    return db.users.findOne({ _id: id }, (error, user) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve(user ? hidePassword(user) : null);
      }
    });
  }),

  insert: (db, user) =>  new Promise((resolve, reject) => {
    return validate(db, null, user)
      .then(({ firstName, lastName, email, password }) => {
        /** Insert into users */
        db.users.insert({ 
          firstName,
          lastName,
          email,
          password: encryptPassword(password)
        }, (error, user) => {
          if(error) {
            console.error(error);
            reject(error)
          } else {
            resolve(hidePassword(user));
          }
        });
      }).catch(error => reject(error));
  }),

  update: (db, id, user) =>  new Promise((resolve, reject) => {
    return validate(db, id, user)
      .then(({ firstName, lastName, email, password }) => {
        /** Update user */
        db.users.update({ _id: id }, {
              firstName,
              lastName,
              email,
              password: encryptPassword(password)
            }, 
            { returnUpdatedDocs: true}, 
            (error, count, result) => {
          if(error) {
            console.error(error);
            reject(error)
          } else {
            resolve(hidePassword(result));
          }
        });
      }).catch(error => reject(error));
  }),

  remove: (db, id) => new Promise((resolve, reject) => {
    db.users.remove({ _id: id }, (error, countRemoved) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve();
      }
    });
  }),

  authenticate: (db, email, password) => new Promise((resolve, reject) => {
    db.users.findOne({ 
      email, 
      password: encryptPassword(password)
    }, (error, user) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        if (user) {
          resolve(user ? hidePassword(user) : null);
        } else {
          reject("Invalid email or password");
        }
      }
    });
  }),
}

// Convert string date to Unix timestamp
const parseDate = (date) => {
  return Number.isInteger(date)
    ? date
    : Date.parse(date);
}

// Password helper functions
const encryptPassword = (password) => 
  crypto.createHash('md5').update(password).digest("hex");

const hidePassword = (user) => Object.assign({},
  user,
  { password: '**********'}
);

const validate = (db, id, user) => new Promise ((resolve, reject) => {
  const { firstName, lastName, email, password } = user;
  const required = [ 'firstName', 'lastName', 'email', 'password' ];
  /** required fields */
  for (const field of required) {
    if (!user[field])
      reject(`'${field}' field required`)
  }

  /** Unique fields */
  let query = { email };
  if (id) {
    query = Object.assign({},
      query,
      { $not: { _id: id } }
    );
  }
  db.users.count(query, (error, count) => {
    if (count >= 1) {
      reject('User \'email\' must be unique');
    } else {
      resolve(user);
    }
  });
});

export default User;