document.getElementById('searchBar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
  
  document.getElementById('searchButton').addEventListener('click', performSearch);
  
  function performSearch() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    fetch('path/to/your/jsonfile.json')
      .then(response => response.json())
      .then(data => {
        // JSON dosyasındaki verileri kontrol et
        let found = false;
        data.forEach(item => {
          if (item.name.toLowerCase().includes(query)) {
            // İstenen grafiğe erişim sağla
            console.log('Match found:', item);
            // Burada grafiği gösterme işlevini çağırabilirsiniz.
            // Örneğin:
            // showGraph(item);
            found = true;
          }
        });
        if (!found) {
          console.log('No match found');
        }
      })
      .catch(error => console.error('Error:', error));
  }
  
  function showGraph(item) {
    // Grafiği göstermek için gerekli işlevi burada tanımlayın
    console.log('Displaying graph for:', item);
  }
  