// Import PrismaClient từ thư viện @prisma/client để thao tác với database
import { PrismaClient } from "@prisma/client";

// Dùng dotenv để load các biến môi trường từ file .env
import dotenv from "dotenv";

// Import các thư viện middleware cơ bản
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import các route liên quan đến authentication
import authRoutes from "./routes/authRoutes";

// Import các route liên quan đến Product
import productRoutes from "./routes/productRoutes";

// Load tất cả biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Lấy PORT từ biến môi trường hoặc mặc định là 3001
const PORT = process.env.PORT || 3001;

// Cấu hình CORS cho phép frontend (Next.js) truy cập từ http://localhost:3000
const corsOptions = {
  origin: "http://localhost:3000", // Cho phép frontend này gọi API
  credentials: true, // Cho phép gửi cookies qua request
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Cho phép các method này
  allowedHeaders: ["Content-Type", "Authorization"], // Các header cho phép gửi
};

// Áp dụng các middleware vào Express
app.use(cors(corsOptions)); // Middleware cho phép CORS
app.use(express.json()); // Middleware để parse JSON body
app.use(cookieParser()); // Middleware để đọc cookies từ request

// Tạo một instance Prisma Client để kết nối database
export const prisma = new PrismaClient();

// Đăng ký các route auth vào path /api/auth
// Ví dụ: POST /api/auth/register, POST /api/auth/login,...
app.use("/api/auth", authRoutes);

// API Product
app.use("/api/products", productRoutes);

// Một route test đơn giản
app.get("/", (req, res) => {
  res.send("Hello from E-Commerce backend");
});

// Khởi động server Express và lắng nghe trên cổng PORT
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

// Đảm bảo ngắt kết nối Prisma khi server bị dừng (Ctrl + C hoặc lỗi nghiêm trọng)
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
