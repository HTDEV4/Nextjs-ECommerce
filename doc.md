# Design hệ thống

- Tạo client với câu lệnh ở nextjs
- Tạo server tạo src
- Tạo docker
- Cấu hình package.json

## Cấu hình bên BE ở Server

- Cấu hình trong src
- Folder gồm controllers, middleware, routes.

# Chạy dự án

- Chuẩn bị terminal cho client chạy npm run dev FE
- npx prisma studio: dùng để chạy Prisma Studio (Chạy ở server)
- nhớ mở docker desktop lên: docker compose up --build
- npm run dev bên server cho BE

## Chú ý

- port tùy vào mình mún config port nào match với 5432 thì mình chọn
- Khi thay đổi POSTGRES_DB trong `.env` `/cuối cùng` thì trong docker POSTGRES_DB nó cũng sẽ thay đổi theo
- Cái th seed trong prisma nó sẽ gúp chúng ta quản lí role cho toàn hệ thống

- `Arcjet` dùng để bảo vệ thông tin khi `Đăng ký`, `Đăng nhập` nói chung thằng này dùng để validate dữ liệu cho phần Auth.
- `zustand`

- Sử dụng middleware để xử lí trung gian URL ngăn không cho vô những đường dẫn khác hoặc dùng để lọc, validate, làm sạch dữ liệu trước khi xử lý tiếp.
- ví dụ là mình đã login vô user rồi nhưng mà nhập đường dẫn admin thì vẫn vô trang admin bình thường.
