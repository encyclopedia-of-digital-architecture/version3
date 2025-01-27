// Aşağıdaki örnek JSON verisini kullanacağız
const data = {
  "name": "DIGITAL ARCHITECTURE",
  "children": [
    {
      "name": "DIGITAL FABRICATION",
      "children": [
        {
          "name": "DIGITAL FABRICATION",
          "children": [
            {
              "name": "Making Digital Architecture: Historical, Formal, and Structural Implications of Computer Controlled Fabrication and Expressive Form",
              "value": 1000,
              "keywords": "EXPRESSIVE FORM, DIGITAL VISUALIZATION, DIGITAL FABRICATION, RAPID PROTOTYPING, FIVE-AXIS MILLING",
              "summary": "Digital output from computer modeling represents a significant new method for visualization and fabrication of architecture. The ability to move directly from three-dimensional modeling to real three-dimensional output challenges the need for traditional means of representation such as plan, section, etc. Moreover, the necessity for conversion of architectural intentions into a code (construction documents, shop drawings, etc.) to be translated by the contractor will also be tested with these new potentials in fabrication."
            },
            {
              "name": "Digital Fabrication: Manufacturing Architecture in the Information Age",
              "value": 1000,
              "keywords": "DIGITAL FABRICATION, COMPUTER-AIDED MANUFACTURING, DIGITAL CONSTRUCTION",
              "summary": "This paper addresses the recent digital technological advances in design and fabrication and the unprecedented opportunities they created for architectural design and production practices. It investigates the implications of new digital design and fabrication processes enabled by the use of rapid prototyping (RP) and computer-aided manufacturing (CAM) technologies."
            }
          ]
        }
      ]
    }
  ]
};

// 1. Metin Kümeleme İşlemi (Summary'yi Kategorize Etme)
function categorizeText(summary) {
  const categories = {
    "Conceptual Knowledge": ["method", "design", "architecture", "representation", "visualization"],
    "Procedural Knowledge": ["process", "methodology", "steps", "procedure"],
    "Visual Knowledge": ["visual", "modeling", "digital", "representation"],
    "Configurational Knowledge": ["structure", "form", "construction", "fabrication"]
  };

  // Kategorize edilen verileri saklamak
  let categorized = {
    "Conceptual Knowledge": 0,
    "Procedural Knowledge": 0,
    "Visual Knowledge": 0,
    "Configurational Knowledge": 0
  };

  // Summary'yi inceleyerek uygun kategorilere kelimeleri yerleştiriyoruz
  Object.keys(categories).forEach(category => {
    categories[category].forEach(keyword => {
      if (summary.toLowerCase().includes(keyword.toLowerCase())) {
        categorized[category]++;
      }
    });
  });

  return categorized;
}

// 2. Hiyerarşik Yapıyı Zenginleştirme (Summary'ye Göre Kategoriler Ekleyerek)
function enrichData(data) {
  if (data.summary) {
    const categorized = categorizeText(data.summary);
    data.children = data.children || [];
    Object.keys(categorized).forEach(category => {
      if (categorized[category] > 0) {
        data.children.push({
          "name": category,
          "value": categorized[category] * 100
        });
      }
    });
  }

  // Eğer children varsa, onları da işleyelim
  if (data.children) {
    data.children.forEach(child => {
      enrichData(child);
    });
  }
}

// Veriyi zenginleştiriyoruz
enrichData(data);

// 3. Zoomable Sunburst Diyagramı için D3.js Kodları
const width = window.innerWidth;
const height = window.innerHeight;

// Veriyi işleyerek root node'u oluşturuyoruz
const root = d3.hierarchy(data)
  .sum(d => d.value);

// Sunburst diyagramını oluşturacak çizim fonksiyonu
const partition = d3.partition()
  .size([2 * Math.PI, Math.min(width, height) / 2]);

const arc = d3.arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => d.y0)
  .outerRadius(d => d.y1);

const svg = d3.select("#sunburst")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

partition(root);

// Sunburst diyagramı için path elemanlarını çiziyoruz
svg.selectAll("path")
  .data(root.descendants())
  .enter().append("path")
  .attr("d", arc)
  .style("fill", d => {
    while (d.depth > 1) d = d.parent;
    return d.data.name === "DIGITAL ARCHITECTURE" ? "lightblue" : "lightgreen";
  })
  .on("click", function(event, d) {
    // Zoom in/zoom out işlemleri için yeni bir dönüşüm uygulayabiliriz
    svg.transition()
      .duration(750)
      .tween("scale", () => {
        const xd = d3.interpolate(root.x0, d.x0);
        const yd = d3.interpolate(root.y0, d.y0);
        const yr = d3.interpolate(root.y1, d.y1);
        return t => {
          root.x0 = xd(t);
          root.y0 = yd(t);
          root.y1 = yr(t);
          svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + Math.pow(2, t) + ")");
          svg.selectAll("path").attr("d", arc);
        };
      });
  });
