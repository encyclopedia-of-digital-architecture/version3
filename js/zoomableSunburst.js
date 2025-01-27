function toggleZoomableSunburst() {
    console.log("Zoomable Sunburst fonksiyonu tetiklendi!"); // Test mesajı
    
    const container = document.getElementById('zoomableSunburstContainer');
    
    // Zoomable Sunburst container'ını göster
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block'; // Zoomable Sunburst'ı göster
        loadZoomableSunburstChart();  // Grafik yükle
    } else {
        container.style.display = 'none';  // Gizle
    }
    
    // Diğer iframe'leri gizle
    hideAllIframes();
}

function hideAllIframes() {
    const iframes = document.querySelectorAll('.iframe-container');
    iframes.forEach(iframe => iframe.style.display = 'none');
}

document.querySelectorAll('.overflow-inner1a, .overflow-inner1a2, .overflow-inner1b, .overflow-inner1c, .overflow-inner2a, .overflow-inner2b, .overflow-inner2c')
    .forEach(button => {
        button.addEventListener('click', function () {
            console.log(`${button.innerText} tıklandı`);
            // İlgili işlem buraya yapılabilir (örneğin, `toggleZoomableSunburst` veya başka bir fonksiyon çağrısı)
        });
    });


const fill = "#ccc";
const fillOpacity = 0.6;

function loadZoomableSunburstChart() {
    var zoomableSunburstContainer = document.getElementById('zoomableSunburstContainer');
    console.log(zoomableSunburstContainer.innerHTML);  // Burada SVG'nin doğru şekilde eklendiğinden emin olun
    zoomableSunburstContainer.innerHTML = ''; // Önceki içeriği temizle
    console.log("Loading Zoomable Sunburst Chart...");

    // JSON dosyasını yükle
    fetch("json/json5.json")
        .then(response => response.json()) // JSON verisini al
        .then(data => {
            createChart(data); // Veriyi kullanarak diyagramı oluştur
        })
        .catch(error => {
            console.error("Error loading JSON data:", error); // Hata mesajı
        });
}


// Function to create the zoomable sunburst chart
// Inside the createChart function:
function createChart(json5) {
    const width = window.innerWidth * 1;
    const height = width;
    const radius = width / 6;
    const color = d3.scaleOrdinal()
        .domain(json5.children.map((_, i) => i))
        .range(["#72a4ce", "#0031ae", "#4183bb"]);

    const hierarchy = d3.hierarchy(json5)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    // Create root partition
    const root = d3.partition()
        .size([2 * Math.PI, hierarchy.height + 1])(hierarchy);
    root.each(d => d.current = d);

    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const svg = d3.create("svg")
        .attr("id", "chart-svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("font", "18px Segoe UI")
        .style("width", "100%")
        .style("height", "100%")
        .attr("preserveAspectRatio", "xMidYMid meet");

    const path = svg.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => {
            while (d.depth > 1) d = d.parent;
            return color(d.data.name);
        })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
        .attr("d", d => arc(d.current))
        .on("click", clicked)
        .each(function (d) {
            if (d.depth === 1 && d.data.name.startsWith("Robotic Fabrication")) {
                d3.select(this).classed("highlighted-section", true);
            }
        });

// For zooming in/out when clicking on paths
d3.selectAll('path')
    .on('click', function(event, d) {
        // Handle zoom behavior here
        clicked(event, d);
    });


    path.filter(d => d.children)
        .style("cursor", "pointer");

    const format = d3.format(",d");
    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = svg.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .style("font-size", "25px")
        .style("font-family", "Segoe UI")
        .text(d => d.data.name.length > 20 ? d.data.name.slice(0, 15) + "..." : d.data.name);

    const parent = svg.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    let parentNameLabel = svg.append("text")
        .attr("dy", "0.5em")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .attr("fill-opacity", 1)
        .style("font-size", "24px")
        .style("font-family", "Segoe UI")
        .style("font-weight", "bold")
        .text(root.data.name);

    let currentDepth = 1;

    function clicked(event, p) {
        parent.datum(p.depth === 0 ? null : p.parent || root);
        parentNameLabel.text(p.depth === 0 ? root.data.name : p.data.name);

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        const t = svg.transition().duration(750);

        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")
            .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));

        handleContentDisplay(p.data.name);

        currentDepth = p.depth; // Update the current depth
    }

    document.addEventListener("DOMContentLoaded", function() {
        // initial chart loading
        fetch("json/json5.json")
            .then(response => response.json())
            .then(data => {
                createChart(data);  // Initial chart rendering
            })
            .catch(error => console.error("Error loading JSON data:", error));
    });
    
    

    function handleContentDisplay(name) {
        // Display content based on the clicked item
        const content = document.getElementById('content-display');  // Ensure this container exists in HTML
        content.innerHTML = `<h2>${name}</h2><p>Content for ${name} goes here.</p>`;
    }
    

