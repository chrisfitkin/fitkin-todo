
/** Add/Remove/Update/Delete a project. The project will have a 
 * unique name and will be used to group a list of tasks.
 */

const Project = {

  find: (db, query) => new Promise((resolve, reject) => {
    db.projects.find(query, (error, projects) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve(projects);
      }
    });
  }),

  findOne: (db, id) => new Promise((resolve, reject) => {
    return db.projects.findOne({ _id: id }, (error, project) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve(project);
      }
    });
  }),

  insert: (db, project) =>  new Promise((resolve, reject) => {
    return validate(db, null, project)
      .then(({ name }) => {
        /** Insert into Projects */
        db.projects.insert({ name }, (error, project) => {
          if(error) {
            console.error(error);
            reject(error)
          } else {
            resolve(project);
          }
        });
      }).catch(error => reject(error));
  }),

  update: (db, id, project) =>  new Promise((resolve, reject) => {
    return validate(db, id, project)
      .then(({ name }) => {
        /** Insert into Projects */
        db.projects.update({ _id: id }, 
            { name }, 
            { returnUpdatedDocs: true}, 
            (error, count, result) => {
          if(error) {
            console.error(error);
            reject(error)
          } else {
            resolve(result);
          }
        });
      }).catch(error => reject(error));
  }),

  remove: (db, id) => new Promise((resolve, reject) => {
    db.projects.remove({ _id: id }, (error, countRemoved) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve();
      }
    });
  })
}

const validate = (db, id, project) => new Promise ((resolve, reject) => {
  const { name } = project;
  const required = [ 'name' ];
  /** required fields */
  for (const field of required) {
    if (!project[field])
      reject(`'${field}' field required`)
  }
  /** Unique fields */
  let query = { name };
  if (id) {
    query = Object.assign({},
      query,
      { $not: { _id: id } }
    );
  }
  db.projects.count(query, (error, count) => {
    if (count >= 1) {
      reject('Project name must be unique');
    } else {
      resolve(project);
    }
  });
});

export default Project;