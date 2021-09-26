# To run the microservice
 - `git clone ...`
 - `cd mailing-microservice`
 - `npm run install `
 - `cp .env.example .env`
 - `vim .env`
 - Fill in the value of the environment
 - `npm run dev` OR if have `pm2` installed globally then run `pm2 start server.ts`

# Microservice archtiecture
- This microservice following message Queue principle
-  We have two sources of the emails 
--  1.APIs
--.Events

- The above two email sources will add the email content( body, recipients) into the queue, and a message will be populated to the end user tells him that system is processing his email.
# Notes
###### -  We have one Consumer running all the time to check the email Queue and deal with them.
###### - The consumer will check every 2 seconds on the queue
######  - If got any email, will pull it and update it's status to be  under `processing`status, and after sending the email the status will be updated to be one of `[SENT, FAILED]` depending on the email delivery gateway response.
######  - We have added some logic to ensure that we have a fixed gap between each sending email processes.
###### - Regardless the taken time of sending the email (becuase it's not a fixed time, it depends on many factors like [internet connetion, mail delivery service, etc...]) we have a fixed gap between calls,
###### - We have accomplished the fixed gap by adding `setTimeout` where we call the recursion.
 ###### - The microservice has been tested using this library `https://www.npmjs.com/package/loadtest`  and the result has been attached below.
 ###### - We can increase the speed of the microservice by decreasing the gap between the mail delivery API calls, and by pulling more than 1 email from the queue


#####  the attached chart will explain the steps.



#  Scalability
###### We have increased the availability of the app by running it on all EC2 processors using `pm2 start server.ts -i -1` 
###### and in my EC2 case the app will be cloned 5 times





![alt text](https://github.com/mwj-1992/mailing-microservice/blob/master/assets/images/Diagram.JPG?raw=true)
![alt text](https://github.com/mwj-1992/mailing-microservice/blob/master/assets/images/Benchmarks.JPG?raw=true)

