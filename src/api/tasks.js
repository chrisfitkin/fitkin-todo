import resource from 'resource-router-middleware';
import Task from '../models/task';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'task',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load: (req, id, callback) => {
		Task.findOne(db, id)
			.then((task) => {
				const error = task ? null : 'Not found';
				callback(error, task);
			}).catch((error) => {
				callback('Not found');
			});
	},

	/** GET / - List all entities */
	index: async ({ query }, res) => {
		try {
			const tasks = await Task.find(db, query);
			res.json(tasks);
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** POST / - Create a new entity */
	create: async ({ body, user }, res) => {
		try {
			/** Require authenticated user */
			if (user) {
				const task = await Task.insert(db, { ...body, userId: user._id });
				res.status(201).json(task);
			} else {
				res.status(403).send("Authentication required");
			}
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** GET /:id - Return a given entity */
	read: ({ task, ...other }, res) => {
		res.json(task);
	},

	/** PUT /:id - Update a given entity */
	update: async ({ task, body }, res) => {
		try {
			const result = await Task.update(db, task._id, body);
			res.json(result);
		} catch(error) {
			console.error('error', error);
			res.status(500).send(error);
		}
	},

	/** DELETE /:id - Delete a given entity */
	delete: async ({ task }, res) => {
		try {
			const result = await Task.remove(db, task._id);
			res.sendStatus(204);
		} catch(error) {
			res.status(500).send(error);
		}
	},
});
