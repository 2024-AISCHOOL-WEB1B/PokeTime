// user.js

console.log("User Info:", window.userInfo);

const handleLogout = () => {
  // logout btn ck
  // console.log("logout btn ck");

  axios.get("/user/logout").then((res) => {
    console.log(res);
    if (res.status === 200) {
      console.log("로그아웃 성공");
      localStorage.clear();
      window.location.href = "/";
    } else {
      alert("로그아웃 실패!");
      console.log(localStorage.getItem("userEmail"));
    }
  });
};

const userEmail = sessionStorage.getItem("userEmail");

// handleGauge
// 게이지에 넣을 값 가져와야 함

const setGaugeValue = (value) => {
  // 값은 0~100
  if (value < 0) value = 0;
  if (value > 100) value = 100;

  const guageContainer = document.querySelector(".bar_gauge");
  // console.log(guageContainer.style);
  guageContainer.style.width = `${value}%`;
};

// userInfo를 사용하여 게이지 값 설정
if (window.userInfo) {
  // 예: userInfo에 attendance 필드가 있다고 가정
  const attendanceValue = window.userInfo.exp || 0;
  setGaugeValue(attendanceValue);
} else {
  setGaugeValue(0);
}

const setMiniGuageValue = (value) => {
  if (value < 0) value = 0;
  if (value > 100) value = 100;

  const miniGuageContainer = document.querySelector(".bar_mini_gauge");
  miniGuageContainer.style.width = `${value}%`;
};

if (window.userInfo) {
  // 예: userInfo에 attendance 필드가 있다고 가정
  const attendanceMiniValue = (window.userInfo.poke_count / 150) * 100;
  setMiniGuageValue(attendanceMiniValue);
} else {
  setMiniGuageValue(0);
}
