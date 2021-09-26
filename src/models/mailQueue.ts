import  mongoose  from 'mongoose';
import  uniqueValidator  from 'mongoose-unique-validator';
import { emailStatuses } from '../helpers/enum';

const schema = new mongoose.Schema({
  emailBody: {
    type: String, 
    required: true,
  },
  recipients:[{type:String}],
  status:{
    type : String,
    default : emailStatuses.justIn
    
  },
 created: {type: Date, default: Date.now()},
});

schema.plugin(uniqueValidator);
export default  mongoose.model('mailQueue', schema, 'mailQueue');
