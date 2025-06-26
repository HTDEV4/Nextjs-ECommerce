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

- Nếu mà có cập nhật schema hay có lỗi thì vô thằng `server` chạy backend đầu tiên ngừng lại. Tiếp theo ngừng `prisma` lại và chạy câu lệnh `npx prisma migrate dev` để cập nhật lại db sau đó run lại `npx prisma studio`. Chạy lại backend `npm run dev` ở `server`

- Lỡ `nghịch ngu` xóa db trong migration thì làm lại như sau

  - Comment lại file seed.ts
  - Chạy lệnh `npx prisma migrate reset`
  - Chạy lệnh `npx prisma migrate dev` tên product
  - Chạy lệnh `npx  prisma studio`
  - Gỡ comment seed.ts
  - Chạy `npm run prisma:seed`

- Bởi vì `multer.diskStorage` là API bất đồng bộ — nó chờ bạn xử lý logic nội bộ rồi mới tiếp tục, nên bạn phải gọi lại cb(...) để trả kết quả. Chứ không dùng return
