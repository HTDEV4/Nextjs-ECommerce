import multer from "multer";
import path from "path";

// * Cấu hình nơi lưu trữ file (disk storage)
const storage = multer.diskStorage({
  // Nơi lưu file upload (mặc định vào thư mục "uploads/")
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Đường dẫn tương đối từ root
  },
  // Cách đặt tên file khi lưu
  filename: function (req, file, cb) {
    cb(
      null,
      // `file.filename` ở đây KHÔNG đúng, nên nên dùng `file.fieldname`
      // hoặc có thể là "image" chẳng hạn, cộng thêm timestamp và đuôi mở rộng gốc
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// * Hàm kiểm tra loại file upload (chỉ chấp nhận ảnh)
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Kiểm tra kiểu mime của file có bắt đầu bằng "image" không (ví dụ: image/png, image/jpeg)
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Cho phép upload
  } else {
    cb(new Error("Not an image! Please upload only images.")); // Từ chối file không phải ảnh
  }
};

// * Tạo instance multer với config đã định nghĩa
export const upload = multer({
  storage: storage, // Sử dụng storage đã cấu hình
  fileFilter: fileFilter, // Sử dụng bộ lọc file
  limits: {
    // Giới hạn kích thước file upload
    fieldSize: 1024 * 1024 * 5, // 5MB
  },
});
