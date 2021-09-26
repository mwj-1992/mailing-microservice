const app = require('./app').default;
const config = require('./configs/config').default;
const { pullAnEmailFromTheQueue } = require('./services/sendingMailsService');

const server = app.listen(config.port, () => console.log(`Listening on port ${config.port}...`));
pullAnEmailFromTheQueue();
export  { server };
