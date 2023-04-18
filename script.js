// Load CSV file

d3.csv("baise.csv").then(function(data) {

  // Convert numerical values to numbers
  data.forEach(function(d) {
    //console.log(d)
    d.time = new Date(d.time)
  });

  // 筛选出符合日期范围的对象
  const startDate = new Date("2021-08-01");
  const endDate = new Date("2021-08-02");
  const lastData = new Date("2021-8-31");

  // 过滤出这几天的数据
  const filteredList = data.filter(obj => {
    return (obj.time >= startDate && obj.time <= endDate) || obj.time >= lastData;
  });

  // 排序
  const sortedList = filteredList.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });
  
  console.log(sortedList);
  $('#example').DataTable( {
		data: sortedList,
		columns: [
			{ "data": "id" },
			{ "data": "name" },
			{ "data": "city" },
			{ "data": "ratings" },
			{ "data": "commet" },
			{ "data": "time" }
		]
	} );

  // Define chart dimensions
  var margin = {top: 20, right: 20, bottom: 30, left: 150},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // Define scales
  var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.rating; })])
      .range([0, width]);

  var y = d3.scaleBand()
      .domain(data.map(function(d) { return d.username; }))
      .range([0, height])
      .padding(0.1);

  // Create SVG element
  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Add bars
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", function(d) { return y(d.username); })
      .attr("width", function(d) { return x(d.rating); })
      .attr("height", y.bandwidth());

  // Add axes
  svg.append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(x));

  svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

});