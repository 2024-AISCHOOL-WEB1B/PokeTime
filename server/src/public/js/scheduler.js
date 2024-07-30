document.addEventListener("DOMContentLoaded", async () => {
  const calendarTitle = document.getElementById("calendarTitle");
  const calendarBody = document.getElementById("calendarBody");
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modalText");
  const closeModal = document.getElementsByClassName("close")[0];
  const saveTodo = document.getElementById("saveTodo");
  const todoInput = document.getElementById("todoInput");
  const todoList = document.getElementById("todoList");
  const prevMonth = document.getElementById("prevMonth");
  const nextMonth = document.getElementById("nextMonth");

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDate = null;

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
            cell.addEventListener("click", () => {
              selectedDate = `${year}년 ${month + 1}월 ${date}일`;

              modal.style.display = "block";
              todoInput.value = "";
            });
          } else {
            cell.classList.add("disabled");
          }

          if (j === 0) {
            cell.classList.add("sun");
          } else if (j === 6) {
            cell.classList.add("sat");
          }

          row.appendChild(cell);
          date++;
        }
      }
      calendarBody.appendChild(row);
    }
  }

  closeModal.onclick = function () {
    modal.style.display = "none";
    window.location.reload();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      window.location.reload();
    }
  };
  // 일정 조회
  const searchTodo = async () => {
    try {
      const res = await axios.get("/user/searchscheduler");
      console.log(res.data);
      res.data.rows.forEach((todo) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${todo.schedule_name} <button class="deleteBtn">일정취소</button>`;
        todoList.appendChild(listItem);
        listItem
          .querySelector(".deleteBtn")
          .addEventListener("click", async () => {
            try {
              const res = await axios.delete("/user/scheduledelete", {
                data: { schedule_name: todo.schedule_name },
              });
              console.log(res.data);
              if (res.data.result === "삭제성공") {
                todoList.removeChild(listItem);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          });
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // 일정 추가 버튼 클릭 시
  saveTodo.addEventListener("click", async () => {
    const todoText = todoInput.value;
    try {
      const res = await axios.post("/user/scheduler", {
        todo: todoText,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    // 일정 추가

    //   const listItem = document.createElement("li");
    //   listItem.innerHTML = `${todoText} <button class="deleteBtn">일정취소</button>`;
    //   todoList.appendChild(listItem);
    //   modal.style.display = "none";

    // Delete button event listener
    //   listItem
    //     .querySelector(".deleteBtn")
    //     .addEventListener("click", function () {
    //       todoList.removeChild(listItem);
    //     });
  });

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
  searchTodo();
});
