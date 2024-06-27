
const mongoose = require('mongoose');

const monthlyReportSchema = new mongoose.Schema({
  month: { type: String, required: true }, 
  reports: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      uniqueNumber: String,
      companyBranch: String,
      username: String,
      totalWorkHours: Number,
      totalCheckInCount: Number,
      totalCanceledCount: Number,
      totalNotCompletedCount:Number,
      totalAbsenceWithReasonCount: Number,
      totalAbsenceWithoutReasonCount: Number,
      totalAbsenceCount:Number,
    },
  ],
});

module.exports = mongoose.model('MonthlyReport', monthlyReportSchema);