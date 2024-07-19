// login.js

// inputEmail input 변수
let inputEmail = document.querySelector("#login_email");
// inputPassword 변수
let inputPw = document.querySelector("#login_password");

// id값 담기
let resultId = "";
inputEmail.addEventListener("change", (e) => {
  resultId = e.target.value;
  // console.log(resultId)
});

// pw값 담기
let resultPw = "";
inputPw.addEventListener("change", (e) => {
  resultPw = e.target.value;
  // console.log(resultPw)
});

// 로그인 버튼 클릭
const handleLogin = () => {
  console.log("login btn ck");
  // 통신으로 데이터 전송 로직
};
