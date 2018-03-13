import resource from 'resource-router-middleware';
import Projects from '../models/projects';

export default ({ config, db: { projects: db } }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'project',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load: (req, id, callback) => {
		// TODO: rewrite using model
		db.findOne({ _id: id }, (error, project) => {
			error = project ? null : 'Not found';
			callback(error, project);
		});
	},

	/** GET / - List all entities */
	index: async ({ params }, res) => {
		try {
			const projects = await Projects.find(db, params);
			res.json(projects);
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** POST / - Create a new entity */
	create: async ({ body }, res) => {
		try {
			console.log('create.body', body);
			const project = await Projects.insert(db, body);
			res.status(201).json(project);
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** GET /:id - Return a given entity */
	read: ({ project }, res) => {
		res.json(project);
	},

	/** PUT /:id - Update a given entity */
	update: async ({ project, body }, res) => {
		try {
			const result = await Projects.update(db, project._id, body);
			res.json(result);
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** DELETE /:id - Delete a given entity */
	delete: async ({ project }, res) => {
		try {
			const result = await Projects.remove(db, project._id);
			res.sendStatus(204);
		} catch(error) {
			res.status(500).send(error);
		}
	},
});
