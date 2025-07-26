import { startOfMonth, endOfMonth } from 'date-fns';
import Invoice from '../models/invoice.model.js';
import Client from '../models/client.model.js';

export const getDashboardSummary = async (orgId) => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const [monthCount, paidCount, unpaidCount, totalClients] = await Promise.all([
        Invoice.countDocuments({ organization: orgId, createdAt: { $gte: start, $lte: end } }),
        Invoice.countDocuments({ organization: orgId, status: 'paid' }),
        Invoice.countDocuments({ organization: orgId, status: { $in: ['draft', 'sent', 'overdue'] } }),
        Client.countDocuments({ organization: orgId })
    ]);

    const totalsAgg = await Invoice.aggregate([
        { $match: { organization: orgId } },
        { $group: { _id: '$status', total: { $sum: '$amount' } } }
    ]);

    const totals = totalsAgg.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.total }), {});

    return {
        currentMonthInvoices: monthCount,
        totalPaid: paidCount,
        totalUnpaid: unpaidCount,
        totalClients,
        totalsByStatusAmount: totals
    };
};
