import  express from 'express';
const router = express.Router();
import cors from 'cors';
import  config from  '../configs/config';
const whitelist = config.corsWhitelist.split(',');

const corsOptions = {
  origin(origin:any, callback:any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // !origin // allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      console.log(`Not allowed by CORS, Origin ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  exposedHeaders: 'Authorization',
};

router.use(cors(corsOptions));
router.use('/api/mail', require('./mailRoute').default);


module.exports = router;
