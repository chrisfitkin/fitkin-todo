
/** Add/Remove/Update/Delete a task. Each task will have a task summary, 
 *  task description, due date, and priority. The task can only be created 
 *  in a project.
 */

const Task = {

  find: (db, query) => new Promise((resolve, reject) => {
    if (query.dueDate) {
      query.dueDate = parseDate(query.dueDate);
    }
    db.tasks.find(query, (error, tasks) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve(tasks);
      }
    });
  }),

  findOne: (db, id) => new Promise((resolve, reject) => {
    return db.tasks.findOne({ _id: id }, (error, task) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve(task);
      }
    });
  }),

  insert: (db, task) =>  new Promise((resolve, reject) => {
    return validate(db, null, task)
      .then(({ summary, description, dueDate, priority, projectId }) => {
        /** Insert into Tasks */
        db.tasks.insert({ 
          summary, 
          description, 
          dueDate: parseDate(dueDate), 
          priority, 
          projectId 
        }, (error, task) => {
          if(error) {
            console.error(error);
            reject(error)
          } else {
            resolve(task);
          }
        });
      }).catch(error => reject(error));
  }),

  update: (db, id, task) =>  new Promise((resolve, reject) => {
    return validate(db, id, task)
      .then(({ summary, description, dueDate, priority, projectId }) => {
        /** Update Task */
        db.tasks.update({ _id: id }, {
              summary, 
              description, 
              dueDate: parseDate(dueDate), 
              priority, 
              projectId
            }, 
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
    db.tasks.remove({ _id: id }, (error, countRemoved) => {
      if(error) {
        console.error(error);
        reject(error)
      } else {
        resolve();
      }
    });
  })
}

// Convert string date to Unix timestamp
const parseDate = (date) => {
  return Number.isInteger(date)
    ? date
    : Date.parse(date);
}

const validPriorities = [ 'low', 'medium', 'high' ];

const validate = (db, id, task) => new Promise ((resolve, reject) => {
  const { summary, description, dueDate, priority, projectId } = task;
  const required = [ 'summary', 'description', 'dueDate', 'priority', 'projectId' ];
  /** required fields */
  for (const field of required) {
    if (!task[field])
      reject(`'${field}' field required`)
  }
  /** Enum fields */
  if (!validPriorities.includes(priority)) {
    reject(`'priority' field must be one of: ${validPriorities.toString()}`)
  }
  /** Require project relationship */
  let query = { _id: projectId };
  db.projects.count(query, (error, count) => {
    if (count >= 1) {
      resolve(task);
    } else {
      reject('\'projectId\' not found');
    }
  });
});

export default Task;