// user.js

const { default: axios } = require("axios");
const { response } = require("express");

const handleLogout = () => {
  // logout btn ck
  console.log("logout btn ck");

  axios.post("/user/logout").then((res) => {
    if (response.data.success) {
      console.log(window.history);
      localStorage.clear();
      console.log(localStorage.getItem("userEmail"));
      window.location.href("/main");
    } else {
      alert("로그아웃 실패!");
      console.log(localStorage.getItem("userEmail"));
    }
  });
};
