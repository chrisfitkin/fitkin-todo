
/** Add/Remove/Update/Delete a project. The project will have a 
 * unique name and will be used to group a list of tasks.
 */

const Projects = {

  getProjects: (db, params) => new Promise((resolve, reject) => {
    db.find(params, (error, projects) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve(projects);
      }
    });
  }),

  addProject: (db, project) =>  new Promise((resolve, reject) => {
    const { name } = project;
    /** Test that the `name` is unique */
    db.count({ name }, (error, count) => {
      if (count >= 1) {
        reject('Project name must be unique');
      } else {
        /** Insert into Projects */
        db.insert({ name }, (error, project) => {
        if(error) {
          console.error(error);
          reject(error)
        } else {
          resolve(project);
        }
      });
      }
    });
    
  }),
}

export default Projects;