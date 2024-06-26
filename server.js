const express = require("express");
require("dotenv").config();
require("./src/database/connection");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const AppRoutes = require("./src/routes/app");
const morgan = require("morgan");
const path = require("path");

// const GoogleAuthRouter = require("./src/routes/goggle-auth");

const AuthRoutes = require("./src/routes/auth");
const PrivacyPolicyRoutes = require("./src/routes/privacyPolicy");
const FAQRoutes = require("./src/routes/faq");
const TermsConditionsRoutes = require("./src/routes/terms&conditions");
const ProfileRoutes = require("./src/routes/profile");
const BookingRoutes = require("./src/routes/booking");
const ChargingPointRoutes = require("./src/routes/chargingPoint");
const ConnectionTypeRoutes = require("./src/routes/connectionType");
const AmenityRoutes = require("./src/routes/amenity");
const FavouriteChargingPointRoutes = require("./src/routes/favouriteChargingPoint");
const UserActivityRoutes = require("./src/routes/userActivity");
const PricesRoutes = require("./src/routes/price");
const VehicleTypeRoutes = require("./src/routes/vehicleType");
const VehicleModelRoutes = require("./src/routes/vehicleModel");
const ReviewRoutes = require("./src/routes/review");
const AdminRoutes = require("./src/routes/adminUser");
const UserRoutes = require("./src/routes/user");
const AttendantRoutes = require("./src/routes/attendant");
const NotificationRoutes = require("./src/routes/notification");
const ChargingPointAdminUserRoutes = require("./src/routes/chargingPointAdmin");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000", // Replace with your React app's origin
  },
});

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.session_key,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(morgan("dev"));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/home", (req, res) => {
  return res.send("Hello welcome to Connect Volt api");
});
// app.use("", GoogleAuthRouter);
app.use("/api/auth/", AuthRoutes);
app.use("/api/privacy-policy", PrivacyPolicyRoutes);
app.use("/api/faq", FAQRoutes);
app.use("/api/terms-conditions", TermsConditionsRoutes);
app.use("/api/profile", ProfileRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/charging-point", ChargingPointRoutes);
app.use("/api/connection-type", ConnectionTypeRoutes);
app.use("/api/amenity", AmenityRoutes);
app.use("/api/favourite-point", FavouriteChargingPointRoutes);
app.use("/api/user-activity", UserActivityRoutes);
app.use("/api/prices", PricesRoutes);
app.use("/api/vehicle-type", VehicleTypeRoutes);
app.use("/api/vehicle-model", VehicleModelRoutes);
app.use("/api/review", ReviewRoutes);
app.use("/api/admin-user", AdminRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/attendants", AttendantRoutes);
app.use("/api/notification", NotificationRoutes);
app.use("/api/charging-point-admin", ChargingPointAdminUserRoutes);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
