// login.js

// inputEmail input 변수
let inputEmail = document.querySelector("#login_email");
// inputPassword 변수
let inputPw = document.querySelector("#login_password");

// email 유효성 검사를 위한 패턴
const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

// 로그인 버튼 클릭
const handleLogin = () => {
  console.log("login btn ck");

  // 이메일 유효성 검사

  const ckId = document.getElementById("result_login_email");
  const ckPw = document.getElementById("result_login_password");
  const userEmail = inputEmail.value;
  const userPw = inputPw.value;

  // 값 확인
  console.log("userEmail: ", userEmail);
  console.log("userPw: ", userPw);

  if (userEmail === "") {
    ckId.innerHTML = "올바른 형식의 이메일을 입력해주세요.";
  } else if (pattern.test(userEmail) === false) {
    ckId.innerHTML = "올바른 형식의 이메일을 입력해주세요.";
  }

  if (userPw === "") {
    ckPw.innerHTML = "올바른 형식의 비밀번호를 입력해주세요.";
  }

  // localStorage에 id, pw 키값 저장
  localStorage.setItem("userEmail", userEmail);
  localStorage.setItem("userPw", userPw);

  // axios 통신
  axios
    .post("http://localhost:3000/user/login", {
      userEmail,
      userPw,
    })
    .then((res) => {
      console.log(res);
      if (res.data.result == "로그인실패") {
        alert("이메일 또는 비밀번호를 확인하세요.");
      } else if (res.data.result == "로그인성공") {
        console.log("로그인 성공");
        sessionStorage.setItem("userEmail", userEmail);
        // 로그인 성공 시 메인 페이지로 리다이렉션
        window.location.href = "/mainpage";
      }
    })
    .catch((error) => {
      console.error("로그인 요청 실패", error);
    });
};
