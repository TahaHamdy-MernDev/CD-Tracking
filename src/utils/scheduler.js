const userModel = require("../models/userModel");
const dailyReportModel = require("../models/dailyReportModel");
const monthlyReportModel = require("../models/monthlyReportModel");
const { getAttendanceStatus, getCurrentEgyptTime } = require("./common");
/**
 * for holidays
 *  const dayOfMonth = today.getDate();if (dayOfMonth >= 15 && dayOfMonth <= 23) {status = "Holiday";} else
 */
const generateDailyReport = async () => {
  for (let i = 0; i <= 1; i++) {
    let today = getCurrentEgyptTime();
    today = new Date(today);
    today.setDate(today.getDate() - i);
    today.setUTCHours(0, 0, 0, 0);

    const existingReport = await dailyReportModel.findOne({ date: today });
    if (existingReport) {
      console.log( 
        `Daily report already exists for ${today.toISOString().split("T")[0]}`
      );
      continue;
    }

    const users = await userModel.find({
      createdAt: { $lte: today },
      role: { $ne: "admin" },
    });
    const reports = await Promise.all(
      users.map(async (user) => {
        const todaysAttendance = user.attendance.find((record) => {
          const recordDate = new Date(record.date).setUTCHours(0, 0, 0, 0);
          return recordDate === today.getTime();
        });

        let {
          status,
          absentReason,
          checkInTime,
          checkOutTime,
          workHours,
          absentTime,
          checkInLocation,
          checkOutLocation,
        } = getAttendanceStatus(todaysAttendance, today);

       if (user.companyBranch === "زايد") {
          if (today.getDay() === 5 || today.getDay() === 6) {
            status = "Holiday";
          }
        } else if (user.companyBranch === "الاسكندرية") {
          if (today.getDay() === 5) {
            status = "Holiday";
          }
        }

        return {
          userId: user._id,
          uniqueNumber: user.uniqueNumber,
          companyBranch: user.companyBranch,
          username: user.username,
          checkInTime,
          checkInLocation,
          checkOutTime,
          checkOutLocation,
          workHours,
          status: status,
          absentTime,
          absentReason,
          checkIn: status === "Completed" || status === "workMeeting" ? 1 : 0,
          absenceWithReason: status === "Absent with Reason" ? 1 : 0,
          dayNotCompleted: status === "Day not completed" ? 1 : 0,
          absenceWithoutReason: status === "Absent without Reason" ? 1 : 0,
          totalCanceledCount: status === "Canceled" ? 1 : 0,
        };
      })
    );

    const dailyReport = new dailyReportModel({
      date: today,
      reports,
    });

    await dailyReport.save();
    console.log(
      `Daily report generated for ${today.toISOString().split("T")[0]}`
    );
    // console.log("Daily report generated");
    await updateMonthlyReport(today, reports);
  }
  /*
  const today = new Date();
  today.setDate(today.getDate() - 38);
  today.setUTCHours(0, 0, 0, 0);
  console.log(today);
  const existingReport = await dailyReportModel.findOne({ date: today });
  if (existingReport) {
    console.log("Daily report already exists for today");
    return; 
  }

  const users = await userModel.find({
    createdAt: { $lte: today },
    role: { $ne: "admin" },
  });
  const reports = await Promise.all(
    users.map(async (user) => {
      const todaysAttendance = user.attendance.find((record) => {
        const recordDate = new Date(record.date).setUTCHours(0, 0, 0, 0);
        return recordDate === today.getTime();
      });

      let {
        status,
        absentReason,
        checkInTime,
        checkOutTime,
        workHours,
        absentTime,
        checkInLocation,
        checkOutLocation,
      } = getAttendanceStatus(todaysAttendance, today);

      const dayOfMonth = today.getDate();
      console.log(dayOfMonth);
      if (dayOfMonth >= 15 && dayOfMonth <= 23) { 
        status = "Holiday";
      } else if (user.companyBranch === "زايد") {
        if (today.getDay() === 5 || today.getDay() === 6) {
          status = "Holiday";
        }
      } else if (user.companyBranch === "الاسكندرية") {
        if (today.getDay() === 5) {
          status = "Holiday";
        }
      }

      // if (user.companyBranch === "زايد") {

      //   if (today.getDay() === 5 || today.getDay() === 6) {
      //     status = "Holiday"
      //   }
      // } else if (user.companyBranch === "الاسكندرية") {
      //   if (today.getDay() === 5) {
      //     status = "Holiday"
      //   }
      // }

      return {
        userId: user._id,
        uniqueNumber: user.uniqueNumber,
        companyBranch: user.companyBranch,
        username: user.username,
        checkInTime,
        checkInLocation,
        checkOutTime,
        checkOutLocation,
        workHours,
        status: status,
        absentTime,
        absentReason,
        checkIn: status === "Completed" || status === "workMeeting" ? 1 : 0,
        absenceWithReason: status === "Absent with Reason" ? 1 : 0,
        dayNotCompleted: status === "Day not completed" ? 1 : 0,
        absenceWithoutReason: status === "Absent without Reason" ? 1 : 0,
        totalCanceledCount: status === "Canceled" ? 1 : 0,
      };
    })
  );

  const dailyReport = new dailyReportModel({
    date: today,
    reports,
  });

  await dailyReport.save();
  console.log("Daily report generated");
  await updateMonthlyReport(today, reports);

  */
};

