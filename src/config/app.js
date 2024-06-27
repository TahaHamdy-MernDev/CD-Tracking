const express = require("express");
const app = express();
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
let logger = require("morgan");

const cron = require("node-cron");
const cookieParser = require("cookie-parser");
const path = require("path");

const {
  corsOptions,
  mongoSanitizeOptions,
  helmetOptions,
} = require("./options");
const { generateDailyReport } = require("../utils/scheduler");
global.__basedir = path.resolve(__dirname, "..");

app.use(require("../utils/response/responseHandler"));

app.use(cors(corsOptions));

app.use(logger("dev"));

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "30mb" }));
app.use(cookieParser());
app.use(hpp());

app.use(mongoSanitize(mongoSanitizeOptions));
app.use(helmet(helmetOptions));
cron.schedule("55 23 * * *", async () => {
  try {
    await generateDailyReport();
    console.log("generated");
  } catch (error) {
    console.error("Error generating daily report:", error);
  }
});
// generateDailyReport();
app.use("/cold-well/tracker/v1/auth", require("../routes/authRoutes"));
app.use("/cold-well/tracker/v1/user", require("../routes/userRoutes"));
app.use(
  "/cold-well/tracker/v1/uploads",
  express.static(path.join(__basedir, "uploads"))
);

app.use("*", (req, res) => {
  return res.recordNotFound({ message: "can't find this route" });
});

module.exports = app;
