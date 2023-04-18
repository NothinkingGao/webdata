// Load CSV file

function getTopDateData(data,month,day){
    // 过滤出这几天的数据
    const filteredList = data.filter(obj => {
      if(obj.time.getMonth() + 1 == month && obj.time.getDate() == day){
         return obj;
      }
    });

    // 排序
    var sortedList = filteredList.sort((a, b) => {
      return a.time - b.time;
    });
    sortedList =sortedList.slice(0, 10);
    console.log(sortedList);
    // sortedList.forEach(function(d){
    //   d.time = d.time.toLocaleString();
    // })
    return sortedList;
}

function drawDonutChart(starData,length){
    // set the dimensions and margins of the graph
    const width = 1000,
        height = 450,
        margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#pie")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

    
    var donutTip = d3.select("body").append("div")
        .attr("class", "donut-tip")
        .style("opacity", 0);
    
    // set the color scale
    const color = d3.scaleOrdinal()
      .domain(["1.5", "2.0", "c", "d", "e", "f", "g", "h"])
      .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    // 计算饼图上每一块的位置.
    const pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(d => d[1])
    console.log(pie(Object.entries(starData)));
    const data_ready = pie(Object.entries(starData))

    // The arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.3)         // This is the size of the donut hole
      .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('allSlices')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data[1]))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .on('mouseover', function (d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.65');
        donutTip.transition()
            .duration(50)
            .style("opacity", 1);
        console.log(i);
        console.log(d)
        let num = (i.value/length * 100).toFixed(2).toString() + '%';
        donutTip.html(num)
            .style("left", (d.pageX + 10) + "px")
            .style("top", (d.pageY- 15) + "px");

    })
    .on('mouseout', function (d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
        donutTip.transition()
            .duration('50')
            .style("opacity", 0);
    });

    // Add the polylines between chart and labels:
    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .join('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
          const posA = arc.centroid(d) // line insertion in the slice
          const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
          const posC = outerArc.centroid(d); // Label position = almost the same as posB
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
        })

    // Add the polylines between chart and labels:
    svg
      .selectAll('allLabels')
      .data(data_ready)
      .style("fill", function(d) { return color(d.data[0]); })
      .join('text')
        .text(function(d){ 
          //
          return "评分:" +d.data[0] + "人数:" + d.value + "\n" + "占比:" + (d.value / length * 100).toFixed(2) + "%";
        })
        .attr('transform', function(d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function(d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })

        // Add a legend to the pie chart
        var legend = svg.selectAll(".legend")
          .data(data_ready)
          .enter().append("g")
          .attr("class", "legend")
          .attr("fill", function(d) { return color(d.data[0]); })
          .attr("transform", function(d, i) { 
                return "translate(" + (400) + "," + (-height / 2 + margin + i * 25) + ")"; 
           });


        legend.append("rect")
          .attr("x", 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill",function(d) { return d.data[0]; });

        legend.append("text")
          .attr("x", 44)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text(function(d) { return d.data[1]; });
}

function drawRectange(data){

  console.log(data);

  // set the dimensions and margins of the graph
  var margin = {top: 50, right: 50, bottom: 70, left: 100},
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    
          //线性比例尺
    var y = d3.scaleLinear()
          .range([height, 0]);

    // append the svg object to the body of the page
    var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var defs = svg.append("defs");

    var gradient = defs.append("linearGradient")
    .attr("id", "svgGradient")
    .attr("x1", "100%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "100%");

    gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", "0%")
    .attr("stop-color", "red")
    .attr("stop-opacity", 1);

    gradient.append("stop")
    .attr('class', 'end')
    .attr("offset", "100%")
    .attr("stop-color", "blue")
    .attr("stop-opacity", 1);

    // format the data
    data.forEach(function(d) {
      d.grade = +d.grade;
      d.score = +d.score;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.grade; }));
    y.domain([0, d3.max(data, function(d) { return d.score; })]);

    // append the rectangles for the bar chart
    // selectAll是选择所有制定元素
    // x：矩形左上角的 x 坐标
    // y：矩形左上角的 y 坐标
    // width：矩形的宽度
    // height：矩形的高度
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect") // append rectangle elements
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.grade); })
      .attr("width", x.bandwidth())
      .style("fill","url(#" + gradient.attr("id") + ")")
      .on("mousemove", function(event,d) {
          d3.select(this)
          tooltip.style("visibility", "visible")
          .html("评分: " + d.grade + "<br/>人数: " + d.score)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px");
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill","url(#" + gradient.attr("id") + ")")
          tooltip.style("visibility", "hidden");
      })
      .attr("y",function(d){
          var min = y.domain()[0];
          return y(min);
      })
      .transition()
      .delay(function(d,i){
          return i * 200;
      })
      .duration(500)
      .ease(d3.easeBounce)
      .attr("y", function(d) { return y(d.score); })
      .attr("height", function(d) { return height - y(d.score); })

      // add the x Axis
      svg.append("g")
        .attr("class", "axis-x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // add the y Axis
      svg.append("g")
        .attr("class", "axis-y")
        .call(d3.axisLeft(y));

      // add tooltip
      var tooltip = d3.select("#chart").append("div")
        .attr("class", "tooltip");
    
      //添加文字元素
      var texts = svg.selectAll(".MyText")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "MyText")
      .attr("x", function(d, i) {
        return x(d.grade) - 20;
      })
      .attr("y",function(d){
          var min = y.domain()[0];
          return y(min);
      })
      .transition()
      .delay(function(d,i){
          return i * 200;
      })
      .duration(500)
      .ease(d3.easeBounce)
      .attr("y", function(d) {
        return y(d.score + 600);
      })
      .attr("dx", function() {
        return x.step()/ 2;
      })
      .attr("dy", function(d) {
        return 20;
      })
      .text(function(d) {
        return d.score;
      });


    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // add the title
    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("白蛇2的影评");

    // add the x axis label
    svg.append("text")
      .attr("transform", "translate(" + width + " ," + (height + margin.top) + ")")
      .style("text-anchor", "middle")
      .text("评分等级");

    // add the y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left/2 - 20)
      .attr("x",-margin.top)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("影评/人");
}