const updateMonthlyReport = async (date, dailyReports) => {
  const currentMonth = new Date(date).toISOString().slice(0, 7);

  const monthlyReport = await monthlyReportModel.findOne({
    month: currentMonth,
  });

  if (!monthlyReport) {
    const newMonthlyReport = new monthlyReportModel({
      month: currentMonth,
      reports: dailyReports.map((report) => ({
        userId: report.userId,
        uniqueNumber: report.uniqueNumber,
        companyBranch: report.companyBranch,
        username: report.username,
        totalWorkHours: report.workHours,
        totalCheckInCount: report.checkIn,
        totalNotCompletedCount: report.dayNotCompleted,
        totalAbsenceWithReasonCount: report.absenceWithReason,
        totalCanceledCount: report.totalCanceledCount,
        totalAbsenceWithoutReasonCount: report.absenceWithoutReason,
      })),
    });
    console.log("monthly report created");
    await newMonthlyReport.save();
  } else {
    dailyReports.forEach((dailyReport) => {
      const userReport = monthlyReport.reports.find((report) =>
        report.userId.equals(dailyReport.userId)
      );
      if (userReport) {
        userReport.totalWorkHours += dailyReport.workHours;
        userReport.totalCheckInCount += dailyReport.checkIn || 0;
        userReport.totalAbsenceWithReasonCount +=
          dailyReport.absenceWithReason || 0;
        userReport.totalCanceledCount += dailyReport.totalCanceledCount || 0;
        userReport.totalAbsenceWithoutReasonCount +=
          dailyReport.absenceWithoutReason || 0;
        userReport.totalNotCompletedCount += dailyReport.dayNotCompleted || 0;
      } else {
        monthlyReport.reports.push({
          userId: dailyReport.userId,
          uniqueNumber: dailyReport.uniqueNumber,
          companyBranch: dailyReport.companyBranch,
          username: dailyReport.username,
          totalWorkHours: dailyReport.workHours,
          totalCheckInCount: dailyReport.totalCheckInCount || 0,
          totalAbsenceWithReasonCount:
            dailyReport.totalAbsenceWithReasonCount || 0,
          totalCanceledCount: dailyReport.totalCanceledCount || 0,
          totalAbsenceWithoutReasonCount:
            dailyReport.totalAbsenceWithoutReasonCount || 0,
          totalNotCompletedCount: dailyReport.totalNotCompletedCount || 0,
        });
      }
    });
    await monthlyReport.save();
  }
};

module.exports = { generateDailyReport };
