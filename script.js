async function init() {
const data = await d3.csv('https://flunky.github.io/cars2017.csv');
const x = d3.scaleLog([10,150], [0, 200]);
const y = d3.scaleLog([10, 150], [200, 0]);

d3.select("svg")
  .append("g")
    .attr("transform", "translate(49,50)")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(parseInt(d.AverageCityMPG)))
      .attr("cy", d => y(parseInt(d.AverageHighwayMPG)))
      .attr("r", d => 1 + parseInt(d.EngineCylinders))
      .attr("fill", d => {
        if (d.Fuel === "Gasoline") {
          return "red";
        }
        if (d.Fuel === "Diesel") {
          return "green";
        }
        else { // Electricity
          return "blue";
        }
      });

d3.select("svg")
  .append("g")
    .attr("transform", "translate(49,50)")
    .call(d3.axisLeft(y)
      .tickValues([9, 20, 50, 100])
      .tickFormat(d3.format("~s"))
    );

d3.select("svg")
  .append("g")
    .attr("transform", "translate(49,250)")
    .call(d3.axisBottom(x)
      .tickValues([9, 20, 50, 100])
      .tickFormat(d3.format("~s"))
    );

}