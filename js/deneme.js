// 1. Basit TF-IDF Hesaplama
function calculateTF(words) {
    const tf = {};
    words.forEach(word => {
      tf[word] = (tf[word] || 0) + 1;
    });
    const totalWords = words.length;
    Object.keys(tf).forEach(word => {
      tf[word] = tf[word] / totalWords; // TF = (Kelime sayısı / Toplam kelime sayısı)
    });
    return tf;
  }
  
  function calculateIDF(documents) {
    const idf = {};
    const totalDocs = documents.length;
    
    documents.forEach(doc => {
      const uniqueWords = new Set(doc); // Her belgede tekrarlayan kelimeler çıkarılır
      uniqueWords.forEach(word => {
        idf[word] = (idf[word] || 0) + 1;
      });
    });
    
    // IDF = log(TotalDocs / Kelimenin bulunduğu belge sayısı)
    Object.keys(idf).forEach(word => {
      idf[word] = Math.log(totalDocs / idf[word]);
    });
    
    return idf;
  }
  
  // 2. TF-IDF Hesaplama
  function calculateTFIDF(documents) {
    const tfidf = [];
    const idf = calculateIDF(documents);
  
    documents.forEach(doc => {
      const tf = calculateTF(doc);
      const tfidfDoc = {};
  
      Object.keys(tf).forEach(word => {
        tfidfDoc[word] = tf[word] * (idf[word] || 0); // TF-IDF = TF * IDF
      });
  
      tfidf.push(tfidfDoc);
    });
  
    return tfidf;
  }
  
  // 3. K-means Algoritması
  function kMeans(data, k, maxIterations = 100) {
    // Rasgele başlangıç merkezleri
    const centroids = data.slice(0, k);
  
    let assignments = new Array(data.length).fill(0);
    let iterations = 0;
  
    while (iterations < maxIterations) {
      // Her veri noktası için en yakın merkez belirlenir
      for (let i = 0; i < data.length; i++) {
        let minDist = Infinity;
        let bestCentroid = 0;
  
        for (let j = 0; j < k; j++) {
          const dist = euclideanDistance(data[i], centroids[j]);
          if (dist < minDist) {
            minDist = dist;
            bestCentroid = j;
          }
        }
  
        assignments[i] = bestCentroid;
      }
  
      // Yeni merkezlerin hesaplanması
      const newCentroids = Array.from({ length: k }, () => []);
      for (let i = 0; i < data.length; i++) {
        newCentroids[assignments[i]].push(data[i]);
      }
  
      for (let j = 0; j < k; j++) {
        centroids[j] = averageVector(newCentroids[j]);
      }
  
      iterations++;
    }
  
    return { centroids, assignments };
  }
  
  // 4. Öklid Mesafesi Hesaplama
  function euclideanDistance(vec1, vec2) {
    let sum = 0;
    for (let key in vec1) {
      sum += Math.pow((vec1[key] || 0) - (vec2[key] || 0), 2);
    }
    return Math.sqrt(sum);
  }
  
  // 5. Vektörlerin Ortalamasını Hesaplama
  function averageVector(vectors) {
    const avg = {};
    const vectorCount = vectors.length;
    
    vectors.forEach(vector => {
      Object.keys(vector).forEach(key => {
        avg[key] = (avg[key] || 0) + vector[key];
      });
    });
    
    Object.keys(avg).forEach(key => {
      avg[key] = avg[key] / vectorCount;
    });
  
    return avg;
  }
  
  // 6. Özet Metnindeki Kelimeleri Kategorize Etme
  function categorizeSummary(summary) {
    const words = summary.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    const documents = [words]; // Bu örnek sadece bir belge için çalışıyor, ancak birden fazla belge olabilir
  
    const tfidf = calculateTFIDF(documents);
    
    // K-means ile kümeleri belirle
    const { assignments } = kMeans(tfidf, 3); // Örneğin 3 küme (kategori) ile
  
    // Kelimeleri kümelere yerleştir
    const categorizedData = { cluster1: [], cluster2: [], cluster3: [] };
    words.forEach((word, index) => {
      categorizedData[`cluster${assignments[index] + 1}`].push(word);
    });
  
    return categorizedData;
  }
  
  // 7. Örnek Çalıştırma
  const summary = "Digital output from computer modeling represents a significant new method for visualization and fabrication of architecture.";
  const result = categorizeSummary(summary);
  console.log(result);
  