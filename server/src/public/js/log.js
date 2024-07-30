/* 사용자가 로그페이지 들어왔을 때 DB에서 포인트 적립 /
 사용 기록을 불러와 div 박스 내에 출력한다. */

//  알림창 팝업, 로그
document.addEventListener("DOMContentLoaded", async () => {
  const logTableBody = document.querySelector("#log_table tbody");

  const res = await axios.get("/point/log");
  res.data.rows.forEach((log) => {
    const row = document.createElement("tr");
    const date = new Date(log.point_log_date);
    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} `;

    row.innerHTML = `
    <td>${formattedDate}</td>
    <td>${log.point_log_name}</td>
    <td>${log.point_log}</td>
    `;
    logTableBody.appendChild(row);
  });
});
