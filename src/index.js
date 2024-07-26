const express = require("express");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

//middleware
app.use(express.json());
app.use("/user", userRoutes);

app.use((req, res, next) => {
  console.log(`URL : ${req.url}`);
  console.log(`Method : ${req.method}`);
  next();
});

//define port
const PORT = process.env.PORT;

const stratServer = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected...");
      sequelize.sync();
    })
    .then(() => {
      console.log("Database syned...");
      app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
      });
    });
};

stratServer();
