# Blockchain App with ReactJS, Firebase and Java
Link deployed website UI: https://zen-lovelace-a38391.netlify.app/ /
Link demo: https://youtu.be/kZNuoszXHjw

## Feature
1. Only sign-in with Google Account (using Firebase Authentication)
2. Database in Firebase Cloud
3. ReactJS with library React-router-dom, Firebase, Components by Ant.Desgin
4. Create blockchain
5. Transaction
6. Buy USD, Send Token, Swap Token
7. Available in Mobile, Tablet and Web

# Hướng dẫn dùng thử Project Blockchain Beta (tiếng Việt)
Project có tổng 2 thư mục, Back-End với ngôn ngữ Java (Spring Boot), Front-End với ngôn ngữ ReactJS \
Yêu cầu: Chạy riêng 2 thư mục vì localhost sẽ khác nhau

## Spring Boot Java (Back-End) - localhost:8080

Yêu cầu chạy Back-end trước để đảm bảo server hoạt động ổn định
Cần có:
1. `serviceAccountKey` của Firebase API đồ án (dưới dạng json) và di chuyển đến thư mục `blockchain/java/src/main/resources/`
2. Cần có Spring Boot, Java, Maven để chạy được Project

### Dịch vụ (đồng ETH)
#### Bước 1: Đăng nhập (gồm 2 luồng)
* `/signup&uid=xxx` -> tạo tài khoản mới 
* `/signin`-> đăng nhập tài khoản đã có 
#### Bước 2: Thực hiện chức năng mua-chuyển-đổi (gồm 3 luồng) 
* `/buy?uid=xxxx&value=yyy` 
* `/send?uid1=xxx&uid2=yyy&token=token&value=value` 
* `/swap?uid=xxx&token1=token1&value=value&token2=token2` 

## React (Front-End) localhost:3000

### `npm install`

Gõ cmd `npm install` để cài đặt package npm trong máy của bạn

### `npm start`

Gõ cmd `npm start` để chạy ReactJS
Mở [http://localhost:3000](http://localhost:3000) để xem giao diện trên trình duyệt.

Giao diện UI chạy lần đầu sẽ gặp một vài lỗi không ý muốn. Lỗi này sẽ fix sau.
Nếu muốn truy cập được... liên hệ.

## Tính năng thêm
* Có thể chạy trên điện thoại với localhost

## Copyright
(C) 2021. Belongs to group 16, Java developing - FETEL HCMUS.\
Inspired by MetaMask
