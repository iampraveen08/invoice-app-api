import cron from 'node-cron';
import { isAfter } from 'date-fns';
import Invoice from '../models/invoice.model.js';
import { sendMail } from '../utils/email.js';

export const startRemindersCron = () => {
    // Every day at 9 AM
    cron.schedule('0 9 * * *', async () => {
        const overdue = await Invoice.find({ status: { $in: ['sent', 'overdue'] } }).populate('client organization');
        const now = new Date();
        for (const inv of overdue) {
            if (isAfter(now, inv.dueDate)) {
                await sendMail({
                    to: inv.client.email,
                    subject: `Reminder: Invoice #${inv._id} overdue`,
                    html: `<p>Your invoice of ${inv.amount} is overdue.</p>`
                });
            }
        }
        console.log('Reminder job ran', new Date().toISOString());
    });
};
