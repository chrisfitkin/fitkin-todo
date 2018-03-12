const Datastore = require('nedb');

export default callback => {
	const db = new Datastore({ filename: 'data/data', autoload: true });
	callback(db);
}
