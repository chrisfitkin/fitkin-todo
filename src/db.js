const Datastore = require('nedb');

export default callback => {
	const db = {
		projects: new Datastore({ filename: 'data/projects.nedb', autoload: true }),
		tasks: new Datastore({ filename: 'data/tasks.nedb', autoload: true }),
		users: new Datastore({ filename: 'data/users.nedb', autoload: true }),
	};
	callback(db);
}
