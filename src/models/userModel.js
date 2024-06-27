const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { DateTime } = require('luxon');

const DailyAttendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    checkIn: Date,
    checkOut: Date,
    checkInLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    checkOutLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    isAbsent: { type: Boolean, default: false },
    absentReason: String,
    permissionType:String,
    absentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    absentTime:Date,
    workMeeting: { type: Boolean, default: false },
    willBeLate: { type: Boolean, default: false },
  },
  { _id: false  }
);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    companyBranch: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    attendance: [DailyAttendanceSchema],
    uniqueNumber: { type: String, required: true, unique: true },
    token: String,
  },
  {
    timestamps: true,
  } 
);


UserSchema.methods.calculateAttendanceStats = function () {
  try {
    let totalAbsenceCount = 0;
    let totalAbsenceWithReasonCount = 0;
    let totalAbsenceWithOutReasonCount = 0;
    let totalCheckInCount = 0;
    this.attendance.forEach((entry) => {
      if (entry.isAbsent) {
        if (entry.absent && !entry.absentReason) {
          totalAbsenceCount++;
        }
        if (entry.absentReason) {
          totalAbsenceWithReasonCount++;
        }
      }
      if (entry.checkIn) {
        totalCheckInCount++;
      }
    });

    return {
      totalAbsenceWithOutReasonCount,
      totalAbsenceCount,
      totalAbsenceWithReasonCount,
      totalCheckInCount,
    };
  } catch (error) {
    console.error("Error calculating attendance stats:", error.message);
    throw error;
  }
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.methods.isPasswordMatch = async function(password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  delete object.password;

  return object;
});
const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;
