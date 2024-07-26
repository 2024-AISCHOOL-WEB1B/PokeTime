// user.js

// import axios from "axios ";

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

// handleGauge

const setGaugeValue = (value) => {
  // 값은 0~100
  if (value < 0) value = 0;
  if (value > 100) value = 100;

  const guageContainer = document.querySelector(".bar_gauge");
  console.log(guageContainer.style);
  guageContainer.style.width = `${value}%`;
};
setGaugeValue(75);
