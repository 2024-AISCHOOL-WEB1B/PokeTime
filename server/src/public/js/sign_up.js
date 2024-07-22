// sign_up.js

// nick input
let inputNick = document.querySelector("#nick_name");
// email input
let inputEmail = document.querySelector("#join_email");
// pw input
let inputPw = document.querySelector("#join_password");
let inputPwCk = document.querySelector("#join_password_check");

// email 유효성 검사를 위한 패턴
const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

const handleSingUn = () => {
  console.log("signup btn ck");

  //  이메일 유효성 검사
  const ckNick = document.getElementById("result_login_nick");
  const ckId = document.getElementById("result_login_email");
  const ckPw = document.getElementById("result_login_pw");
  const ckPwCk = document.getElementById("result_login_pwck");

  const userNick = inputNick.value;
  const userEmail = inputEmail.value;
  const userPw = inputPw.value;
  const userPwCk = inputPwCk.value;

  // 값 확인
  console.log("userNick: ", userNick);
  console.log("userEmail: ", userEmail);
  console.log("userPw: ", userPw);
  console.log("userPwCk: ", userPwCk);

  // 닉네임 검사
  if (userNick === "") {
    ckNick.innerHTML = "올바른 형식의 닉네임을 입력하세요";
  }
  // 이메일 유효성 검사
  if (userEmail === "") {
    ckId.innerHTML = "올바른 형식의 이메일을 입력하세요.";
  } else if (pattern.test(userEmail) === false) {
    ckId.innerHTML = "올바른 형식의 이메일을 입력하세요.";
  }

  // 비밀번호 검사
  if (userPw === "") {
    ckPw.innerHTML = "올바른 형식의 비밀번호를 입력하세요.";
  }

  // 비밀번호 확인란 검사
  if (userPw != userPwCk) {
    ckPwCk.innerHTML = "비밀번호가 일치하지 않습니다.";
  }

  // localStorage에 nick, id, pw 값 저장
  localStorage.setItem("userNick", userNick);
  localStorage.setItem("userEmail", userEmail);
  localStorage.setItem("userPw", userPw);
};
