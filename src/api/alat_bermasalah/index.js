const AlatBermasalahHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: "alat-bermasalah",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
        const alatBermasalahHandler = new AlatBermasalahHandler(service, validator);
        server.route(routes(alatBermasalahHandler));
    },
};
