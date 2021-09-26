import { emailStatuses } from "../helpers/enum";
import { MessageEmailInterface } from "../types/interfaces";
const axios = require('axios');
const Models = require("../models").default;
const _ = require('lodash');

const callingEmailDeliveryProvider = (message: MessageEmailInterface) => {
    message.api_key = process.env.SMTP2GO_API_KEY || '';
    message.sender = 'no-reply<no-reply@wael.com>';
    return axios.post('https://api.smtp2go.com/v3/email/send', message)
        .then((response: any) => {
            console.log(`Email sent successfully! to ${JSON.stringify(message.to)}`);
            return true;
        }).catch((error: any) => {
            console.error('An error occured while sending email', error.message);
            return false;
        })
};
/**
 * This function will be called recursively while the app is running
 * It will pull a single email from the queue and send it to recipients
 */


const markTheEmailDocument = async (id: string, succeed: boolean = true) => {
    try {
        const status: string = succeed ? emailStatuses.sent : emailStatuses.failed;
        await Models.MailQueue.updateOne({ _id: id }, { status });
    } catch (e: any) {
        console.error(e.message);
    }
}
export const pullAnEmailFromTheQueue = async () => {
    let recordInQueue: any;
    try {
        recordInQueue = await Models.MailQueue.findOneAndUpdate({ status: { $in: [emailStatuses.justIn, emailStatuses.processing] } },
            { $set: { status: emailStatuses.processing } }).exec();
        if (recordInQueue) {
            const result = await callingEmailDeliveryProvider({
                to: _.get(recordInQueue, 'recipients'),
                subject: `Mailing micorservice...`,
                html_body: `<div> ${recordInQueue.emailBody}</div>`,
            } as MessageEmailInterface);
            await markTheEmailDocument(recordInQueue._id, result);
            console.log('sent the email');
        }
        setTimeout(() => {
            /* the reason of putting the timeout here because we need 
            to ensure that there is a gap equals 2s between each sending process(regardless the taken time of sending email.)*/
            console.log('called again');
            pullAnEmailFromTheQueue();
        }, 2000)
    } catch (e: any) {
        console.error(e.message);
    }
}