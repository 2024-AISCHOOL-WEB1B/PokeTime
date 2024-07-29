document.addEventListener('DOMContentLoaded', () => {
    const icon = document.querySelector('.bell_icon');
    const overlay = document.querySelector('.overlay');
    const popup = overlay.querySelector('.popup .current_point');

    // DB에서 불러온 보유포인트: 작동확인용 임시 150점 부여
    const user_point = 150; // 실제 값으로 대체해야 함

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