
const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  reports: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      uniqueNumber: String,
      companyBranch: String,
      username: String,
      checkInTime: Date,
      checkInLocation: Object,
      checkOutTime: Date,
      checkOutLocation: Object,
      workHours: Number,
      status: String,
      absentTime:Date,
      absentReason: String,
      cancelReason: String,
      totalCheckInCount: Number,
      totalAbsenceCount: Number,
      totalAbsenceWithReasonCount: Number,
    },
  ],
},{
    timestamps:true
});

module.exports = mongoose.model('DailyReport', dailyReportSchema);