// Call `goBackOneStep` when you need to go up one level in the hierarchy
function goBackOneStep() {
    if (currentDepth > 1) {
        currentDepth--;
        clicked(null, parent.datum().parent);
    }
}


    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }
    

    function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    document.getElementById('zoomableSunburstContainer').appendChild(svg.node()); 
}

// Fetch data and create the chart
document.addEventListener('DOMContentLoaded', function () {
    fetch("json/json5.json")
        .then(response => response.json())
        .then(json5 => {
            createChart(json5);
        })
        .catch(error => console.error("Error loading JSON data:", error));
});



function handleContentDisplay(name) {
    const content = document.getElementById('content-display');
    content.innerHTML = `<h2>${name}</h2><p>Content for ${name} goes here.</p>`;

    if (name === "Conceptual Knowledge") {
        // Example text for word cloud
        const summary = "This is a sample summary containing words for the word cloud generation, such as fabrication, robotics, architecture, etc.";
        
        // Extract words from the summary
        const words = extractWordsFromSummary(summary);

        // Create word cloud inside iframe
        createWordCloudInIframe(words);
    }
}

function extractWordsFromSummary(summary) {
    // Simple function to extract words from the summary
    return summary.split(/\s+/).filter(word => word.length > 3); // Ignore words shorter than 3 characters
}

function createWordCloudInIframe(words) {
    const iframe = document.getElementById('wordCloudIframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    // Ensure iframe content is loaded before manipulating
    iframeDocument.open();
    iframeDocument.write(`
        <html>
            <head>
                <style>
                    body {
                        font-family: "Segoe UI", sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f7f7f7;
                    }
                    #word-cloud {
                        width: 100%;
                        height: 100%;
                    }
                    text {
                        font-family: "Segoe UI", sans-serif;
                        font-weight: bold;
                        cursor: pointer;
                    }
                </style>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/6.0.0/d3.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.min.js"></script>
            </head>
            <body>
                <div id="word-cloud"></div>
            </body>
        </html>
    `);
    iframeDocument.close();

    // Prepare the data for word cloud
    const wordCount = {};

    // Count occurrences of each word
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const wordCloudData = Object.keys(wordCount).map(word => ({
        text: word,
        size: wordCount[word] * 10  // Scale size based on frequency
    }));

    // Word Cloud creation using d3.js
    const d3 = window.d3;  // Ensure d3 is available inside iframe

    d3.layout.cloud()
        .size([iframe.offsetWidth, iframe.offsetHeight])
        .words(wordCloudData)
        .rotate(0)
        .fontSize(d => d.size)
        .on("end", drawWordCloudInIframe)
        .start();

    function drawWordCloudInIframe(words) {
        const svg = d3.select(iframeDocument.getElementById("word-cloud")).append("svg")
            .attr("width", iframe.offsetWidth)
            .attr("height", iframe.offsetHeight);

        svg.append("g")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("fill", "#72a4ce")
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .text(d => d.text);
    }
}