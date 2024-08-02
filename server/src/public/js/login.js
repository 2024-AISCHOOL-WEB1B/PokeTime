// inputEmail input 변수
let inputEmail = document.querySelector("#login_email");
// inputPassword 변수
let inputPw = document.querySelector("#login_password");

// email 유효성 검사를 위한 패턴
const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

// 로그인 버튼 클릭
const handleLogin = async () => {
  console.log("login btn ck");

  const ckId = document.getElementById("result_login_email");
  const ckPw = document.getElementById("result_login_password");
  const userEmail = inputEmail.value;
  const userPw = inputPw.value;

  // 값 확인
  console.log("userEmail: ", userEmail);
  console.log("userPw: ", userPw);

  // 입력 유효성 검사
  let isValid = true;

  if (userEmail === "" || !pattern.test(userEmail)) {
    ckId.innerHTML = "올바른 형식의 이메일을 입력해주세요.";
    isValid = false;
  } else {
    ckId.innerHTML = "";
  }

  if (userPw === "") {
    ckPw.innerHTML = "비밀번호를 입력해주세요.";
    isValid = false;
  } else {
    ckPw.innerHTML = "";
  }

  if (!isValid) {
    return; // 유효성 검사 실패 시 로그인 시도 중단
  }

  // axios 통신
  await axios
    .post(
      'http://54.180.231.199:3000/user/login',
      {
        userEmail,
        userPw,
      }
    )
    .then((res) => {
      console.log(res);
      if (res.data.result == '로그인실패') {
        alert('이메일 또는 비밀번호를 확인하세요.');
      } else if (res.data.result == '로그인성공') {
        console.log('로그인 성공');
        sessionStorage.setItem('userEmail', userEmail);
        const checkinres = axios.post('/point/attend');
        console.log(checkinres.data);
        // 로그인 성공 시 메인 페이지로 리다이렉션
        window.location.href = '/mainpage';
      }
    })
    .catch((error) => {
      console.error('로그인 요청 실패');
    });

    console.log(loginResponse);
    if (loginResponse.data.result === "로그인실패") {
      alert("이메일 또는 비밀번호를 확인하세요.");
    } else if (loginResponse.data.result === "로그인성공") {
      console.log("로그인 성공");
      sessionStorage.setItem("userEmail", userEmail);

      // 로그인 성공 후 자동 출석 체크
      try {
        const attendResponse = await axios.post(
          "http://54.180.231.199:3000/point/attend"
        );
        console.log("출석 체크 결과:", attendResponse.data);

        if (attendResponse.data.result === "출석 성공") {
          alert(
            `출석 완료! ${attendResponse.data.pointsEarned}포인트를 획득하셨습니다. 연속 출석일: ${attendResponse.data.attendanceStreak}일`
          );
        } else if (attendResponse.data.result === "이미 출석하셨습니다.") {
          console.log("이미 오늘 출석을 완료했습니다.");
        }
      } catch (attendError) {
        console.error("출석 체크 실패", attendError);
        // 출석 체크 실패 시 사용자에게 알림을 줄 수 있습니다.
        // alert('출석 체크 중 오류가 발생했습니다.');
      }

      // 로그인 성공 시 메인 페이지로 리다이렉션
      window.location.href = "/mainpage";
    }
  } catch (error) {
    console.error("로그인 요청 실패", error);
    alert("로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
};

// 로그인 버튼에 이벤트 리스너 추가
document.querySelector("#login_button").addEventListener("click", handleLogin);

// 엔터 키 입력 시 로그인 시도
inputPw.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleLogin();
  }
});
