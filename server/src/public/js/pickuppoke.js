document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('myModal');
    const modalText = document.getElementById('pickup_result');
    const closeModal = document.getElementsByClassName('close')[0];

    document.getElementById('openPickupModal').onclick = function(){
        document.getElementById('myModal').style.display = 'block'
      };


    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
})