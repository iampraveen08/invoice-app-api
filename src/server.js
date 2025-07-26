import app from './app.js';
import config from './config/env.js';
import { connectDB } from './config/db.js';
import { startRemindersCron } from './jobs/reminders.cron.js';

(async () => {
    await connectDB();
    startRemindersCron(); // comment out if not needed
    app.listen(config.port, () => console.log(`Server listening on :${config.port}`));
})();
