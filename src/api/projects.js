import resource from 'resource-router-middleware';
import Project from '../models/project';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'project',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load: (req, id, callback) => {
		Project.findOne(db, id)
			.then((project) => {
				const error = project ? null : 'Not found';
				callback(error, project);
			}).catch((error) => {
				callback('Not found');
			});
	},

	/** GET / - List all entities */
	index: async ({ query }, res) => {
		try {
			const projects = await Project.find(db, query);
			res.json(projects);
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** POST / - Create a new entity */
	create: async ({ body, user }, res) => {
		try {
			/** Require authenticated user */
			if (user) {
				const project = await Project.insert(db, { ...body, userId: user._id });
				res.status(201).json(project);
			} else {
				res.status(403).send("Authentication required");
			}
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** GET /:id - Return a given entity */
	read: ({ project, ...other }, res) => {
		res.json(project);
	},

	/** PUT /:id - Update a given entity */
	update: async ({ project, body }, res) => {
		try {
			const result = await Project.update(db, project._id, body);
			res.json(result);
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** DELETE /:id - Delete a given entity */
	delete: async ({ project }, res) => {
		try {
			const result = await Project.remove(db, project._id);
			res.sendStatus(204);
		} catch(error) {
			res.status(500).send(error);
		}
	},
});
