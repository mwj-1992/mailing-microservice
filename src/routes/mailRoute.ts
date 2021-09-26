const router = require("express").Router();
const { validationResult, body, check } = require("express-validator");
const _ = require("lodash");
const Models = require("../models").default;

/**
 * Add new email into emil Queue 
 */
router.post(
  "/",
  [
    body("emailBody").notEmpty(),
    body("recipients").notEmpty().isArray().custom((recipients: string[]) => {
      let validRecipients: boolean = true;
      _.map(recipients, (recipient: string) => {
        validRecipients = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recipient); // Reges Pattern to validate recipient email.
        if (!validRecipients) throw new Error(`(${recipient}) is invalid email...`);
      })
      return validRecipients;
    })
  ],
  (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const row = new Models.MailQueue(req.body);
    row.save((err: any) => {
      if (err) {
        if (_.get(err, 'name') === 'ValidationError') {
          return res.status(500).json({
            msg: _.get(err, 'message'),
          });
        }
        return res.status(500).json(err);
      }
      return res.status(201).json({ msg: 'Will send the email shortly...' });
    });
  }
);
export default router;
