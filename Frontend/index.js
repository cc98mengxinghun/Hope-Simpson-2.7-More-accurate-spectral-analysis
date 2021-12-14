var texasConfirm = [];
var texasConfirmFft = [];
var texasConfirmSg = [];
var texasConfirmConvolve = [];
var texasConfirmIs = [];
var texasDeath = [];
var texasDeathFft = [];
var texasDeathSg = [];
var texasDeathConvolve = [];
var texasDeathIs = [];
var usConfirm = [];
var usConfirmFft = [];
var usConfirmSg = [];
var usConfirmConvolve = [];
var usConfirmIs = [];
var usDeath = [];
var usDeathFft = [];
var usDeathSg = [];
var usDeathConvolve = [];
var usDeathIs = [];
var dates = [];
var states = [];

// Upload the csv files
function onUpload() {
	var files = document.getElementById("upload_input").files;
	for (let i = 0; i < files.length; i ++) {
		var file = files[i];
		let fileName = file.name;
		if (fileName == "Texas_is.csv" || fileName == "US_is.csv") {
			continue;
		}
		var reader = new FileReader();
		try {
			reader.readAsText(file, 'utf-8');
			reader.onload = function(f) {
				uploadContent = this.result;
				console.log(fileName);
				parseData(fileName, uploadContent);
			}
		} catch (e) {
			alert("Read Failed!", false);
			console.log(e);
		}
	}

	for (let i = 0; i < files.length; i ++) {
		var file = files[i];
		let fileName = file.name;
		if (fileName == "Texas.csv" || fileName == "US.csv") {
			continue;
		}
		var reader = new FileReader();
		try {
			reader.readAsText(file, 'utf-8');
			reader.onload = function(f) {
				uploadContent = this.result;
				console.log(fileName);
				parseData(fileName, uploadContent);
			}
		} catch (e) {
			alert("Read Failed!", false);
			console.log(e);
		}
	}
	document.getElementById("upload_input").style.display = "none";
}

// Parse the data in the csv files
function parseData(fileName, rawData) {
	var rows = rawData.split(/[\n]/);
	let index = 0;
	for (let i = 1; i < rows.length; i ++) {
		var cells = rows[i].split(',');
		if (fileName == "Texas.csv") {
			dates.push(cells[1]);
			texasConfirm.push(cells[3]);
			texasConfirmFft.push(cells[4]);
			texasConfirmSg.push(cells[5]);
			texasConfirmConvolve.push(cells[6]);
			texasDeath.push(cells[8]);
			texasDeathFft.push(cells[9]);
			texasDeathSg.push(cells[10]);
			texasDeathConvolve.push(cells[11]);
		}
		else if (fileName == "US.csv") {
			usConfirm.push(cells[3]);
			usConfirmFft.push(cells[4]);
			usConfirmSg.push(cells[5]);
			usConfirmConvolve.push(cells[6]);
			usDeath.push(cells[8]);
			usDeathFft.push(cells[9]);
			usDeathSg.push(cells[10]);
			usDeathConvolve.push(cells[11]);
		} else if (fileName == "Texas_is.csv") {
			while (cells[1] != dates[index]) {
				texasConfirmIs.push(null);
				texasDeathIs.push(null);
				index ++;
			}
			texasConfirmIs.push(cells[4]);
			texasDeathIs.push(cells[7]);
			index ++;
		} else if (fileName == "US_is.csv") {
			while (cells[1] != dates[index]) {
				usConfirmIs.push(null);
				usDeathIs.push(null);
				index ++;
			}
			usConfirmIs.push(cells[4]);
			usDeathIs.push(cells[7]);
			index ++;
		}
	}
	console.log(texasDeathIs);
}

