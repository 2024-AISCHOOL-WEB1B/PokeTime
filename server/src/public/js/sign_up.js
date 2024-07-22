// sign_up.js

// import axios from "axios";

// nick input
let inputNick = document.querySelector("#nick_name");
// email input
let inputEmail = document.querySelector("#join_email");
// pw input
let inputPw = document.querySelector("#join_password");
let inputPwCk = document.querySelector("#join_password_check");

// email 유효성 검사를 위한 패턴
const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

const handleSignUp = () => {
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

  // axios 통신
  axios
    .post(
      "http://localhost:3000/user/join",
      {
        email: userEmail,
        pw: userPw,
        nick: userNick,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    // 서버 => 클라이언트 : response로 {ok:ture} or {ok: false}
    .then((res) => {
      console.log(res.data);
      if (res.data.result == "가입성공") {
        window.alert("회원가입이 완료되었습니다.");
        window.location.href = "./login";
      } else {
        window.alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
      }
    })
    .catch((error) => {
      window.alert("회원가입에 실패했습니다. 관리자에게 문의하세요");
      console.error(error);
    });
};
