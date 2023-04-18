function calculateDaysBetweenDates(begin, end) {    
    var beginDate = new Date(begin);
    var endDate = new Date(end);
    var days = (endDate - beginDate) / (1000 * 60 * 60 * 24);
    return days;
}

function binarySearch(array, value) {
    var low = 0;
    var high = array.length - 1;
    var mid;
    var element;

    while (low <= high) {
        mid = Math.floor((low + high) / 2, 10);
        element = array[mid];
        if (element < value) {
            low = mid + 1;
        } else if (element > value) {
            high = mid - 1;
        } else {
            return mid;
        }
    }

    return -1;
}

// 1.use d3.js to load the data
// 2.draw the chart
// 3.add the tooltip
// 4.add the legend
// 5.add the axis
// 6.add the brush
// 7.add the zoom
// 8.add the slider
// 9.add the button
// 10.add the search box
// 11.add the search button
function drawPieChart(data) {    
    
}