// Create the charts objects
function createChats() {
	// Texas tables
	var texasConfirmChart = echarts.init(document.getElementById('texasConfirm'));
	var option = {
        title: {
            text: 'Texas Confirm'
        },
        tooltip: {},
        legend: {
            data: ['new_confirmed','new_confirmed_fft','new_confirmed_after_sg','new_confirmed_after_convolve']
        },
        xAxis: {
            data: dates
        },
        yAxis: {},
        dataZoom: [
			{
		    	type: 'inside'
			}
		],
        series: [
            {
                name: 'new_confirmed',
                type: 'bar',
                data: texasConfirm
          	},
            {
                name: 'new_confirmed_fft',
                type: 'bar',
                data: texasConfirmFft
            },
            {
            	name: 'new_confirmed_after_sg',
                type: 'bar',
                data: texasConfirmSg
            },
            {
            	name: 'new_confirmed_after_convolve',
                type: 'bar',
                data: texasConfirmConvolve
            }
        
        ]
    };

    // Zoom in setting
    const zoomSize = 10;
	texasConfirmChart.on('click', function (params) {
		console.log(dates[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		texasConfirmChart.dispatchAction({
		  	type: 'dataZoom',
		    startValue: dates[Math.max(params.dataIndex - zoomSize / 2, 0)],
		    endValue:
		      dates[Math.min(params.dataIndex + zoomSize / 2, texasConfirm.length - 1)]
		});
	});
    option && texasConfirmChart.setOption(option);


    var texasDeathChart = echarts.init(document.getElementById('texasDeath'));
	option = {
        title: {
            text: 'Texas Death'
        },
        tooltip: {},
        legend: {
            data: ['new_deaths','new_death_after_fft','new_death_after_sg','new_death_after_convolve']
        },
        xAxis: {
            data: dates
        },
        yAxis: {},
        dataZoom: [
			{
		    	type: 'inside'
			}
		],
        series: [
            {
                name: 'new_deaths',
                type: 'bar',
                data: texasDeath
            },
            {
                name: 'new_death_after_fft',
                type: 'bar',
                data: texasDeathFft
          	},
          	{
                name: 'new_death_after_sg',
                type: 'bar',
                data: texasDeathSg
          	},
          	{
                name: 'new_death_after_convolve',
                type: 'bar',
                data: texasDeathConvolve
          	}
        ]
    };

	texasDeathChart.on('click', function (params) {
		console.log(dates[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		texasDeathChart.dispatchAction({
		  	type: 'dataZoom',
		    startValue: dates[Math.max(params.dataIndex - zoomSize / 2, 0)],
		    endValue:
		      dates[Math.min(params.dataIndex + zoomSize / 2, texasConfirm.length - 1)]
		});
	});
    option && texasDeathChart.setOption(option);

    // US tables
    var usConfirmChart = echarts.init(document.getElementById('usConfirm'));
	option = {
        title: {
            text: 'US Confirm'
        },
        tooltip: {},
        legend: {
            data: ['new_confirmed','new_confirmed_fft','new_confirmed_after_sg','new_confirmed_after_convolve']
        },
        xAxis: {
            data: dates
        },
        yAxis: {},
        dataZoom: [
			{
		    	type: 'inside'
			}
		],
        series: [
            {
                name: 'new_confirmed',
                type: 'bar',
                data: usConfirm
            },
            {
                name: 'new_confirmed_fft',
                type: 'bar',
                data: usConfirmFft
          	},
          	{
            	name: 'new_confirmed_after_sg',
                type: 'bar',
                data: usConfirmSg
            },
            {
            	name: 'new_confirmed_after_convolve',
                type: 'bar',
                data: usConfirmConvolve
            }
        ]
    };

	usConfirmChart.on('click', function (params) {
		console.log(dates[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		usConfirmChart.dispatchAction({
		  	type: 'dataZoom',
		    startValue: dates[Math.max(params.dataIndex - zoomSize / 2, 0)],
		    endValue:
		      dates[Math.min(params.dataIndex + zoomSize / 2, texasConfirm.length - 1)]
		});
	});
    option && usConfirmChart.setOption(option);

    var usDeathChart = echarts.init(document.getElementById('usDeath'));
	option = {
        title: {
            text: 'US Death'
        },
        tooltip: {},
        legend: {
            data: ['new_deaths','new_death_after_fft','new_death_after_sg','new_death_after_convolve']
        },
        xAxis: {
            data: dates
        },
        yAxis: {},
        dataZoom: [
			{
		    	type: 'inside'
			}
		],
        series: [
            {
                name: 'new_deaths',
                type: 'bar',
                data: usDeath
            },
            {
                name: 'new_death_after_fft',
                type: 'bar',
                data: usDeathFft
          	},
          	{
                name: 'new_death_after_sg',
                type: 'bar',
                data: usDeathSg
          	},
          	{
                name: 'new_death_after_convolve',
                type: 'bar',
                data: usDeathConvolve
          	}
        ]
    };

	usDeathChart.on('click', function (params) {
		console.log(dates[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		usDeathChart.dispatchAction({
		  	type: 'dataZoom',
		    startValue: dates[Math.max(params.dataIndex - zoomSize / 2, 0)],
		    endValue:
		      dates[Math.min(params.dataIndex + zoomSize / 2, texasConfirm.length - 1)]
		});
	});
    option && usDeathChart.setOption(option);

    // Texas IS tables 
    var texasConfirmIsChart = echarts.init(document.getElementById('texasConfirmIs'));
	option = {
		color: ['#5470c6', '#ee6666'],
        title: {
            text: 'Texas Confirm Interp Spline'
        },
        tooltip: {},
        legend: {
            data: ['new_confirmed','new_confirmed_after_interp_spline']
        },
        xAxis: {
            data: dates
        },
        yAxis: {},
        dataZoom: [
			{
		    	type: 'inside'
			}
		],
        series: [
            {
                name: 'new_confirmed',
                type: 'bar',
                data: texasConfirm
            },
            {
                name: 'new_confirmed_after_interp_spline',
                type: 'line',
                data: texasConfirmIs,
                connectNulls: true,
                symbol: 'circle',     
                symbolSize: 6,
          	}
        ]
    };

	texasConfirmIsChart.on('click', function (params) {
		console.log(dates[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		texasConfirmIsChart.dispatchAction({
		  	type: 'dataZoom',
		    startValue: dates[Math.max(params.dataIndex - zoomSize / 2, 0)],
		    endValue:
		      dates[Math.min(params.dataIndex + zoomSize / 2, texasConfirm.length - 1)]
		});
	});
    option && texasConfirmIsChart.setOption(option);

    var texasDeathIsChart = echarts.init(document.getElementById('texasDeathIs'));
	option = {
		color: ['#5470c6', '#ee6666'],
        title: {
            text: 'Texas Death Interp Spline'
        },
        tooltip: {},
        legend: {
            data: ['new_deaths','new_death_after_interp_spline']
        },
        xAxis: {
            data: dates
        },
        yAxis: {},
        dataZoom: [
			{
		    	type: 'inside'
			}
		],
        series: [
            {
                name: 'new_deaths',
                type: 'bar',
                data: texasDeath
            },
            {
                name: 'new_death_after_interp_spline',
                type: 'line',
                data: texasDeathIs,
                connectNulls: true,
                symbol: 'circle',     
                symbolSize: 6,
          	}
        ]
    };

	texasDeathIsChart.on('click', function (params) {
		console.log(dates[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		texasDeathIsChart.dispatchAction({
		  	type: 'dataZoom',
		    startValue: dates[Math.max(params.dataIndex - zoomSize / 2, 0)],
		    endValue:
		      dates[Math.min(params.dataIndex + zoomSize / 2, texasConfirm.length - 1)]
		});
	});
    option && texasDeathIsChart.setOption(option);

    // US IS tables
    var usConfirmIsChart = echarts.init(document.getElementById('usConfirmIs'));
	option = {
		color: ['#5470c6', '#ee6666'],
        title: {
            text: 'US Confirm Interp Spline'
        },
        tooltip: {},
        legend: {
            data: ['new_confirmed','new_confirmed_after_interp_spline']
        },
        xAxis: {
            data: dates
        },
        yAxis: {},
        dataZoom: [
			{
		    	type: 'inside'
			}
		],
        series: [
            {
                name: 'new_confirmed',
                type: 'bar',
                data: usConfirm
            },
            {
                name: 'new_confirmed_after_interp_spline',
                type: 'line',
                data: usConfirmIs,
                connectNulls: true,
                symbol: 'circle',     
                symbolSize: 6,
          	}
        ]
    };

	usConfirmIsChart.on('click', function (params) {
		console.log(dates[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		usConfirmIsChart.dispatchAction({
		  	type: 'dataZoom',
		    startValue: dates[Math.max(params.dataIndex - zoomSize / 2, 0)],
		    endValue:
		      dates[Math.min(params.dataIndex + zoomSize / 2, texasConfirm.length - 1)]
		});
	});
    option && usConfirmIsChart.setOption(option);

    var usDeathIsChart = echarts.init(document.getElementById('usDeathIs'));
	option = {
		color: ['#5470c6', '#ee6666'],
        title: {
            text: 'US Death Interp Spline'
        },
        tooltip: {},
        legend: {
            data: ['new_deaths','new_death_after_interp_spline']
        },
        xAxis: {
            data: dates
        },
        yAxis: {},
        dataZoom: [
			{
		    	type: 'inside'
			}
		],
        series: [
            {
                name: 'new_deaths',
                type: 'bar',
                data: usDeath
            },
            {
                name: 'new_death_after_interp_spline',
                type: 'line',
                data: usDeathIs,
                connectNulls: true,
                symbol: 'circle',     
                symbolSize: 6,
          	}
        ]
    };

	usDeathIsChart.on('click', function (params) {
		console.log(dates[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		usDeathIsChart.dispatchAction({
		  	type: 'dataZoom',
		    startValue: dates[Math.max(params.dataIndex - zoomSize / 2, 0)],
		    endValue:
		      dates[Math.min(params.dataIndex + zoomSize / 2, texasConfirm.length - 1)]
		});
	});
    option && usDeathIsChart.setOption(option);

	//Show the charts
    showcharts();
}

// Initialize and add the map
function initMap() {
	this.initStates();
  	// The location of US
  	const us = { lat: 40, lng: -100 };
  	// The map, centered at US
  	const map = new google.maps.Map(document.getElementById("map"), {
    	zoom: 5,
    	center: us,
  	});
  	// The marker, positioned at US
  	for (let i = 0; i < states.length; i ++) {
	  	var marker = new google.maps.Marker({
	    	position: states[i]["position"],
	    	map: map,
	        	icon: {
	        	path: google.maps.SymbolPath.CIRCLE,
	        	fillColor: '#FF2D00',
	        	fillOpacity: 0.7,
	        	strokeColor: '#00A',
	        	strokeOpacity: 0.9,
	        	strokeWeight: 1,
	        	scale: states[i]["quantity"] / 77.6
	    	}
	  	});
	  	if (states[i]["name"] == "Texas") {
	  		marker.addListener('click', createChats);
	  	}
  	}

}

// Switches among the tabs
function showcharts() {
	document.getElementById("map").style.display = "none";
	var buttons = document.getElementsByClassName("button");
	for (let i = 0; i < buttons.length; i ++) {
		buttons[i].style.display = "inline-block";
	}
	this.showTexasCharts();
}

function showTexasCharts() {
	document.getElementById("texasConfirm").style.display = "inline";
	document.getElementById("texasDeath").style.display = "inline";
	document.getElementById("usConfirm").style.display = "none";
	document.getElementById("usDeath").style.display = "none";
	document.getElementById("texasConfirmIs").style.display = "none";
	document.getElementById("texasDeathIs").style.display = "none";
	document.getElementById("usConfirmIs").style.display = "none";
	document.getElementById("usDeathIs").style.display = "none";
}

function showUSCharts() {
	document.getElementById("texasConfirm").style.display = "none";
	document.getElementById("texasDeath").style.display = "none";
	document.getElementById("usConfirm").style.display = "inline";
	document.getElementById("usDeath").style.display = "inline";
	document.getElementById("texasConfirmIs").style.display = "none";
	document.getElementById("texasDeathIs").style.display = "none";
	document.getElementById("usConfirmIs").style.display = "none";
	document.getElementById("usDeathIs").style.display = "none";
}

function showTexasIsCharts() {
	document.getElementById("texasConfirm").style.display = "none";
	document.getElementById("texasDeath").style.display = "none";
	document.getElementById("usConfirm").style.display = "none";
	document.getElementById("usDeath").style.display = "none";
	document.getElementById("texasConfirmIs").style.display = "inline";
	document.getElementById("texasDeathIs").style.display = "inline";
	document.getElementById("usConfirmIs").style.display = "none";
	document.getElementById("usDeathIs").style.display = "none";
}

function showUSIsCharts() {
	document.getElementById("texasConfirm").style.display = "none";
	document.getElementById("texasDeath").style.display = "none";
	document.getElementById("usConfirm").style.display = "none";
	document.getElementById("usDeath").style.display = "none";
	document.getElementById("texasConfirmIs").style.display = "none";
	document.getElementById("texasDeathIs").style.display = "none";
	document.getElementById("usConfirmIs").style.display = "inline";
	document.getElementById("usDeathIs").style.display = "inline";
}

function showMap() {
	document.getElementById("texasConfirm").style.display = "none";
	document.getElementById("texasDeath").style.display = "none";
	document.getElementById("usConfirm").style.display = "none";
	document.getElementById("usDeath").style.display = "none";
	document.getElementById("texasConfirmIs").style.display = "none";
	document.getElementById("texasDeathIs").style.display = "none";
	document.getElementById("usConfirmIs").style.display = "none";
	document.getElementById("usDeathIs").style.display = "none";
	document.getElementById("map").style.display = "block";
	var buttons = document.getElementsByClassName("button");
	for (let i = 0; i < buttons.length; i ++) {
		buttons[i].style.display = "none";
	}
}

// Load the states data
function initStates() {
	states.push({
		"name": "Wisconsin",
		"position": {lat: 44.5, lng: -89.5},
		"quantity": 1002
	},
	{
		"name": "West Virginia",
		"position": {lat: 39, lng: -80.5},
		"quantity": 307
	},
	{
		"name": "Vermont",
		"position": {lat: 44, lng: -72.67},
		"quantity": 55.849
	},
	{
		"name": "Texas",
		"position": {lat: 31, lng: -100},
		"quantity": 4380
	},
	{
		"name": "South Dakota",
		"position": {lat: 44.5, lng: -100},
		"quantity": 171
	},
	{
		"name": "Rhode Island",
		"position": {lat: 41.7, lng: -71.5},
		"quantity": 201
	},
	{
		"name": "Oregon",
		"position": {lat: 44, lng: -120.5},
		"quantity": 400
	},
	{
		"name": "New York",
		"position": {lat: 43, lng: -75},
		"quantity": 2840
	},
	{
		"name": "New Hampshire",
		"position": {lat: 44, lng: -71.5},
		"quantity": 174
	},
	{
		"name": "Nebraska",
		"position": {lat: 41.5, lng: -100},
		"quantity": 321
	},
	{
		"name": "Kansas",
		"position": {lat: 38.5, lng: -98},
		"quantity": 487
	},
	{
		"name": "Mississippi",
		"position": {lat: 33, lng: -90},
		"quantity": 519
	},
	{
		"name": "Illinois",
		"position": {lat: 40, lng: -89},
		"quantity": 1890
	},
	{
		"name": "Delaware",
		"position": {lat: 39, lng: -75.5},
		"quantity": 161
	},
	{
		"name": "Connecticut",
		"position": {lat: 41.6, lng: -72.7},
		"quantity": 439
	},
	{
		"name": "Arkansas",
		"position": {lat: 34.8, lng: -92.6},
		"quantity": 538
	},
	{
		"name": "Indiana",
		"position": {lat: 40.27, lng: -86.127},
		"quantity": 1150
	},
	{
		"name": "Missouri",
		"position": {lat: 38.574, lng: -92.6},
		"quantity": 956
	},
	{
		"name": "Florida",
		"position": {lat: 28, lng: -81.76},
		"quantity": 3710
	},
	{
		"name": "Nevada",
		"position": {lat: 39.87, lng: -117.22},
		"quantity": 478
	},
	{
		"name": "Maine",
		"position": {lat: 45.36, lng: -68.97},
		"quantity": 130
	},
	{
		"name": "Michigan",
		"position": {lat: 44.18, lng: -84.5},
		"quantity": 1560
	},
	{
		"name": "Georgia",
		"position": {lat: 33.24, lng: -83.44},
		"quantity": 1640
	},
	{
		"name": "Hawaii",
		"position": {lat: 19.74, lng: -155.84},
		"quantity": 86.2
	},
	{
		"name": "Alaska",
		"position": {lat: 66.16, lng: -153.37},
		"quantity": 152
	},
	{
		"name": "Tennessee",
		"position": {lat: 35.86, lng: -86.66},
		"quantity": 1310
	},
	{
		"name": "Virginia",
		"position": {lat: 37.92, lng: -78.02},
		"quantity": 994
	},
	{
		"name": "New Jersey",
		"position": {lat: 39.83, lng: -74.87},
		"quantity": 1300
	},
	{
		"name": "Kentucky",
		"position": {lat: 37.84, lng: -84.27},
		"quantity": 815
	},
	{
		"name": "North Dakota",
		"position": {lat: 47.65, lng: -100.437},
		"quantity": 167
	},
	{
		"name": "Minnesota",
		"position": {lat: 46.39, lng: -94.636},
		"quantity": 957
	},
	{
		"name": "Oklahoma",
		"position": {lat: 36.08, lng: -96.92},
		"quantity": 681
	},
	{
		"name": "Montana",
		"position": {lat: 46.965, lng: -109.53},
		"quantity": 194
	},
	{
		"name": "Washington",
		"position": {lat: 47.75, lng: -120.74},
		"quantity": 793
	},
	{
		"name": "Utah",
		"position": {lat: 39.41, lng: -111.95},
		"quantity": 611
	},
	{
		"name": "Colorado",
		"position": {lat: 39.11, lng: -105.35},
		"quantity": 860
	},
	{
		"name": "Ohio",
		"position": {lat: 40.67, lng: -82.996},
		"quantity": 1780
	},
	{
		"name": "Alabama",
		"position": {lat: 32.318, lng: -86.9},
		"quantity": 852
	},
		{
		"name": "Iowa",
		"position": {lat: 42, lng: -93.58},
		"quantity": 546
	},
		{
		"name": "New Mexico",
		"position": {lat: 34.31, lng: -106.02},
		"quantity": 330
	},
		{
		"name": "South Carolina",
		"position": {lat: 33.836, lng: -81.16},
		"quantity": 929
	},
		{
		"name": "Pennsylvania",
		"position": {lat: 41.2, lng: -77.1945},
		"quantity": 1840
	},
		{
		"name": "Arizona",
		"position": {lat: 34.05, lng: -111.09},
		"quantity": 1320
	},
		{
		"name": "Maryland",
		"position": {lat: 39.045, lng: -76.64},
		"quantity": 593
	},
		{
		"name": "Massachusetts",
		"position": {lat: 42.4, lng: -71.38},
		"quantity": 970
	},
	{
		"name": "California",
		"position": {lat: 36.778, lng: -119.418},
		"quantity": 5160
	},
		{
		"name": "Idaho",
		"position": {lat: 44.07, lng: -114.74},
		"quantity": 312
	},
		{
		"name": "Wyoming",
		"position": {lat: 43.076, lng: -107.3},
		"quantity": 113
	},
		{
		"name": "North Carolina",
		"position": {lat: 35.78, lng: -80.79},
		"quantity": 1570
	},
		{
		"name": "Louisiana",
		"position": {lat: 30.39, lng: -92.33},
		"quantity": 776
	},
	);
}