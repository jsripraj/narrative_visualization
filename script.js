const Scene = {
    GASOLINE: "Gasoline",
    DIESEL: "Diesel",
    ELECTRICITY: "Electricity"
}

let scene = Scene.GASOLINE;

const annotations = [{
    note: {
        wrap: 400
    },
    dy: 137,
    dx: 162,
    subject: {
        radiusPadding: 5
    },
    color: "black"
}];

const makeAnnotations = d3.annotation()
    .notePadding(15)
    .type(d3.annotationCalloutCircle)
    .annotations(annotations)

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
    
    d3.select("svg")
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)

    setScene();
}

function setScene() {
    d3.selectAll("circle")
        .attr("class", "unfocused")
        .filter(d => d.Fuel === scene)
        .attr("class", d => d.Fuel)
        .raise()
    
    updateAnnotations();
    d3.select(".annotation-group")
        .call(makeAnnotations)
}

function updateAnnotations() {
    const gasolineLabel = "In 2017, nearly all cars on the road used gasoline engines. Since their invention in the late 19th century, they had evolved to become reliable and widely adopted. These engines combusted air and fuel in cylinders—usually 4, 6, or 8. More cylinders generally meant more power, but also lower fuel efficiency. Typical gasoline cars averaged between 15 and 40 miles per gallon.";
    const dieselLabel = "In 2017, diesel engines powered a smaller share of cars, mostly in trucks and some European vehicles. Invented in the 1890s, diesel engines became known for their fuel efficiency and torque. Like gasoline engines, they used cylinders to combust fuel—but diesel fuel ignites under pressure, without spark plugs. Diesel cars often achieved higher miles per gallon than gasoline ones, sometimes exceeding 40 mpg, but concerns about emissions limited their broader adoption in the U.S.";
    const electricityLabel = "In 2017, electric cars were gaining popularity as a cleaner alternative to gasoline and diesel. Unlike combustion engines, electric motors had no cylinders and operated using electricity stored in batteries. Electric vehicles delivered instant torque and smooth acceleration, with energy efficiency far exceeding traditional engines. While range was limited compared to fuel-powered cars, advances in battery technology were rapidly improving driving distance.";

    const gasolineAnnotation = {
        note: {
            label: gasolineLabel,
            title: "Gasoline",
            wrap: 400
        },
        x: 200,
        y: 200,
        dy: 137,
        dx: 162,
        subject: {
            radius: 50,
            radiusPadding: 5
        },
        color: "#000000"
    }

    const dieselAnnotation = {
        note: {
            label: dieselLabel,
            title: "Diesel",
            wrap: 400
        },
        x: 200,
        y: 200,
        dy: 137,
        dx: 162,
        subject: {
            radius: 50,
            radiusPadding: 5
        },
        color: "#000000"
    }

    const electricityAnnotation = {
        note: {
            label: electricityLabel,
            title: "Electricity",
            wrap: 400
        },
        x: 200,
        y: 200,
        dy: 137,
        dx: 162,
        subject: {
            radius: 50,
            radiusPadding: 5
        },
        color: "#000000"
    }

    let curAnnotation;
    if (scene === Scene.GASOLINE)
        curAnnotation = gasolineAnnotation;
    if (scene === Scene.DIESEL)
        curAnnotation = dieselAnnotation;
    if (scene === Scene.ELECTRICITY)
        curAnnotation = electricityAnnotation;

    annotations[0].note.label = curAnnotation.note.label;
    annotations[0].note.title = curAnnotation.note.title;
    annotations[0].x = curAnnotation.x;
    annotations[0].y = curAnnotation.y;
    annotations[0].subject.radius = curAnnotation.subject.radius;

    makeAnnotations.update();
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