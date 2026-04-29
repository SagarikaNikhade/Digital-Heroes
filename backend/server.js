const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connection } = require("./config/db");
const { UserRouter } = require("./routes/user.route");
const { scoreRouter } = require("./routes/score.route");
const { PaymentRouter } = require("./routes/payment.route");
const { DrawRouter } = require("./routes/draw.route");
const { CharityRouter } = require("./routes/charity.route")

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/user", UserRouter);
app.use("/score", scoreRouter);
app.use("/payment", PaymentRouter);
app.use("/draw", DrawRouter);
app.use("/charity", CharityRouter);

app.listen(process.env.port, async () => {
    try {
        await connection
        
        console.log(`Server is running at port ${process.env.port}`);
        console.log("Connected to DB");
    } catch (error) {
        console.log(error.message);
    }
})