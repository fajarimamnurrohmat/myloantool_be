const PengembalianHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'pengembalian',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const pengembalianHandler = new PengembalianHandler(service, validator);
        server.route(routes(pengembalianHandler));
    },
};
