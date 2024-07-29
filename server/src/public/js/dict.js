// 흑백 이미지 경로 배열 생성 (1부터 150까지의 포켓몬 이미지 경로를 포함)
const grayscaleImages = Array.from(
  { length: 150 },
  (_, i) => `../../public/images/grayscale_images(png)/${i + 1}.png`
);

// 전역 변수 선언
let userPokemons = [];
let colorGifs = [];

// 페이지당 항목 수 설정
const itemsPerPage = 12;
// 현재 페이지 번호 설정
let currentPage = 1;

// 데이터를 표시하고 페이지네이션 버튼을 렌더링하는 함수
function render() {
  renderData();
  renderPagination();
}

// 현재 페이지의 데이터를 렌더링하는 함수
function renderData() {
  const dataContainer = document.getElementById("data-container");
  dataContainer.innerHTML = "";

  // 현재 페이지에 해당하는 데이터 범위를 계산
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // start부터 end까지의 포켓몬 이미지를 순회하며 화면에 표시합니다.
  for (let i = start; i < end && i < 150; i++) {
    const img = document.createElement("img");
    const pokemonId = i + 1;

    // 사용자가 해당 포켓몬을 소유하고 있는지 확인합니다.
    if (userPokemons.includes(pokemonId)) {
      // 소유한 포켓몬이면 컬러 GIF를 표시합니다.
      img.src =
        colorGifs.find((gif) => gif.poke_num === pokemonId)?.poke_img ||
        grayscaleImages[i];
      img.classList.add("colorGIF"); // 컬러 GIF에 클래스 부여
    } else {
      // 소유하지 않은 포켓몬이면 흑백 이미지를 표시합니다.
      img.src = grayscaleImages[i];
      img.classList.add("grayPNG"); // 흑백 PNG에 클래스 부여
    }

    // 이미지에 ID와 대체 텍스트를 설정합니다.
    img.id = `${pokemonId}`;
    img.alt = `Pokemon ${pokemonId}`;
    // 이미지 클릭 시 모달을 열도록 이벤트 리스너를 추가합니다.
    img.addEventListener("click", openModal);
    // 생성한 이미지를 컨테이너에 추가합니다.
    dataContainer.appendChild(img);
  }
}

// 페이지네이션 버튼을 렌더링하는 함수
function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // 총 페이지 수 계산
  const totalPages = Math.ceil(grayscaleImages.length / itemsPerPage);

  // 이전 페이지 버튼 생성
  const prevPage = document.createElement("div");
  prevPage.textContent = "<";
  prevPage.classList.add("page-item");
  // 첫 페이지에서는 비활성화
  if (currentPage === 1) {
    prevPage.classList.add("disabled");
  }
  // 클릭 이벤트 추가: 첫 페이지가 아닐 경우 이전 페이지로 이동
  prevPage.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      render();
    }
  });
  pagination.appendChild(prevPage);

  // 다음 페이지 버튼 생성
  const nextPage = document.createElement("div");
  nextPage.textContent = ">";
  nextPage.classList.add("page-item");
  // 마지막 페이지에서는 비활성화
  if (currentPage === totalPages) {
    nextPage.classList.add("disabled");
  }
  // 클릭 이벤트 추가: 마지막 페이지가 아닐 경우 다음 페이지로 이동
  nextPage.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      render();
    }
  });
  pagination.appendChild(nextPage);
}

// 사용자의 포켓몬 정보를 가져오고 이미지를 렌더링하는 함수
function fetchUserPokemonsAndRender() {
  axios
    .get("/dictionary/info", {
      params: {
        userId: sessionStorage.getItem("userEmail"),
      },
    })
    .then((res) => {
      // 유저가 소유한 포켓몬 ID 목록을 저장
      userPokemons = res.data.rows.map((row) => row.poke_num);
      // 컬러 GIF 정보를 저장
      colorGifs = res.data.rows.map((row) => ({
        poke_num: row.poke_num,
        poke_img: row.poke_img,
      }));
      render(); // 데이터를 가져온 후 렌더링 실행
    })
    .catch((error) => {
      console.error("포켓몬 정보를 가져오는 데 실패했습니다:", error);
      render(); // 에러 발생 시에도 렌더링은 실행
    });
}

// 모달창 관련 기능

// 모달창 요소들 선택
const modal = document.getElementById("myModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
const modalButtons = document.getElementById("modalButtons");
const span = document.getElementsByClassName("close")[0];

// 이미지를 클릭했을 때 모달창을 여는 함수
function openModal(event) {
  modal.style.display = "block"; // 모달창을 보이게 설정
  modalImg.src = event.target.src; // 클릭한 이미지의 소스를 모달창 이미지로 설정
  const pokemonId = parseInt(event.target.id);
  if (userPokemons.includes(pokemonId)) {
    captionText.innerText = `포켓몬 #${pokemonId} - 획득한 포켓몬입니다!`;

    const button1 = document.createElement("button");
    button1.innerText = "레벨업";

    const button2 = document.createElement("button");
    button2.innerText = "진화";

    modalButtons.innerHTML = "";
    modalButtons.appendChild(button1);
    modalButtons.appendChild(button2);
  } else {
    captionText.innerText = `포켓몬 #${pokemonId} - 아직 획득하지 못한 포켓몬입니다.`;
    modalButtons.innerHTML = "";
  }
}

// 모달창을 닫는 함수 (닫기 버튼 클릭 시)
span.onclick = function () {
  modal.style.display = "none";
};

// 모달창을 닫는 함수 (모달창 외부 클릭 시)
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// 초기 렌더링 호출
fetchUserPokemonsAndRender();
