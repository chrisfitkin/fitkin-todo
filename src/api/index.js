import { version } from '../../package.json';
import { Router } from 'express';
import projects from './projects';
import tasks from './tasks';

export default ({ config, db }) => {
	let api = Router();

	// console.log('api/projects', projects);

	// mount the facets resource
	api.use('/projects', projects({ config, db }));
	api.use('/tasks', tasks({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
