const SiswaHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: "siswa",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
        const siswaHandler = new SiswaHandler(service, validator);
        server.route(routes(siswaHandler));
    },
};