d3.csv("baise.csv").then(function(data) {

  // Convert numerical values to numbers
  data.forEach(function(d) {
    //console.log(d)
    d.time = new Date(d.time)
  });

  // 获取8月1号的数据
  $('#example').DataTable( {
  		data: getTopDateData(data,8,1),
      paging:false,
      ordering:false,
  		columns: [
  			{ "data": "id" },
  			{ "data": "name" },
  			{ "data": "city" },
  			{ "data": "ratings" },
  			{ "data": "commet" },
  			{ "data": "time" }
		]
	} );

  // 获取8月2号的数据
  $('#example2').DataTable( {
      data: getTopDateData(data,8,2),
      paging:false,
      ordering:false,
      columns: [
        { "data": "id" },
        { "data": "name" },
        { "data": "city" },
        { "data": "ratings" },
        { "data": "commet" },
        { "data": "time" }
    ]
  } );

  // 获取8月31号的数据
  $('#example3').DataTable( {
      data: getTopDateData(data,8,31),
      paging:false,
      ordering:false,
      columns: [
        { "data": "id" },
        { "data": "name" },
        { "data": "city" },
        { "data": "ratings" },
        { "data": "commet" },
        { "data": "time" }
    ]
  } );

  var stars = {0:0,0.5:0,1:0,1.5:0,2:0,2.5:0,3:0,3.5:0,4:0,4.5:0,5:0};

  for (var i = data.length - 1; i >= 0; i--) {
    var ratings = parseFloat(data[i].ratings);

    if (ratings == 0) {
        stars["0"] += 1;
    }
    else if(ratings == 0.5) {
      stars["0.5"] += 1;
    }
    else if (ratings >= 1 && ratings < 1.5) {
      stars["1"] += 1;
    } else if (ratings >= 1.5 && ratings < 2) {
      stars["1.5"] += 1;
    } else if (ratings >= 2 && ratings < 2.5) {
      stars["2"] += 1;
    } else if (ratings >= 2.5 && ratings < 3) {
      stars["2.5"] += 1;
    } else if (ratings >= 3 && ratings < 3.5) {
      stars["3"] += 1;
    } else if (ratings >= 3.5 && ratings < 4) {
      stars["3.5"] += 1;
    } else if (ratings >= 4 && ratings < 4.5) {
      stars["4"] += 1;
    } else if (ratings >= 4.5 && ratings < 5) {
      stars["4.5"] += 1;
    } else if (ratings >= 5 && ratings < 5.5) {
      stars["5"] += 1;
    }
  }
  console.log(stars);

  var starData = new Array();
  for (const [key, value] of Object.entries(stars)) {
    starData.push({  grade: key, score: value});
    starData.sort(function(a, b) {
      return parseFloat(a.grade) - parseFloat(b.grade);
    })
  }

  var total = data.length;
  console.log(starData);
    drawRectange(starData);
    drawDonutChart(stars,data.length);
});