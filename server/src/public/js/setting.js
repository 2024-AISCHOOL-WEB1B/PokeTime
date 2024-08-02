document.addEventListener("DOMContentLoaded", () => {
  const btn_change = document.getElementById("btn_change");
  const btn_out = document.getElementById("btn_out");

  btn_change.addEventListener("click", async () => {
    const nick = document.getElementById("nick_name").value;
    const pw = document.getElementById("join_password").value;
    const pw_chk = document.getElementById("join_password_check").value;

    if (pw === pw_chk) {
      try {
        const res = await axios.post("/user/update", {
          nick: nick,
          pw: pw,
        });
        console.log(res.data);
      } catch (error) {
        console.error("회원정보 수정 중 오류 발생:", error);
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  });

  btn_out.addEventListener("click", async () => {
    const pw = document.getElementById("join_password").value;
    const pw_chk = document.getElementById("join_password_check").value;
    if (pw === pw_chk) {
      try {
        const res = await axios.post("/user/delete", {
          pw: pw,
        });
        console.log(res.data);
      } catch (error) {
        console.error("회원탈퇴 중 오류 발생:", error);
      }
    }
  });
});
