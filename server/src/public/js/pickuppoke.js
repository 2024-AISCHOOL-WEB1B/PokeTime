document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("myModal");
  const modalText = document.getElementById("pickup_result");
  const closeModal = document.getElementsByClassName("close")[0];

  document.getElementById("openPickupModal").onclick = function () {
    document.getElementById("myModal").style.display = "block";
    console.log("modal ck");
    console.log(sessionStorage.getItem("userEmail"));

    axios
      .post("/user/pickuppoke", {
        params: {
          userId: sessionStorage.getItem("userEmail"),
        },
      })
      .then((res) => {
        if (res.data.result === "포인트부족") {
          document.querySelector(".pickup_result_img").src =
            "https://lh4.googleusercontent.com/proxy/FY6RiHaYhHvOw8QwmoA4idP6g7MI2EVSENBoc-OhNIAdiFkSKRn5ONz1pX54byRtXwgsSVQ3AN1y4vAAIOEWni7VEkPaBiExwoeZrO_o";
          document.querySelector("#pk_result > div").textContent =
            "포인트를 더 벌어오세요!";
        } else {
          // console.log(sessionStorage.getItem("userEmail"));
          console.log("res.data: ", res.data);
          // 이미지 URL 업데이트
          document.querySelector(".pickup_result_img").src =
            res.data.pickuppoke.poke_img;

          // 결과 텍스트 업데이트 (필요한 경우)
          document.querySelector("#pk_result > div").textContent =
            res.data.pickuppoke.pickup_result + "(이)가 나왔습니다!";
        }
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
