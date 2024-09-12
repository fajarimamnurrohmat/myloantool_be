const AlatHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: "alat",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
        const alatHandler = new AlatHandler(service, validator);
        server.route(routes(alatHandler));
    },
};
