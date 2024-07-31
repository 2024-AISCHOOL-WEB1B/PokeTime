// const { default: axios } = require("axios");

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
  const dataContainer = document.getElementById('data-container');
  dataContainer.innerHTML = '';

  // 현재 페이지에 해당하는 데이터 범위를 계산
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  // start부터 end까지의 포켓몬 이미지를 순회하며 화면에 표시합니다.
  for (let i = start; i < end && i < 150; i++) {
    const img = document.createElement('img');
    const pokemonId = i + 1;

    // 사용자가 해당 포켓몬을 소유하고 있는지 확인합니다.
    if (userPokemons.includes(pokemonId)) {
      // 소유한 포켓몬이면 컬러 GIF를 표시합니다.
      img.src =
        colorGifs.find((gif) => gif.poke_num === pokemonId)?.poke_img ||
        grayscaleImages[i];
      img.classList.add('colorGIF'); // 컬러 GIF에 클래스 부여
    } else {
      // 소유하지 않은 포켓몬이면 흑백 이미지를 표시합니다.
      img.src = grayscaleImages[i];
      img.classList.add('grayPNG'); // 흑백 PNG에 클래스 부여
    }

    // 이미지에 ID와 대체 텍스트를 설정합니다.
    img.id = `${pokemonId}`;
    img.alt = `Pokemon ${pokemonId}`;
    // 이미지 클릭 시 모달을 열도록 이벤트 리스너를 추가합니다.
    img.addEventListener('click', openModal);
    // 생성한 이미지를 컨테이너에 추가합니다.
    dataContainer.appendChild(img);
  }
}

// 페이지네이션 버튼을 렌더링하는 함수
function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  // 총 페이지 수 계산
  const totalPages = Math.ceil(grayscaleImages.length / itemsPerPage);

  // 이전 페이지 버튼 생성
  const prevPage = document.createElement('div');
  prevPage.textContent = '<';
  prevPage.classList.add('page-item');
  // 첫 페이지에서는 비활성화
  if (currentPage === 1) {
    prevPage.classList.add('disabled');
  }
  // 클릭 이벤트 추가: 첫 페이지가 아닐 경우 이전 페이지로 이동
  prevPage.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      render();
    }
  });
  pagination.appendChild(prevPage);

  // 다음 페이지 버튼 생성
  const nextPage = document.createElement('div');
  nextPage.textContent = '>';
  nextPage.classList.add('page-item');
  // 마지막 페이지에서는 비활성화
  if (currentPage === totalPages) {
    nextPage.classList.add('disabled');
  }
  // 클릭 이벤트 추가: 마지막 페이지가 아닐 경우 다음 페이지로 이동
  nextPage.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      render();
    }
  });
  pagination.appendChild(nextPage);
}

// 사용자의 포켓몬 정보를 가져오고 이미지를 렌더링하는 함수
async function fetchUserPokemonsAndRender() {
  try {
    const res = await axios.get('/dictionary/info', {
      params: {
        userId: sessionStorage.getItem('userEmail'),
      },
    });
    // 유저가 소유한 포켓몬 ID 목록을 저장
    console.log(res.data.rows);
    userPokemons = res.data.rows.map((row) => row.poke_num);
    // 컬러 GIF 정보를 저장
    colorGifs = res.data.rows.map((row) => ({
      poke_num: row.poke_num,
      evol_poke_name: row.poke_evol,
      poke_img: row.poke_img,
      poke_lv: row.user_poke_lv,
      poke_name: row.poke_name,
      poke_type: row.poke_type,
    }));
    render(); // 데이터를 가져온 후 렌더링 실행
  } catch (error) {
    console.error('포켓몬 정보를 가져오는 데 실패했습니다:', error);
    render(); // 에러 발생 시에도 렌더링은 실행
  }
}

// 모달창 관련 기능

// 모달창 요소들 선택
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('modalImage');
const captionText = document.getElementById('caption');
const modalButtons = document.getElementById('modalButtons');
const span = document.getElementsByClassName('close')[0];

