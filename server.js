const express = require("express");
require("dotenv").config();
require("./src/database/connection");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const AppRoutes = require("./src/routes/app");
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

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.session_key,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("", AppRoutes);
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

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
