import catchAsync from '../utils/catchAsync.js';
import * as dashboardService from '../services/dashboard.service.js';

export const summary = catchAsync(async (req, res) => {
    const data = await dashboardService.getDashboardSummary(req.user.organization._id);
    res.json(data);
});
