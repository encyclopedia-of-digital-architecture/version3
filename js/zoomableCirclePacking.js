document.addEventListener("DOMContentLoaded", function() {
  let svg; // SVG elementini global olarak tanımlıyoruz

  function toggleZoomableCirclePacking() {
    const width = 932;
    const height = width;

    const color = d3.scaleLinear()
      .domain([0, 5])
      .range(["#72a4ce", "#0031ae", "#4183bb"]) // Renk skalası burada tanımlanıyor

    const pack = data => d3.pack()
      .size([width, height])
      .padding(3)
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));

    fetch("./json/json5.json")
      .then(response => response.json())
      .then(data => {
        const root = pack(data);

        // Eski SVG elementini kaldır
        if (svg) {
          svg.remove();
        }

        // Yeni SVG elementini oluştur ve grafiği içine ekle
        svg = d3.create("svg")
          .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
          .attr("width", width)
          .attr("height", height)
          .attr("style", "max-width: 100%; height: auto; display: block; background: white; cursor: pointer; transform: translate(0, -20px);");

        const node = svg.append("g")
          .selectAll("circle")
          .data(root.descendants().slice(1))
          .join("circle")
          .attr("fill", d => d.children ? color(d.depth) : "white")
          .attr("pointer-events", d => !d.children ? "none" : null)
          .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
          .on("mouseout", function() { d3.select(this).attr("stroke", null); })
          .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

        const label = svg.append("g")
          .style("font", "14px Segoe UI")
          .attr("pointer-events", "none")
          .attr("text-anchor", "middle")
          .selectAll("text")
          .data(root.descendants())
          .join("text")
          .style("fill-opacity", d => d.parent === root ? 1 : 0)
          .style("display", d => d.parent === root ? "inline" : "none")
          .text(d => d.data.name);

        svg.on("click", (event) => zoom(event, root));
        let focus = root;
        let view;
        zoomTo([focus.x, focus.y, focus.r * 2]);

        function zoomTo(v) {
          const k = width / v[2];
          view = v;
          label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
          node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
          node.attr("r", d => d.r * k);
        }

        function zoom(event, d) {
          const focus0 = focus;
          focus = d;
          const transition = svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", d => {
              const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
              return t => zoomTo(i(t));
            });

          label
            .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }

        // Grafiği içine ekle
        document.getElementById("zoomableCirclePackingContainer").appendChild(svg.node());
      })
      .catch(error => console.error("Error loading JSON data:", error));
  }

  // Butona tıklanınca grafiği oluştur
  const circlePackingButton = document.querySelector(".overflow-inner1b");
  circlePackingButton.addEventListener("click", toggleZoomableCirclePacking);

  // Tooltip oluştur
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("text-align", "center")
    .style("width", "120px")
    .style("height", "28px")
    .style("padding", "2px")
    .style("font", "12px sans-serif")
    .style("background", "lightsteelblue")
    .style("border", "0px")
    .style("border-radius", "8px")
    .style("pointer-events", "none")
    .style("opacity", 0);
});
