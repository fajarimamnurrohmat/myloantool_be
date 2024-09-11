const BengkelHandler = require("./handler");
const routes = require("./routes");
module.exports = {
    name: "bengkel",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
        const bengkelHandler = new BengkelHandler(service, validator);
        server.route(routes(bengkelHandler));
    },
};
