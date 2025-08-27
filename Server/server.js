import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

//routes-user
import userRoute from "./routes/user.route.js";
import quizeRoute from "./routes/quize.route.js";

dotenv.config();

//call database
connectDB();

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());


app.use("/api/v1/user",userRoute);
app.use("/api/v1/quize",quizeRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));