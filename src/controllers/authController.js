const dbService = require("../utils/dbService");
const asyncHandler = require("../utils/asyncHandler");

const { createSendToken } = require("../utils/createSendToken");
const userModel = require("../models/userModel");
const generateUniqueNumber = async () => {
  let uniqueNumber;
  let isUnique = false;
  while (!isUnique) {
    uniqueNumber = "#" + Math.floor(1000 + Math.random() * 9000).toString();
    const existingUser = await dbService.findOne(userModel, { uniqueNumber });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return uniqueNumber;
};
exports.register = asyncHandler(async (req, res) => {
  const userExists = await dbService.findOne(userModel, {
    phoneNumber: req.body.phoneNumber,
  });
  if (userExists) {
    return res.badRequest({ message: "رقم الهاتف هذا مستخدم بالفعل." });
  }
  const uniqueNumber = await generateUniqueNumber();
  const data = { ...req.body, uniqueNumber, role: "employee" };
  await dbService.create(userModel, data);
  return res.success({ message: "تم تسجيل الموظف بنجاح" });
});

exports.login = asyncHandler(async (req, res) => {
  const user = await dbService.findOne(userModel, {
    phoneNumber: req.body.phoneNumber,
  });
  if (!user) {
    return res.recordNotFound({ message: "الموظف غير موجود" });
  }

  const isPasswordMatched = await user.isPasswordMatch(req.body.password);
  if (!isPasswordMatched) {
    return res.badRequest({ message: "كلمة مرور غير صحيحه " });
  }
  createSendToken(user, res);
});

exports.currentUser = asyncHandler(async (req, res) => {
  const user = await dbService.findOne(userModel, { _id: req.user.id });
  if (!user) {
    return res.recordNotFound({ message: "الموظف غير موجود" });
  }
  res.success({ data: user });
});
