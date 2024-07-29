/* 사용자가 로그페이지 들어왔을 때 DB에서 포인트 적립 /
 사용 기록을 불러와 div 박스 내에 출력한다. */

//  알림창 팝업, 로그
document.addEventListener('DOMContentLoaded', () => {
    const icon = document.querySelector('.bell_icon');
    const overlay = document.querySelector('.overlay');
    const popup = overlay.querySelector('.popup .current_point');
    const logTableBody = document.querySelector('#log_table tbody')

    // DB에서 불러온 보유포인트: 작동확인용 임시 150점 부여
    const user_point = 0; // 실제 값으로 대체해야 함

    // 작동확인용 임시 데이터, 실제 DB로 연동필요
    const log_data = [
        {date : '2024-07-29', activity : '포인트획득', points : '+10'},
        {date : '2024-07-28', activity : '포인트사용', points : '-100'},
        {date : '2024-07-27', activity : '포인트획득', points : '+5'},
        {date : '2024-07-29', activity : '포인트획득', points : '+10'},
        {date : '2024-07-28', activity : '포인트사용', points : '-100'},
        {date : '2024-07-27', activity : '포인트획득', points : '+5'},
        {date : '2024-07-29', activity : '포인트획득', points : '+10'},
        {date : '2024-07-28', activity : '포인트사용', points : '-100'},
        {date : '2024-07-27', activity : '포인트획득', points : '+5'},
        {date : '2024-07-29', activity : '포인트획득', points : '+10'},
        {date : '2024-07-28', activity : '포인트사용', points : '-100'},
        {date : '2024-07-27', activity : '포인트획득', points : '+5'},
        {date : '2024-07-29', activity : '포인트획득', points : '+10'},
        {date : '2024-07-28', activity : '포인트사용', points : '-100'},
        {date : '2024-07-27', activity : '포인트획득', points : '+5'}
    ];

    log_data.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.date}</td>
            <td>${log.activity}</td>
            <td>${log.points}</td>
        `;
        logTableBody.appendChild(row);
    });

    const showPopup = () => {
        if (user_point >= 200) {
            popup.innerHTML += '보유포인트: {{user.point}}<br>';
            popup.innerHTML += '<br>❕ 지금 레벨업을 할 수 있어요<br>';
            popup.innerHTML += '<br>❕ 지금 뽑기를 할 수 있어요<br>';
        } else if (user_point >= 100) {
            popup.innerHTML += '보유포인트: {{user.point}}<br>';
            popup.innerHTML += `<br>❕ 지금 레벨업을 할 수 있어요!<br>`;
        } else {
            popup.innerHTML += '보유포인트: {{user.point}}<br>';
            popup.innerHTML += '<br>❗ 지금은 아무것도 할 수 없어요<br>';
        }
        overlay.style.display = 'flex';
    };

    const hidePopup = () => {
        overlay.style.display = 'none';
        popup.innerHTML = '';
    };

    icon.addEventListener('click', showPopup);
    overlay.addEventListener('click', hidePopup);
});