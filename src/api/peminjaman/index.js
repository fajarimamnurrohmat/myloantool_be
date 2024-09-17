const PeminjamanHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: "peminjaman",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
        const peminjamanHandler = new PeminjamanHandler(service, validator);
        server.route(routes(peminjamanHandler));
    },
};
