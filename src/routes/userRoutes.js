const userController = require("../controllers/userController");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

const router = require("express").Router();
router.post("/check-in", authenticate, userController.checkIn);
router.post("/check-out", authenticate, userController.checkOut);
router.post("/markAbsence", authenticate, userController.markAbsence);
router.get("/get-user/:id",isAdmin, userController.getUser);

router.put("/update/:id", isAdmin, userController.updateUser);
router.get("/today-live-data", isAdmin, userController.getTodaysLiveData);
router.get("/reports", isAdmin, userController.getReportsWithPagination);
router.get("/monthly-report", isAdmin, userController.getMonthlyReport);
router.get("/available-dates", isAdmin, userController.getAvailableDates);
router.delete("/delete/:id", isAdmin, userController.deleteUser);
module.exports = router;
