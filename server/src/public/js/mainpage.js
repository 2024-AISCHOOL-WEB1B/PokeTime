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
