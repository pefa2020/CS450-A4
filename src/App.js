import React, { Component } from "react";
import "./App.css";
import FileUpload from "./FileUpload";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected_data: [],
      sentimentColors: {
        positive: "green",
        negative: "red",
        neutral: "gray",
      }
    };
  }

  componentDidMount() {
    this.renderChart()
  }

  componentDidUpdate() {
    this.renderChart()
  }

  set_data = (csv_data) => {
    this.setState({ data: csv_data });
  }

  renderChart = () => {
    var margin = {
      left: 50,
      right: 50,
      top: 10,
      bottom: 10,
    }, width = 500, height = 300;

    var innerWidth = width - margin.left - margin.right
    var innerHeight = height - margin.top - margin.bottom


    var svg = d3.select("svg")
      .attr("width", width)
      .attr("height", height)

    var g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var data = this.state.data
    console.log(data)

    var all_dimension_1 = data.map(d => d["Dimension 1"]) // an array
    var all_dimension_2 = data.map(d => d["Dimension 2"]) // an array
    console.log("All dimension 1: ", all_dimension_1)

    // Scale for both x and y
    const x_scale = d3.scaleLinear()
      .domain(d3.extent(all_dimension_1))
      .range([0, innerWidth])

    const y_scale = d3.scaleLinear()
      .domain(d3.extent(all_dimension_2))
      .range([0, innerHeight])

    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => x_scale(d["Dimension 1"]))
      .attr("cy", d => y_scale(d["Dimension 2"]))
      .attr("r", 4)
      .attr('fill', d => this.state.sentimentColors[d.PredictedSentiment])

    var brush = d3.brush().on('start brush end', (e) => {
      if (!e.selection) return; // Check if selection is defined

      var filtered_data = data.filter(item => {
        return (
          x_scale(item["Dimension 1"]) >= e.selection[0][0] &&
          x_scale(item["Dimension 1"]) <= e.selection[1][0] &&
          y_scale(item["Dimension 2"]) >= e.selection[0][1] &&
          y_scale(item["Dimension 2"]) <= e.selection[1][1]
        )

      });
      this.setState({ selected_data: filtered_data })

    })

    d3.select('g').call(brush);

    var my_svg = d3.select(".my_svg")
    .attr("width", width)
    .attr("height", height)

    if (this.state.data.length > 0) {

      my_svg.append("circle").attr("cx", 30).attr("cy", 10).attr("r", 6)
        .style("fill", "green")
      my_svg.append("text").attr("x", 50).attr("y", 10).text("positive")
        .style("font-size", "15px").attr("alignment-baseline", "middle")

      my_svg.append("circle").attr("cx", 30).attr("cy", 40).attr("r", 6)
        .style("fill", "red")
      my_svg.append("text").attr("x", 50).attr("y", 40).text("negative")
        .style("font-size", "15px").attr("alignment-baseline", "middle")

      my_svg.append("circle").attr("cx", 30).attr("cy", 70).attr("r", 6)
        .style("fill", "gray")
      my_svg.append("text").attr("x", 50).attr("y", 70).text("neutral")
        .style("font-size", "15px").attr("alignment-baseline", "middle")
    }


  }

  render() {
    return (
      <div>
        <FileUpload set_data={this.set_data}></FileUpload>
        <div className="parent">
          <div className="child1 item">
            <h2>Projected Tweets</h2>

            <div
              style={{display: "flex", flexDirection: "row", justifyContent: "flex-end" }}
            >
              <div 
                // style={{ backgroundColor: "purple" }}
              >
                <svg></svg>
              </div>
              <div
                style={{ width: "25%" }}
              >
                <svg className="my_svg"></svg>
              </div>

            </div>
          </div>

          <div className="child2 item">
            <h2>Selected Tweets</h2>
            {
              this.state.selected_data.map((item, index) => {
                return (
                  <p key={index}
                    style={{ color: this.state.sentimentColors[item.PredictedSentiment] }}>
                    {item.Tweets}
                  </p>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default App;