// 이미지를 클릭했을 때 모달창을 여는 함수
function openModal(event) {
  modal.style.display = 'block'; // 모달창을 보이게 설정
  modalImg.src = event.target.src; // 클릭한 이미지의 소스를 모달창 이미지로 설정
  const pokemonId = parseInt(event.target.id);
  let button1, button2, button3;
  if (userPokemons.includes(pokemonId)) {
    const selectedPokemon = colorGifs.find((gif) => gif.poke_num === pokemonId);
    if (selectedPokemon.poke_lv <= 3) {
      captionText.innerHTML = `<br> 도감번호 : #${pokemonId} <br><br> 이름 : ${selectedPokemon.poke_name} <br> 속성 : ${selectedPokemon.poke_type} <br> <br> 현재 레벨: ${selectedPokemon.poke_lv}`;
    } else if (selectedPokemon.poke_lv == 4) {
      captionText.innerHTML = `<br> 도감번호 : #${pokemonId} <br><br> 이름 : ${selectedPokemon.poke_name} <br> 속성 : ${selectedPokemon.poke_type} <br> <br> 최고 레벨 입니다.`;
    }
    const poke_lv = colorGifs.find((gif) => gif.poke_num === pokemonId).poke_lv;
    if (poke_lv < 3) {
      button1 = document.createElement('button');
      button1.innerText = '레벨업';
      button1.classList.add('modal-btn');
    } else {
      button1 = document.createElement('button');
      button1.innerText = '성장불가능';
      button1.classList.add('neg-modal-btn');
    }

    button2 = document.createElement('button');
    button2.innerText = '진화';
    button2.classList.add('modal-btn');
    button2.disabled = false;

    button3 = document.createElement('button');
    button3.innerHTML = '대표<br>포켓몬설정';
    button3.classList.add('modal-btn');

    modalButtons.innerHTML = '';
    modalButtons.appendChild(button1);
    // 버튼에 클릭이벤트 달기
    if (button1.innerText === '레벨업') {
      button1.addEventListener('click', async () => {
        const img = modalImg.src;

        try {
          const res = await axios.post('/dictionary/levelup', {
            img: img,
          });
          // res.data
          // result : "레벨업 성공", newLevel : 레벨업 후 레벨
          console.log(res.data);
          if (res.data.result === '레벨업 성공') {
            captionText.innerHTML = `<br> 도감번호 : #${pokemonId} <br><br> 이름 : ${selectedPokemon.poke_name} <br> 속성 : ${selectedPokemon.poke_type} <br> <br> 현재 레벨: ${res.data.newLevel}`;
            if (res.data.newLevel == 3) {
              button1.innerText = '성장불가능';
              button1.classList.add('neg-modal-btn');
              button1.disabled = true;
              button2.innerText = '진화';
              button2.classList.add('modal-btn');
              button2.disabled = false;
            }
          }
          if (res.data.result === '포인트가 부족합니다') {
            captionText.innerHTML = '<br><br><br>포인트가 부족합니다';
          }
        } catch (error) {
          console.error('레벨업에 실패했습니다:', error);
        }
      });
    } else {
      button1.disabled = true;
    }
    modalButtons.appendChild(button2);
    if (button2.innerText === '진화') {
      button2.addEventListener('click', async () => {
        const img = modalImg.src;
        const evol_poke_name = colorGifs.find(
          (gif) => gif.poke_img === img
        ).evol_poke_name;
        try {
          const res = await axios.get('/dictionary/evolution', {
            params: {
              name: evol_poke_name,
              img: img,
            },
          });
          // res.data
          // result : "진화 성공", img : 진화 후 이미지, type : 진화 후 타입, name : 진화 후 이름
          console.log(res.data);
          if (res.data.result === '진화성공') {
            modalImg.src = res.data.rows.img;
            captionText.innerHTML = `${
              res.data.rows.name
            } 진화성공! <br><br> 도감번호 : #${pokemonId + 1} <br><br> 속성 : ${
              res.data.rows.type
            } <br> <br> 현재 레벨: 1`;
            button1.style.display = 'none';
            button2.style.display = 'none';
            button3.style.display = 'none';
          }
        } catch (error) {
          console.error('진화에 실패했습니다:', error);
        }
      });
    } else {
      button2.disabled = true;
    }

    modalButtons.appendChild(button3);
    button3.addEventListener('click', async () => {
      const pokenum = pokemonId;
      try {
        const res = await axios.post('/dictionary/mainpoke', {
          pokenum: pokenum,
        });
        // res.data
        // result : "대표포켓몬설정 성공"
        console.log(res.data);
        if (res.data.result === '대표포켓몬설정 성공') {
          fetchUserPokemonsAndRender();
        }
      } catch (error) {
        console.error('대표포켓몬설정에 실패했습니다:', error);
      }
    });
  } else {
    captionText.innerHTML = `<br><br>도감번호 : #${pokemonId}<br><br>아직 획득하지 못한 포켓몬입니다.`;
    modalButtons.innerHTML = '';
  }
}

