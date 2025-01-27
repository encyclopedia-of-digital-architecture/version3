document.getElementById('toggle-comments').addEventListener('click', function() {
    var commentSection = document.getElementById('comment-section');
    if (commentSection.classList.contains('d-none')) {
      commentSection.classList.remove('d-none');
    } else {
      commentSection.classList.add('d-none');
    }
  });
  
  document.getElementById('open-chat-btn').addEventListener('click', function() {
    var chatPopup = document.getElementById('chat-popup');
    chatPopup.classList.remove('d-none');
  });
  
  document.getElementById('close-chat-btn').addEventListener('click', function() {
    var chatPopup = document.getElementById('chat-popup');
    chatPopup.classList.add('d-none');
  });
  
  

  
  document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var query = document.getElementById('search-input').value;
    // JSON dosyasını fetch ederek arama yap
    fetch('json/json5.json')
      .then(response => response.json())
      .then(data => {
        // Arama işlemi ve grafiğe yönlendirme mantığını burada yazın
        console.log(data); // JSON verilerini inceleyin
      });
  });
  