import cors from "cors";

export default cors({
  optionsSuccessStatus: 200,
  credentials: true,
  origin: ["http://localhost:5173", "https://localhost:5173"], // do not change to "*". It will prevent cookies from saving
});
