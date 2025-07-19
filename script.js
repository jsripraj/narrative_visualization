const Scene = {
    GASOLINE: "Gasoline",
    DIESEL: "Diesel",
    ELECTRICITY: "Electricity"
}

let scene = Scene.GASOLINE;

function moveScene(dir) {
    const fwd = dir === "right";
    if (scene === Scene.GASOLINE)
        scene = fwd ? Scene.DIESEL : Scene.ELECTRICITY;
    else if (scene === Scene.DIESEL)
        scene = fwd ? Scene.ELECTRICITY : Scene.GASOLINE;
    else if (scene === Scene.ELECTRICITY)
        scene = fwd ? Scene.GASOLINE : Scene.DIESEL;
}

async function init() {
    data = await d3.csv('https://flunky.github.io/cars2017.csv');
    const x = d3.scaleLog([10, 150], [0, 500]);
    const y = d3.scaleLog([10, 150], [500, 0]);

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(50,50)")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(parseInt(d.AverageCityMPG)))
        .attr("cy", d => y(parseInt(d.AverageHighwayMPG)))
        .attr("r", d => 3 + parseInt(d.EngineCylinders))

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(50,50)")
        .call(d3.axisLeft(y)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"))
        );

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(50,550)")
        .call(d3.axisBottom(x)
            .tickValues([10, 20, 50, 100])
            .tickFormat(d3.format("~s"))
        );

    setScene();
}

function setScene() {
    d3.selectAll("circle")
        .attr("class", "unfocused")
        .filter(d => d.Fuel === scene)
        .attr("class", d => d.Fuel)
        .raise()
}

const left = document.getElementById("left");
const right = document.getElementById("right");

left.addEventListener("click", (event) => {
    moveScene("left");
    setScene();
});

right.addEventListener("click", (event) => {
    moveScene("right");
    setScene();
});