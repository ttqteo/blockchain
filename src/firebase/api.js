const user = {
  name: "Account 1",
  publicKey: "6VDRa5Q9Jt1uhWAxL417oE79ikXhwM6gDg",
  assets: {
    ETH: 2,
    BNB: 3,
  },
};

export { user };

// Tab "Tài sản"
// Mỗi asset cần có thông tin:
// - Loại Token
// - Số lượng Token
// - Logo

// Tab "Hoạt động":
// Mỗi hoạt động cần có
// - type:
// + buy : mua
// + swap : đổi
// + send : gửi
// + receive: nhận
// - wallet : ví (từ gửi-nhận)
// - token1 : đồng chính
// - value : giá trị token 1
// - token2 : khả dụng khi swap (đồng đích)
// - date: ngày - giờ
