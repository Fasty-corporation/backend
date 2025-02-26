// Importing necessary modules
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./util/database"); // Ensure this is correctly implemented

// Importing routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopsRoutes");
// const deliveryBoy = require("./routes/deliveryBoyRoutes")
// Initialize express app
const app = express();

// Applying middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Defining routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/shop", shopRoutes);
// app.use("/api/deliveryBoy",deliveryBoy)
// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Handling unknown routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

connectDB();
// Function to start server after database connection
const startServer = async () => {
  try {
     // Connect to the database
    require("./relations/relations")(); // Setup relationships if using Sequelize

    const PORT = process.env.RUNNING_PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1); // Exit process if the database connection fails
  }
};

// Start the server
startServer();
