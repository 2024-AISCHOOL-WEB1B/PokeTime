document.addEventListener("DOMContentLoaded", async () => {
  const icon = document.querySelector(".bell_icon");
  const overlay = document.querySelector(".overlay");
  const popup = overlay.querySelector(".popup .current_point");
  const point_box = document.getElementById("user_have_point");

  let user_point = 0;

  try {
    const res = await axios.get("/point/search");
    console.log(res.data);
    user_point = res.data.rows[0].user_point;
  } catch (error) {
    console.error("Error fetching user data:", error);
    user_point = 0; // 에러 발생 시 기본값 설정
  }

  if (point_box) {
    point_box.innerHTML = `${user_point}`;
  }

  const showPopup = () => {
    popup.innerHTML = ""; // 기존 내용 초기화
    if (user_point >= 200) {
      popup.innerHTML += `보유포인트: ${user_point}<br>`;
      popup.innerHTML += "<br>❕ 지금 레벨업을 할 수 있어요<br>";
      popup.innerHTML += "<br>❕ 지금 뽑기를 할 수 있어요<br>";
    } else if (user_point >= 100) {
      popup.innerHTML += `보유포인트: ${user_point}<br>`;
      popup.innerHTML += `<br>❕ 지금 레벨업을 할 수 있어요!<br>`;
    } else {
      popup.innerHTML += `보유포인트: ${user_point}<br>`;
      popup.innerHTML += "<br>❗ 지금은 아무것도 할 수 없어요<br>";
    }
    overlay.style.display = "flex";
  };

  const hidePopup = () => {
    overlay.style.display = "none";
    popup.innerHTML = "";
  };

  icon.addEventListener("click", showPopup);
  overlay.addEventListener("click", hidePopup);
});
