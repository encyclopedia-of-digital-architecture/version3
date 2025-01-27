
document.getElementById("iframe-container-ris-to-json").classList.remove("hidden");


document.addEventListener("DOMContentLoaded", function() {
  const sunburstButton = document.getElementById("toggleButton-1a");
  const circlePackingButton = document.getElementById("toggleButton-1b");
  const sequencesSunburstButton = document.getElementById("toggleButton-1c");

  const sunburstChart = document.getElementById("zoomableSunburstContainer");
  const circlePackingChart = document.getElementById("zoomableCirclePackingContainer");
  const sequencesSunburstChart = document.getElementById("sequencesSunburstContainer");
  const otherContent = document.getElementById("otherContent");

  sunburstButton.addEventListener("click", function() {
    toggleZoomableSunburst();
    handleContentDisplay('configurational knowledge'); // Düğüme tıklandığında ilgili içeriği göstermek için
});

circlePackingButton.addEventListener("click", function() {
    toggleZoomableCirclePacking();
    handleContentDisplay('configurational knowledge'); // Düğüme tıklandığında ilgili içeriği göstermek için
});

sequencesSunburstButton.addEventListener("click", function() {
    toggleZoomableSunburstSequences();
    handleContentDisplay('configurational knowledge'); // Düğüme tıklandığında ilgili içeriği göstermek için
});


  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }

  // Butonlardan aktif durumu kaldır
  function removeActiveClasses() {
    sunburstButton.classList.remove("active");
    circlePackingButton.classList.remove("active");
    sequencesSunburstButton.classList.remove("active");
  }

  // Butona tıklanınca aktif durumu kaldır ve grafiği oluştur
  function toggleZoomableSunburst() {
    // Tüm butonlardan aktif durumu kaldır
    removeActiveClasses();

    // Sadece sunburstButton'a aktif durumu ekle
    sunburstButton.classList.add("active");

    // Görselleri ayarla
    sunburstChart.style.display = "block";
    circlePackingChart.style.display = "none";
    sequencesSunburstChart.style.display = "none";
    otherContent.style.display = "none";

    // Sunburst grafiğini yükle
    loadScript("zoomableSunburst.js");
  }

  // Butona tıklanınca aktif durumu kaldır ve grafiği oluştur
  function toggleZoomableCirclePacking() {
    // Tüm butonlardan aktif durumu kaldır
    removeActiveClasses();

    // Sadece circlePackingButton'a aktif durumu ekle
    circlePackingButton.classList.add("active");

    // Görselleri ayarla
    circlePackingChart.style.display = "block";
    sunburstChart.style.display = "none";
    sequencesSunburstChart.style.display = "none";
    otherContent.style.display = "none";

    // Circle Packing grafiğini yükle
    loadScript("zoomableCirclePacking.js");
  }

  // Butona tıklanınca aktif durumu kaldır ve grafiği oluştur
  function toggleZoomableSunburstSequences() {
    // Tüm butonlardan aktif durumu kaldır
    removeActiveClasses();

    // Sadece sequencesSunburstButton'a aktif durumu ekle
    sequencesSunburstButton.classList.add("active");

    // Görselleri ayarla
    sequencesSunburstChart.style.display = "block";
    sunburstChart.style.display = "none";
    circlePackingChart.style.display = "none";
    otherContent.style.display = "none";

    // Sunburst Sequences grafiğini yükle
    loadScript("zoomableSunburstSequences.js");
  }

  sunburstButton.addEventListener("click", function() {
    toggleZoomableSunburst();
  });

  circlePackingButton.addEventListener("click", function() {
    toggleZoomableCirclePacking();
  });

  sequencesSunburstButton.addEventListener("click", function() {
    toggleZoomableSunburstSequences();
  });

  // Function to load iframe content
  function loadObservableHQChart() {
    const iframe = document.getElementById("conceptualKnowledgeFrame");
    iframe.src = "https://observablehq.com/";
    document.getElementById("iframe-container").classList.remove('d-none');
  }

  // Example usage based on your condition
  const nodeName = "Conceptual Knowledge"; // Example condition

  if (nodeName === "Conceptual Knowledge") {
    loadObservableHQChart(); // Load the content inside iframe
  }
});


function handleContentDisplay(nodeName) {
  // Tüm içerikleri gizle
  sunburstChart.style.display = "none";
  circlePackingChart.style.display = "none";
  sequencesSunburstChart.style.display = "none";
  otherContent.style.display = "none";

  // İstenilen düğüme göre içeriği göster
  if (nodeName === "configurational knowledge") {
  
document.getElementById("configurationalknowledge-img").style.display = "block";

  }
}


