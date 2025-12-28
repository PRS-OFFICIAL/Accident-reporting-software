import express, { json } from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential : true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(express.static("public"));
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});
import mainRoutes from "./routes/main.routes.js";
app.use("/api",mainRoutes);
export default app;