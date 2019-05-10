//function reloadBoxingJS() {
var strProID_boxing = "";
var boxing_cedian = new Array();
var boxing_caijiTime = new Array();
//获取测点位置和采集时间
function getDataFromInitWithBoxing(cedianArray, caijiTimeArray, strCedain, strTime) {
	$('#boxing_weizhiText').val(strCedain);
	$('#boxing_weizhi').val(strTime.text);
	strProID_boxing = strTime.id;
	boxing_cedian = cedianArray;
	boxing_caijiTime = caijiTimeArray;

}
$("#chart_shiyu").hide();
$("#chart_pinpu").hide();
$("#chart_sudu").hide();
$("#chart_baoluopu").hide();

var strZhou = $("#boxing_zhouxiang").val();

//安装位置选择
$("#boxing_weizhiText").on('tap', function() {
	var userPicker = new mui.PopPicker();

	userPicker.setData(boxing_cedian);
	var strid = "boxing_weizhiText";
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
		var startTime_tezheng = localStorage.getItem("StartTime");
		var endTime_tezheng = localStorage.getItem("EndTime");
		var zhouxiang = $("#boxing_zhouxiang").val();
		getCaiYangDianData(startTime_tezheng, endTime_tezheng, items[0].text, "choose", zhouxiang);
	});

})

//采样点点击选择事件
$("#boxing_weizhi").on('tap', function() {
	if(boxing_caijiTime.length > 0) {
		var userPicker = new mui.PopPicker();
		userPicker.setData(boxing_caijiTime);
		var strid = "boxing_weizhi";
		var userResult = document.getElementById(strid);
		userPicker.show(function(items) {
			userResult.value = items[0].text;
			strProID_boxing = items[0].id;
			$("#tezheng_timeCount").val(items[0].text);
			var zhouxiang = $("#boxing_zhouxiang").val();
			getDataFromSeverWithParam(items[0].id, zhouxiang);
		});
	} else {
		mui.toast("没有采集时间数据")
	}

})
//轴向点击选择事件
$("#boxing_zhouxiang").on('tap', function() {
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();

	userPicker.setData([{
		text: "x"
	}, {
		text: "y"
	}, {
		text: "z"
	}]);
	var strid = "boxing_zhouxiang";
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
		var zhouxiang = items[0].text;
		getDataFromSeverWithParam(strProID_boxing, zhouxiang);
	});

})

