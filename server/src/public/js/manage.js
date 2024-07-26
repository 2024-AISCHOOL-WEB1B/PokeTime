document.addEventListener("DOMContentLoaded", () => {
  const calendarTitle = document.getElementById("calendarTitle");
  const calendarBody = document.getElementById("calendarBody");

  const prevMonth = document.getElementById("prevMonth");
  const nextMonth = document.getElementById("nextMonth");

  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modalText");
  const closeModal = document.getElementsByClassName("close")[0];
  const camera = document.getElementById("left_box");
  const camera_upload = document.getElementById("camera_upload");
  const camera_capture = document.getElementById("camera_capture");
  const file_upload_btn = document.getElementById("file_upload");
  const file_choose = document.getElementById("file_choose");
  const preview = document.getElementById("preview");
  const predict_result = document.getElementById("predict_result");

  let uploadFile = null;
  let stream;

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function renderCalendar(month, year) {
    calendarBody.innerHTML = "";
    const firstDay = new Date(year, month).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();

    calendarTitle.textContent = `${year}년 ${month + 1}월`;

    let date = 1;
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          const cell = document.createElement("td");
          const cellText = document.createTextNode("");
          cell.appendChild(cellText);
          row.appendChild(cell);
        } else if (date > daysInMonth) {
          break;
        } else {
          const cell = document.createElement("td");
          const cellText = document.createTextNode(date);
          cell.appendChild(cellText);

          if (
            date === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
          ) {
            cell.classList.add("today");
          }

          if (j === 0 || j === 6) {
            cell.classList.add("weekend");
          }

          row.appendChild(cell);
          date++;
        }
      }
      calendarBody.appendChild(row);
    }
  }

  prevMonth.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  nextMonth.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  renderCalendar(currentMonth, currentYear);

  if (camera) {
    camera.onclick = function () {
      modal.style.display = "block";
    };
  }

  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // 모달창 내 사진등록 (파일 업로드)

  // 사진파일 올리기 버튼 클릭 시 숨겨진 file_choose input태그를 클릭한다.
  file_upload_btn.addEventListener("click", function () {
    file_choose.click();
  });

  file_choose.addEventListener("change", function (event) {
    const file = event.target.files[0];

    // 카메라 이용 중 파일등록 버튼 클릭 시 카메라 종료 및 카메라 화면영역 삭제
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      camera_preview.innerHTML = "";
  }

    // 업로드 파일 변수에 저장
    uploadFile = file;

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        // 파일 미리보기
        const img = document.createElement("img");

        img.src = e.target.result;
        img.style.maxWidth = "90px";
        img.style.maxHeight = "90px";
        preview.innerHTML = "";
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });

  // 직접찍기 버튼 클릭 시 사용자의 카메라를 실행시킨다.
  camera_upload.addEventListener("click", function () {
    preview.innerHTML = "";
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (mediaStream) {
        stream = mediaStream;
        const video = document.createElement("video");
        video.srcObject = mediaStream;
        video.autoplay = true;
        video.style.maxWidth = "90px";
        video.style.maxHeight = "90px";
        camera_preview.innerHTML = "";
        camera_preview.appendChild(video);

        const captureButton = document.createElement("button");
        captureButton.textContent = "Capture";
        captureButton.addEventListener("click", function () {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const img = document.createElement("img");
          img.src = canvas.toDataURL("image/png");
          img.style.maxWidth = "100px";
          img.style.maxHeight = "100px";
          preview.innerHTML = "";
          preview.appendChild(img);
          stream.getTracks().forEach((track) => track.stop());
          camera_preview.innerHTML = "";

          // 캡처된 이미지를 파일로 저장
          canvas.toBlob(function (blob) {
            uploadFile = new File([blob], "capture_img.png", {
              type: "image/png",
            });
          });
        });
        camera_preview.appendChild(captureButton);
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
  });

  if (!("URL" in window) && "webkitURL" in window) {
    window.URL = window.webkitURL;
  }

  // 서버 전송
  img_submit.addEventListener("click", async () => {
    if (uploadFile) {
      const formData = new FormData();
      formData.append("image", uploadFile);

      try {
        const res = await axios.post(
          "http://localhost:5000/predict",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(res.data);
        if (res.data.confidence > 0.7) {
          try {
            const pointRes = await axios.post(
              "http://localhost:3000/point/picture",
              
            );
            console.log(pointRes.data);
            modalText.textContent = "포인트 10점 획득!";
            predict_result.innerHTML = `예측 결과: ${res.data.top}`;
            modal.style.display = "block";
          } catch (error) {
            console.error("포인트 획득 요청 실패:", error);
            modalText.textContent = "포인트 획득 실패!";
            modal.style.display = "block";
          }
        } else {
          console.log("포인트 획득 실패");
          modalText.textContent = "포인트 획득 실패!";
          predict_result.innerHTML = `예측 결과: 먹을만한 음식이 아닙니다.`;
          modal.style.display = "block";
        }
      } catch (error) {
        console.error("이미지 예측 요청 실패:", error);
        modalText.textContent = "이미지 예측 실패!";
        modal.style.display = "block";
      }
    }
  });
});
