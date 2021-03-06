import config from "./configs/config";

const express = require('express');
const bodyParser = require('body-parser');
const dbConnect = require('./configs/mongodb').dbConnect;


require('dotenv').config();

const app = express();

dbConnect(config.dbSettings); // Starting DB connection

app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb',
}));

app.use(bodyParser.json());

app.use(require('./routes'));

process.on('uncaughtException', (err) => {
  console.log(err);
});

// catch 404 and forward to error handler
app.use((req: any, res: any, next: any) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  console.log(err.message);
  return res.status(err.status || 500).json(err);
});

export default app;