//波形---初始化数据
//	loadDataWithDate();
//波形---初始化数据
function loadDataWithDate(respData) {

	//	if(respData.data.length != 'undefined') {
	if(typeof(respData.data.timeIntervalVO) != "undefined") {
		//最大最小时间
		var strmin = respData.data["timeIntervalVO"]["min_time"];
		strMinTime = strmin;
		var strmax = respData.data["timeIntervalVO"]["max_time"];
		strMaxTime = strmax;

		if(respData.data["installList"] != undefined) {
			//安装位置筛选
			anzhuangArray = respData.data["installList"];
			boxing_cedian = respData.data["installList"];
		}

		var proData = respData.data["probeDrawVO"];

		if(proData != 'undefined') {
			$("#boxing_weizhiText").val(proData.install_xy);

			$("#chart_shiyu").show();
			$("#chart_pinpu").show();
			//						$("#chart_sudu").show();
			$("#chart_baoluopu").show();
			dealWithData_boxing(proData);
		} else {
			// mui.toast("没有相关数据...");
			$("#chart_shiyu").hide();
			$("#chart_pinpu").hide();
			$("#chart_sudu").hide();
			$("#chart_baoluopu").hide()

		}
	} else {
		// mui.toast("没有相关数据...");
		$("#chart_shiyu").hide();
		$("#chart_pinpu").hide();
		$("#chart_sudu").hide();
		$("#chart_baoluopu").hide()
	}

}
//处理数据，为画图准备
function dealWithData_boxing(dealData) {

	var width = $(window).width();
	$("#chart_shiyu").css("width", width);
	$("#chart_pinpu").css("width", width);
	$("#chart_sudu").css("width", width);
	$("#chart_baoluopu").css("width", width);

	strZhou = $("#boxing_zhouxiang").val();
	if(strZhou == "x") {
		//时域图X
		if(typeof(dealData.data_store_x)!="undefined" && typeof(dealData.data_store_x.list_x)!="undefined") {
			var xData = dealData.data_store_x.list_x;
			var yData = dealData.data_store_x.list_y;
			
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartshiyu(seriesData);
			$("#chart_shiyu").show();
		} else {
			$("#chart_shiyu").hide();
		}
		//频谱图X
		if(dealData.fft_store_x != undefined && typeof(dealData.fft_store_x.list_x)!="undefined") {
			var xData = dealData.fft_store_x.list_x;
			var yData = dealData.fft_store_x.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartpinpu(seriesData);
			$("#chart_pinpu").show();
		} else {
			$("#chart_pinpu").hide();
		}

		//		速度谱X
		if(dealData.speed_store_x != undefined && typeof(dealData.speed_store_x.list_x)!="undefined") {
			var xData = dealData.speed_store_x.list_x;
			var yData = dealData.speed_store_x.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartSuduNew(seriesData);
			
			$("#chart_sudu").show();
		} else {
			$("#chart_sudu").hide();
		}
		//包络谱X
		if(dealData.envelope_store_x != undefined && typeof(dealData.envelope_store_x.list_x)!="undefined") {
			var xData = dealData.envelope_store_x.list_x;
			var yData = dealData.envelope_store_x.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			
			// console.log("===="+seriesData)
			chartBaoluo(seriesData);
			$("#chart_baoluopu").show();
		} else {
			$("#chart_baoluopu").hide();
		}

	}

	if(strZhou == "y") {
		//时域图Y
		if(dealData.data_store_y != undefined && typeof(dealData.data_store_y.list_x)!="undefined") {
			var xData = dealData.data_store_y.list_x;
			var yData = dealData.data_store_y.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartshiyu(seriesData);
			$("#chart_shiyu").show();
		} else {
			$("#chart_shiyu").hide();
		}
		//频谱图Y
		if(dealData.fft_store_y != undefined && typeof(dealData.fft_store_y.list_x)!="undefined") {
			var xData = dealData.fft_store_y.list_x;
			var yData = dealData.fft_store_y.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartpinpu(seriesData);
			$("#chart_pinpu").show();
		} else {
			$("#chart_pinpu").hide();
		}
		//速度谱Y
		if(dealData.speed_store_y != undefined && typeof(dealData.speed_store_y.list_x)!="undefined") {
			var xData = dealData.speed_store_y.list_x;
			var yData = dealData.speed_store_y.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartSuduNew(seriesData);
			$("#chart_sudu").show();
		} else {
			$("#chart_sudu").hide();
		}
		//包络谱Y
		if(dealData.envelope_store_y != undefined && typeof(dealData.envelope_store_y.list_x)!="undefined") {
			var xData = dealData.envelope_store_y.list_x;
			var yData = dealData.envelope_store_y.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartBaoluo(seriesData);
			$("#chart_baoluopu").show();
		} else {
			$("#chart_baoluopu").hide();
		}

	}
	if(strZhou == "z") {
		//时域图Z
		if(dealData.data_store_z != undefined && typeof(dealData.data_store_z.list_x)!="undefined") {
			var xData = dealData.data_store_z.list_x;
			var yData = dealData.data_store_z.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartshiyu(seriesData);
			$("#chart_shiyu").show();
		} else {
			$("#chart_shiyu").hide();
		}
		//频谱图Z
		if(dealData.fft_store_z != undefined && typeof(dealData.fft_store_z.list_x)!="undefined") {
			var xData = dealData.fft_store_z.list_x;
			var yData = dealData.fft_store_z.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartpinpu(seriesData);
			$("#chart_pinpu").show();
		} else {
			$("#chart_pinpu").hide();
		}
		//速度谱Z
		if(dealData.speed_store_z != undefined && typeof(dealData.speed_store_z.list_x)!="undefined") {
			var xData = dealData.speed_store_z.list_x;
			var yData = dealData.speed_store_z.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartSuduNew(seriesData);
			$("#chart_sudu").show();
		} else {
			$("#chart_sudu").hide();
		}
		//包络谱Z
		if(dealData.envelope_store_z != undefined && typeof(dealData.envelope_store_z.list_x)!="undefined") {
			var xData = dealData.envelope_store_z.list_x;
			var yData = dealData.envelope_store_z.list_y;
			var seriesData = [];
			for(var i = 0; i < xData.length; i++) {
				seriesData.push([xData[i], yData[i]]);
			}
			chartBaoluo(seriesData);
			$("#chart_baoluopu").show();
		} else {
			$("#chart_baoluopu").hide();
		}

	}
}

