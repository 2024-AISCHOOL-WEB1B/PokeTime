// sign_up.js

// nick input
let inputNick = document.querySelector("#nick_name");

let resultNick;

inputNick.addEventListener("change", (e) => {
  resultNick = e.target.value;
  console.log("inputNick:", resultNick);
});

// email input
let inputEmail = document.querySelector("#join_email");

let resultEmail;

inputEmail.addEventListener("change", (e) => {
  resultEmail = e.target.value;
  console.log("inputEmail: ", resultEmail);
});

// pw input
let inputPw = document.querySelector("#join_password");

let resultPw;

inputPw.addEventListener("change", (e) => {
  resultPw = e.target.value;
  console.log("inputPw: ", resultPw);
});

// pw ck input
let inputPwCk = document.querySelector("#join_password_check");

let reusltPwCk;

inputPwCk.addEventListener("change", (e) => {
  resultPwCk = e.target.value;
  console.log("inputPwCk: ", resultPwCk);
});

// sign up btn handler
const handleSingupBtn = () => {
  console.log("sign up btn ck");
  // 아래로 버튼 클릭 로직 설계
};
