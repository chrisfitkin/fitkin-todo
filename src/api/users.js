import resource from 'resource-router-middleware';
import User from '../models/User';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'user',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load: (req, id, callback) => {
		User.findOne(db, id)
			.then((user) => {
				const error = user ? null : 'Not found';
				callback(error, user);
			}).catch((error) => {
				callback('Not found');
			});
	},

	/** GET / - List all entities */
	index: async ({ query }, res) => {
		try {
			const users = await User.find(db, query);
			res.json(users);
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** POST / - Create a new entity */
	create: async ({ body }, res) => {
		try {
			const user = await User.insert(db, body);
			res.status(201).json(user);
		} catch(error) {
			res.status(500).send(error);
		}
	},

	/** GET /:id - Return a given entity */
	read: ({ user, ...other }, res) => {
		res.json(user);
	},

	/** PUT /:id - Update a given entity */
	update: async ({ user, body }, res) => {
		try {
			const result = await User.update(db, user._id, body);
			res.json(result);
		} catch(error) {
			console.error('error', error);
			res.status(500).send(error);
		}
	},

	/** DELETE /:id - Delete a given entity */
	delete: async ({ user }, res) => {
		try {
			const result = await User.remove(db, user._id);
			res.sendStatus(204);
		} catch(error) {
			res.status(500).send(error);
		}
	},
});