// 검색 기능 추가
document.getElementById('search_btn').addEventListener('click', (event) => {
  event.preventDefault(); // 페이지 새로고침 방지
  const searchTerm = document.getElementById('search_name').value;
  const foundPokemon = colorGifs.find((gif) =>
    gif.poke_name.includes(searchTerm)
  );
  if (foundPokemon) {
    openSearchModal(foundPokemon);
  } else {
    alert('검색된 포켓몬이 없습니다.');
  }
});

function openSearchModal(pokemon) {
  // 기존 모달창을 여는 이벤트를 제거
  modal.style.display = 'block';
  modalImg.src = pokemon.poke_img;
  if (pokemon.poke_lv <= 3) {
    captionText.innerHTML = `<br> 도감번호 : #${pokemon.poke_num} <br><br> 이름 : ${pokemon.poke_name} <br> 속성 : ${pokemon.poke_type} <br> <br> 현재 레벨: ${pokemon.poke_lv}`;
  } else if (pokemon.poke_lv == 4) {
    captionText.innerHTML = `<br> 도감번호 : #${pokemon.poke_num} <br><br> 이름 : ${pokemon.poke_name} <br> 속성 : ${pokemon.poke_type} <br> <br> 최고 레벨 입니다..`;
  }
  modalButtons.innerHTML = ''; // 필요한 버튼 설정을 여기에 추가할 수 있음

  let button1, button2, button3;
  const selectedPokemon = colorGifs.find(
    (gif) => gif.poke_num === pokemon.poke_num
  );
  const poke_lv = selectedPokemon.poke_lv;

  // 버튼 추가 부분 (openModal과 동일하게 적용)
  if (poke_lv < 3) {
    button1 = document.createElement('button');
    button1.innerText = '레벨업';
    button1.classList.add('modal-btn');
  } else {
    button1 = document.createElement('button');
    button1.innerText = '성장불가능';
    button1.classList.add('neg-modal-btn');
  }
  if (poke_lv == 3) {
    button2 = document.createElement('button');
    button2.innerText = '진화';
    button2.classList.add('modal-btn');
  } else {
    button2 = document.createElement('button');
    button2.innerText = '성장불가능';
    button2.classList.add('neg-modal-btn');
  }

  button3 = document.createElement('button');
  button3.innerHTML = '대표<br>포켓몬설정';
  button3.classList.add('modal-btn');

  modalButtons.appendChild(button1);
  if (button1.innerText === '레벨업') {
    button1.addEventListener('click', async () => {
      const img = modalImg.src;

      try {
        const res = await axios.post('/dictionary/levelup', {
          img: img,
        });
        // res.data
        // result : "레벨업 성공", newLevel : 레벨업 후 레벨
        if (res.data.result === '레벨업 성공') {
          const levelres = await axios.get('/dictionary/info');
        }
      } catch (error) {
        console.error('레벨업에 실패했습니다:', error);
      }
    });
  } else {
    button1.disabled = true;
  }
  modalButtons.appendChild(button2);
  if (button2.innerText === '진화') {
    button2.addEventListener('click', async () => {
      const img = modalImg.src;
      const evol_poke_name = colorGifs.find(
        (gif) => gif.poke_img === img
      ).evol_poke_name;
      try {
        const res = await axios.get('/dictionary/evolution', {
          params: {
            name: evol_poke_name,
            img: img,
          },
        });
        // res.data
        // result : "진화 성공", img : 진화 후 이미지, type : 진화 후 타입, name : 진화 후 이름
        if (res.data.result === '진화 성공') {
        }
      } catch (error) {
        console.error('진화에 실패했습니다:', error);
      }
    });
  } else {
    button2.disabled = true;
  }

  modalButtons.appendChild(button3);
  button3.addEventListener('click', async () => {
    const pokenum = pokemon.poke_num;
    try {
      const res = await axios.post('/dictionary/mainpoke', {
        pokenum: pokenum,
      });
      // res.data
      // result : "대표포켓몬설정 성공"
      console.log(res.data);
      if (res.data.result === '대표포켓몬설정 성공') {
        fetchUserPokemonsAndRender();
      }
    } catch (error) {
      console.error('대표포켓몬설정에 실패했습니다:', error);
    }
  });

  // 검색 모달을 위한 닫기 이벤트 추가
  span.onclick = function () {
    modal.style.display = 'none';
  };
}

// 모달창을 닫는 함수 (모달창 외부 클릭 시)
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
    window.location.reload();
  }
};

// 모달창을 닫는 함수 (닫기 버튼 클릭 시)
span.onclick = function () {
  modal.style.display = 'none';
  window.location.reload();
};

// 초기 렌더링 호출
fetchUserPokemonsAndRender();
