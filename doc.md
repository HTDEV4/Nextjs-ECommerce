# Design hệ thống

- Tạo client với câu lệnh ở nextjs
- Tạo server tạo src
- Tạo docker
- Cấu hình package.json

## Cấu hình bên BE ở Server

- Cấu hình trong src
- Folder gồm controllers, middleware, routes.

# Chạy dự án

- Chuẩn bị terminal cho client
- npx prisma studio: dùng để chạy Prisma Studio (Chạy ở server)
- nhớ mở docker desktop lên: docker compose up --build
- npm run dev bên server

## Chú ý

- port tùy vào mình mún config port nào match với 5432 thì mình chọn
- Khi thay đổi POSTGRES_DB trong `.env` `/cuối cùng` thì trong docker POSTGRES_DB nó cũng sẽ thay đổi theo
- Cái th seed trong prisma nó sẽ gúp chúng ta quản lí role cho toàn hệ thống