//时域图
function chartshiyu(seriseData) {
	var option_shiyutu = {
		title: {
			text: '振动波形',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			},
			triggerOn: 'click',
			formatter: '幅度:{c0} m/s²'
		},
		xAxis: {
			axisLine: {
				onZero: false
			},
			name: 'mm/s',
			type: 'value',
			name: 'T(s)'
		},
		yAxis: {
			axisLine: {
				onZero: false
			},
			type: 'value',
			name: 'm/s²'
		},
		grid: {
			left: '15%',
			right: '15%'
		},
		dataZoom: {
			type: 'inside',
			show: true,
			start: 0,
			end: 100
		},
		series: [{
			data: seriseData,
			type: 'line',
			symbolSize: 6,
			symbol: 'circle',
			showSymbol: false,
			animation:false,
			lineStyle: {
				width: 0.5,
				color: "blue"
			}
		}]
	};
	var shiyuEchart = echarts.init(document.getElementById("chart_shiyu"))
	shiyuEchart.setOption(option_shiyutu);

}
//频谱图
function chartpinpu(seriseData) {

	var option_pinputu = {
		title: {
			text: '频谱图',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			},
			triggerOn: 'click',
			formatter: '幅度:{c0} m/s²'
		},
		xAxis: {
			axisLine: {
				onZero: false
			},
			type: 'value',
			name: 'Hz'
		},
		yAxis: {
			type: 'value',
			name: 'm/s²'
		},
		grid: {
			left: '15%',
			right: '15%'
		},
		dataZoom: {
			type: 'inside',
			show: true,
			start: 0,
			end: 100
		},
		series: [{
			data: seriseData,
			type: 'line',
			symbolSize: 6,
			symbol: 'circle',
			showSymbol: false,
			animation:false,
			lineStyle: {
				width: 0.5,
				color: "blue"
			}
		}]
	};
	var pinpuEchart = echarts.init(document.getElementById("chart_pinpu"))
	pinpuEchart.setOption(option_pinputu);
}
//包络谱
function chartBaoluo(seriseData) {
	var option_baoluo = {
		title: {
			text: '包络谱',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			},
			triggerOn: 'click',
			formatter: '幅度:{c0} m/s²'
		},
		xAxis: {
			axisLine: {
				onZero: false
			},
			name: 'Hz',
			type: 'value'
		},
		yAxis: {
			type: 'value',
			name: 'm/s²'
		},

		grid: {
			left: '15%',
			right: '15%'
		},
		dataZoom: {
			type: 'inside',
			show: true,
			start: 0,
			end: 100
		},
		series: [{
			data: seriseData,
			type: 'line',
			symbolSize: 6,
			symbol: 'circle',
			showSymbol: false,
			animation:false,
			lineStyle: {
				width: 0.5,
				color: "blue"
			}
		}]
	};
	var baoluoEchart = echarts.init(document.getElementById("chart_baoluopu"))
	baoluoEchart.setOption(option_baoluo);
}

//速度
function chartSuduNew(seriseData) {

	var option_sudu = {
		title: {
			text: '速度谱',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			},
			triggerOn: 'click',
			formatter: '幅度:{c0} mm/s'
		},
		xAxis: {
			type: 'value',
			axisLine: {
				onZero: false
			},
			//			type: 'category',
			//			data: xData,
			name: 'Hz',
			series: [{
				//折线图
				type: 'line'
			}]
		},
		yAxis: {
			type: 'value',
			name: 'mm/s'
		},

		grid: {
			left: '18%',
			right: '15%'
		},
		dataZoom: {
			type: 'inside',
			show: true,
			start: 0,
			end: 100
		},
		series: [{
			data: seriseData,
			type: 'line',
			symbolSize: 6,
			symbol: 'circle',
			showSymbol: false,
			animation:false,
			lineStyle: {
				width: 0.5,
				color: "blue"
			}
		}]
	};
	var suduEcharts = echarts.init(document.getElementById("chart_sudu"))
	suduEcharts.setOption(option_sudu);
}

//}