//2019-05-08
var installArrayList = new Array()
var selectObject = new Object()
//2019-05-08
getDeviceInstallActiveList()
var strShowType = 0
var strSensorType = ''

//初始化筛选时间
var strQueryTime = ''

//2019-05-08
function getDeviceInstallActiveList() {
	$.ajax({
		type: 'get',
		url: new_commen_gain_device_install_activate_Interface,
		async: true,
		data: {
			strLoginId: localStorage.getItem('strLoginId'),
			strLoginToken: localStorage.getItem('strLoginToken'),
			devices_no: localStorage.DeveciId
		},
		dataType: 'json',
		success: function(response) {

			if (response.status == "SUCCESS") {
				installArrayList = response.data;
				if (installArrayList.length > 0) {
					$("#qushiChartSelected").html(installArrayList[0].install_xy);

					selectObject = installArrayList[0]
					strSensorType = installArrayList[0].sensorType

					if (installArrayList[0].connect_model == 0) {
						getChartDataWithInstall()
						$("#showSeletedType").css('display', 'none');
					}
					if (installArrayList[0].connect_model == 1) {
						$("#showSeletedType").css('display', 'block');
						longChartsGetData(strShowType)
					}

				}

			}
			if (response.status == 'ILLEGAL') {
				mui.alert('您的账户登录过期，请退出重新登录！')
			}

		},
		error: function(error) {
			console.log(error)
		}
	})

}

//选择测点位置 2019-05-08
$("#qushiChartSelected").on('tap', function() {
	var userPicker = new mui.PopPicker();
	var newUserPickerData = new Array()
	for (var i = 0; i < installArrayList.length; i++) {

		//*************  判断该测点是否正在使用，如果正在使用，给它做个特殊标记， install_xy： 测点的实际名称，方便后面使用
		var objPickerData = new Object()
		objPickerData['value'] = installArrayList[i].id;
		if (installArrayList[i].connect_model == '0') {
			objPickerData['text'] = installArrayList[i].install_xy + '  ▲';
		} else{
			objPickerData['text'] = installArrayList[i].install_xy ;
		}
		objPickerData['install_xy'] = installArrayList[i].install_xy;
		objPickerData['connect_model'] = installArrayList[i].connect_model;
		objPickerData['alias_x'] = installArrayList[i].alias_x;
		objPickerData['alias_y'] = installArrayList[i].alias_y;
		objPickerData['alias_z'] = installArrayList[i].alias_z;
		objPickerData['sensorType'] = installArrayList[i].sensorType;
		
		newUserPickerData.push(objPickerData)
	}
	userPicker.setData(newUserPickerData);
	userPicker.show(function(items) {
		$("#qushiChartSelected").html(items[0].text);
		
		selectObject = {
			id: items[0].value,
			install_xy: items[0].install_xy,
			connect_model: items[0].connect_model,
			alias_x: items[0].alias_x,
			alias_y: items[0].alias_y,
			alias_z: items[0].alias_z,
		}



		strSensorType = items[0].sensorType
		console.log("===EEEEEEEEEE===" + strSensorType)

		if (items[0].connect_model == 0) {
			getChartDataWithInstall()
			$("#showSeletedType").css('display', 'none');
		}
		if (items[0].connect_model == 1) {
			longChartsGetData(strShowType)
			$("#showSeletedType").css('display', 'block');
		}
	});
})
//根据测点获取趋势图数据 2019-05-08  省电模式
function getChartDataWithInstall() {
	$("#qiushitu").empty();
	$.ajax({
		type: 'get',
		url: new_commen_gain_trend_chart_Interface,
		async: true,
		data: {
			install_id: selectObject.id,
			devices_no: localStorage.DeveciId
		},
		dataType: 'json',
		success: function(response) {
			if (response.status == "SUCCESS") {
				setDataToEchart(response.data)
			}
			if (response.status == 'ILLEGAL') {
				mui.alert('您的账户登录过期，请退出重新登录！')
			}
		},
		error: function(error) {
			console.log(error)
		}
	})

}
//省电模式绘图数据处理2019-05-08
function setDataToEchart(DataResp) {

	console.log("==========TTTTTTTTTTTTT====" + strSensorType)

	// if (strSensorType == 'V') {
	var strChart = '<div class="chart_qushiClass" id="chartQushi" style="background-color:yellow;"';
	strChart += '></div>';
	$("#qiushitu").append(strChart);


	var eachData = DataResp;
	var strInstally = selectObject.install_xy;

	var width = $(window).width();
	var strIDs = '#chartQushi';
	$(strIDs).css("width", width);

	var strPostID = "chartQushi";



	var strLegendX = ''
	if (selectObject.alias_x != undefined) {
		strLegendX = strLegendX + 'X(' + selectObject.alias_x + ')'
	}
	var strLegendY = ''
	if (selectObject.alias_y != undefined) {
		strLegendY = strLegendY + 'Y(' + selectObject.alias_y + ')'
	}
	var strLegendZ = ''
	if (selectObject.alias_z != undefined) {
		strLegendZ = strLegendZ + 'Z(' + selectObject.alias_z + ')'
	}
	var strXYZ = '<div style="text-align:center;padding-top:10px">';
	strXYZ += '<p>' + strLegendX + '<p>';
	strXYZ += '<p>' + strLegendY + '<p>';
	strXYZ += '<p>' + strLegendZ + '<p>';
	strXYZ += '</div>';
	$("#qiushitu").append(strXYZ);
	// var legendData = [strLegendX, strLegendY, strLegendZ, "温度"];
	var legendData = ['X', 'Y', 'Z', "温度"];

	var xData = new Array();
	var xData_x = new Array();
	var xData_y = new Array();
	var xData_z = new Array();
	var xData_t = new Array();
	if (eachData.store_rms_x.list_x.length > 0) {
		xData_x = eachData.store_rms_x.list_x;
	}
	if (eachData.store_rms_y.list_x.length > 0) {
		xData_y = eachData.store_rms_y.list_x;
	}
	if (eachData.store_rms_z.list_x.length > 0) {
		xData_z = eachData.store_rms_z.list_x;
	}
	if (eachData.store_rms_t != undefined) {
		xData_t = eachData.store_rms_t.list_x;
	}

	var elements = [xData_x, xData_y, xData_z, xData_t];
	sort(elements);
	xData = elements[elements.length - 1];


	var xDataArr = new Array();
	for (var j = 0; j < xData.length; j++) {
		var strTime = xData[j].substr(0, 19);
		xDataArr.push(strTime);
	}
	var yDatax = eachData.store_rms_x.list_y;
	var yDatay = eachData.store_rms_y.list_y;
	var yDataz = eachData.store_rms_z.list_y;
	var yDataTeamer = eachData.store_rms_t.list_y;

	var float_Yellow; //预警线
	var float_Orange; //报警线
	if (typeof(eachData.threshold_No) != "undefined") {
		float_Yellow = JSON.parse(eachData.threshold_No).B;
		float_Orange = JSON.parse(eachData.threshold_No).C;
	}

	chart_qushifengfengzhi(strInstally, strPostID, legendData, eachData.store_rms_z.list_x, yDatax, yDatay, yDataz,
		yDataTeamer);
	// }

	/*
		if (strSensorType == 'T') {
			var strChart = '<div class="chart_qushiClass" id="chartQushi"';
			strChart += '></div>';
			$("#qiushitu").append(strChart);

			var eachData = DataResp;
			var strInstally = selectObject.install_xy;

			var width = $(window).width();
			var strIDs = '#chartQushi';
			$(strIDs).css("width", width);

			var strPostID = "chartQushi";

			var legendData = ["X", "Y", "Z", "温度"];
			var xData = new Array();
			var xData_x = new Array();
			var xData_y = new Array();
			var xData_z = new Array();
			var xData_t = new Array();
			if (eachData.store_rms_x.list_x.length > 0) {
				xData_x = eachData.store_rms_x.list_x;
			}
			if (eachData.store_rms_y.list_x.length > 0) {
				xData_y = eachData.store_rms_y.list_x;
			}
			if (eachData.store_rms_z.list_x.length > 0) {
				xData_z = eachData.store_rms_z.list_x;
			}
			if (eachData.store_rms_t != undefined) {
				xData_t = eachData.store_rms_t.list_x;
			}

			var elements = [xData_x, xData_y, xData_z, xData_t];
			sort(elements);
			xData = elements[elements.length - 1];


			var xDataArr = new Array();
			for (var j = 0; j < xData.length; j++) {
				var strTime = xData[j].substr(0, 19);
				xDataArr.push(strTime);
			}
			var yDatax = eachData.store_rms_x.list_y;
			var yDatay = eachData.store_rms_y.list_y;
			var yDataz = eachData.store_rms_z.list_y;
			var yDataTeamer = eachData.store_rms_t.list_y;

			var float_Yellow; //预警线
			var float_Orange; //报警线
			if (typeof(eachData.threshold_No) != "undefined") {
				float_Yellow = JSON.parse(eachData.threshold_No).B;
				float_Orange = JSON.parse(eachData.threshold_No).C;
			}

			chart_qushifengfengzhi(strInstally, strPostID, legendData, eachData.store_rms_z.list_x, yDataTeamer);
		}
	//*/

}

function sort(elements) {
	for (var i = 0; i < elements.length - 1; i++) {
		for (var j = 0; j < elements.length - i - 1; j++) {
			if (elements[j].length > elements[j + 1].length) {
				var swap = elements[j];
				elements[j] = elements[j + 1];
				elements[j + 1] = swap;
			}
		}
	}
}
//省电模式绘图2019-05-08
function chart_qushifengfengzhi(strTile, strPostID, legendData, xData, yDatax, yDatay, yDataz, yDataTeamer) {

	///*
	var option_fengfengzhi = {
		title: {
			text: strTile + '总振值,温度趋势图',
			left: 'center'
		},

		legend: {
			data: legendData,
			left: 'center',
			top: 30,
			// show:false
		},
		tooltip: {
			trigger: 'axis',
			position: function(pos, params, dom, rect, size) {
				var obj = {
					top: 180
				};
				obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
				return obj;
			},
			triggerOn: 'click',
			formatter: '{a0}:{c0} m/s²<br />{a1}: {c1} m/s²<br />{a2}: {c2} m/s²<br />{a3}: {c3} ℃'
		},
		xAxis: {
			axisLine: {
				onZero: false
			},
			type: 'category',
			data: xData,
			axisLabel: {
				rotate: 45
			},
			inverse: true

		},
		yAxis: [{
			type: 'value',
			name: 'RMS:m/s²',
			splitLine: {
				show: false
			},
			nameLocation: 'middle',
			nameGap: 45,
			nameTextStyle: {
				color: 'blue'
			}
		}, {
			type: 'value',
			name: '温度:℃',
			splitLine: {
				show: false
			},
			nameLocation: 'middle',
			nameGap: 30,
			nameTextStyle: {
				color: 'orange'
			}
		}],

		grid: {
			left: '17%',
			right: '15%',
			bottom: '37%',
			// top: '30%'
		},
		dataZoom: {
			type: 'inside',
			show: true,
			start: 0,
			end: 100
		},
		series: [{
				name: legendData[0],
				data: yDatax,
				type: 'line',
				symbolSize: 4,
				symbol: 'circle',
				lineStyle: {
					width: 0.5,
					color: 'green'
				},
				itemStyle: {
					normal: {
						borderWidth: 0.5,
						borderColor: 'green',
						color: 'green'
					}
				},
				inverse: true,
				animation: false
			},
			{
				name: legendData[1],
				data: yDatay,
				type: 'line',
				symbolSize: 4,
				symbol: 'roundRect',
				lineStyle: {
					width: 0.5,
					color: '#5cc0d6'
				},
				itemStyle: {
					normal: {
						borderWidth: 0.5,
						borderColor: '#5cc0d6',
						color: '#5cc0d6'
					}
				},
				inverse: true,
				animation: false
			},
			{
				name: legendData[2],
				data: yDataz,
				type: 'line',
				symbolSize: 4,
				symbol: 'triangle',
				lineStyle: {
					width: 0.5,
					color: '#0000FF'
				},
				itemStyle: {
					normal: {
						borderWidth: 0.5,
						borderColor: 'blue',
						color: 'blue'
					}
				},
				inverse: true,
				animation: false
			},
			{
				name: "温度",
				data: yDataTeamer,
				type: 'line',
				symbolSize: 4,
				symbol: 'diamond',
				yAxisIndex: 1,
				lineStyle: {
					width: 0.5,
					color: '#eb1958'
				},
				itemStyle: {
					normal: {
						borderWidth: 0.5,
						borderColor: '#eb1958',
						color: '#eb1958'
					}
				},
				inverse: true,
				animation: false
			}
		]
	};
	var fengfengzhiChart = echarts.init(document.getElementById(strPostID))
	fengfengzhiChart.setOption(option_fengfengzhi);

}

//省电模式绘图2019-05-08
function chart_qushiShengdianTemperter(strTile, strPostID, legendData, xData, yDataTeamer) {

	///*
	var option_fengfengzhi = {
		title: {
			text: strTile + '温度趋势图',
			left: 'center'
		},

		legend: {
			data: legendData,
			left: 'center',
			top: 30
		},
		tooltip: {
			trigger: 'axis',
			position: function(pos, params, dom, rect, size) {
				var obj = {
					top: 180
				};
				obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
				return obj;
			},
			triggerOn: 'click',
			formatter: '{a0}:{c0} ℃'
		},
		xAxis: {
			axisLine: {
				onZero: false
			},
			type: 'category',
			data: xData,
			axisLabel: {
				rotate: 45
			},
			inverse: true

		},
		yAxis: {
			type: 'value',
			name: '温度:℃',
			splitLine: {
				show: false,
			}
		},
		grid: {
			left: '17%',
			right: '15%',
			bottom: '37%'
		},
		dataZoom: {
			type: 'inside',
			show: true,
			start: 0,
			end: 100
		},
		series: [{
			name: "温度",
			data: yDataTeamer,
			type: 'line',
			symbolSize: 4,
			symbol: 'diamond',
			yAxisIndex: 1,
			lineStyle: {
				width: 0.5,
				color: '#eb1958'
			},
			itemStyle: {
				normal: {
					borderWidth: 0.5,
					borderColor: '#eb1958',
					color: '#eb1958'
				}
			},
			inverse: true,
			animation: false
		}]
	};
	var fengfengzhiChart = echarts.init(document.getElementById(strPostID))
	fengfengzhiChart.setOption(option_fengfengzhi);

}


//长连接模式获取数据
function longChartsGetData(showType) {
	$("#qiushitu").empty();
	$.ajax({
		type: 'get',
		url: new_commen_gain_trend_chart_install_long_Interface,
		async: true,
		data: {
			install_id: selectObject.id,
			devices_no: localStorage.DeveciId,
			show_type: showType
		},
		dataType: 'json',
		success: function(response) {
			if (response.status == "SUCCESS") {
				setEleForLongModel(response.data)
			}
			if (response.status == 'ILLEGAL') {
				mui.alert('您的账户登录过期，请退出重新登录！')
			}

		},
		error: function(error) {
			console.log(error)
		}
	})

}

function setEleForLongModel(valueData) {
	for (var keyItem in valueData) {

		var array_x = new Array()
		var array_y = new Array()

		var simWorkModeLongVO = {}
		if (valueData.simWorkModeLongVO != undefined) {
			simWorkModeLongVO = valueData.simWorkModeLongVO
		}
		var strYJ = '--'
		var strGJ = '--'
		var strDanger = '--'

		console.log("===RRRRR====" + strSensorType)

		if (strSensorType == 'V') {
			if (keyItem == 'store_rms_x') {
				console.log("alarm-on-of===" + JSON.stringify(simWorkModeLongVO))


				if (simWorkModeLongVO.alarm_on_off != undefined && simWorkModeLongVO.alarm_on_off == 1) {
					if (simWorkModeLongVO.threshold_early_x != undefined) {
						strYJ = simWorkModeLongVO.threshold_early_x
					}
					if (simWorkModeLongVO.threshold_alarm_x != undefined) {
						strGJ = simWorkModeLongVO.threshold_alarm_x
					}
					if (simWorkModeLongVO.threshold_danger_x != undefined) {
						strDanger = simWorkModeLongVO.threshold_danger_x
					}
					// if (simWorkModeLongVO.threshold_early_x != undefined && simWorkModeLongVO.threshold_alarm_x != undefined &&
					// simWorkModeLongVO.threshold_danger_x != undefined) {



					// var strNumber =
					// 	"<div style='margin-top:15px;background-color:white;'>\
					// <p style='padding-top:5px'>\
					// <span></span>\
					// <span style='color:#88d807'>预警值:" +
					// 	strYJ +
					// 	" (mm/s)</span>\
					// <span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
					// 	" (mm/s)</span>\
					// <span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
					// 	" (mm/s)</span>\
					// </p></div>";
					// $('#qiushitu').append(strNumber)
					
					
					var strNumber =
						"<div style='margin-top:15px;padding-top:5px;background-color:white;height:50px;width:100%;'>\
					<table style='width:100%;'><tr><td>预警值</td><td>告警值</td><td>危险值</td></tr>\
					<tr><td>"+strYJ+"(mm/s)</td>\
					<td>"+strGJ+"(mm/s)</td>\
					<td>"+strDanger+"(mm/s)</td></tr>\
					</table></div>";
					$('#qiushitu').append(strNumber);

					// }

				}

				var strChart = '<div class="chart_qushiClass" id="chartLong_' + keyItem + '"';
				strChart += '></div>';
				$("#qiushitu").append(strChart);

				var chartTitle = "X轴振动趋势图"
				if (selectObject.alias_z != undefined) {
					chartTitle = "X轴(" + selectObject.alias_x + ")振动趋势图"
				}
				array_x = valueData[keyItem].list_x
				array_y = valueData[keyItem].list_y
				var chartID = "chartLong_" + keyItem

				setChartLong(chartID, chartTitle, array_x, array_y, 'mm/s', strYJ, strGJ, strDanger)
			}
			if (keyItem == 'store_rms_y') {

				if (simWorkModeLongVO.alarm_on_off != undefined && simWorkModeLongVO.alarm_on_off == "1") {
					if (simWorkModeLongVO.threshold_early_y != undefined) {
						strYJ = simWorkModeLongVO.threshold_early_y
					}
					if (simWorkModeLongVO.threshold_alarm_y != undefined) {
						strGJ = simWorkModeLongVO.threshold_alarm_y
					}
					if (simWorkModeLongVO.threshold_danger_y != undefined) {
						strDanger = simWorkModeLongVO.threshold_danger_y
					}
					// if (simWorkModeLongVO.threshold_early_y != undefined && simWorkModeLongVO.threshold_alarm_y != undefined &&
					// simWorkModeLongVO.threshold_danger_y != undefined) {
					// var strNumber =
					// 	"<div style='margin-top:15px;background-color:white;'>\
					// <p style='padding-top:5px'>\
					// <span></span>\
					// <span style='color:#88d807'>预警值:" +
					// 	strYJ +
					// 	" (mm/s)</span>\
					// <span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
					// 	" (mm/s)</span>\
					// <span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
					// 	" (mm/s)</span>\
					// </p></div>";
					// $('#qiushitu').append(strNumber)
					
					var strNumber =
						"<div style='margin-top:15px;padding-top:5px;background-color:white;height:50px;width:100%;'>\
					<table style='width:100%'><tr><td>预警值</td><td>告警值</td><td>危险值</td></tr>\
					<tr><td>"+strYJ+"(mm/s)</td>\
					<td>"+strGJ+"(mm/s)</td>\
					<td>"+strDanger+"(mm/s)</td></tr>\
					</table></div>";
					$('#qiushitu').append(strNumber);

					// }

				}

				var strChart = '<div class="chart_qushiClass" id="chartLong_' + keyItem + '"';
				strChart += '></div>';
				$("#qiushitu").append(strChart);

				var chartTitle = "Y轴振动趋势图"
				if (selectObject.alias_z != undefined) {
					chartTitle = "Y轴(" + selectObject.alias_y + ")振动趋势图"
				}
				array_x = valueData[keyItem].list_x
				array_y = valueData[keyItem].list_y
				var chartID = "chartLong_" + keyItem

				setChartLong(chartID, chartTitle, array_x, array_y, 'mm/s', strYJ, strGJ, strDanger)
			}
			if (keyItem == 'store_rms_z') {

				if (simWorkModeLongVO.alarm_on_off != undefined && simWorkModeLongVO.alarm_on_off == "1") {
					if (simWorkModeLongVO.threshold_early_z != undefined) {
						strYJ = simWorkModeLongVO.threshold_early_z
					}
					if (simWorkModeLongVO.threshold_alarm_z != undefined) {
						strGJ = simWorkModeLongVO.threshold_alarm_z
					}
					if (simWorkModeLongVO.threshold_danger_z != undefined) {
						strDanger = simWorkModeLongVO.threshold_danger_z
					}
					// if (simWorkModeLongVO.threshold_early_z != undefined && simWorkModeLongVO.threshold_alarm_z != undefined &&
					// simWorkModeLongVO.threshold_danger_z != undefined) {
					// var strNumber =
					// 	"<div style='margin-top:15px;background-color:white;'>\
					// <p style='padding-top:5px'>\
					// <span></span>\
					// <span style='color:#88d807'>预警值:" +
					// 	strYJ +
					// 	" (mm/s)</span>\
					// <span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
					// 	" (mm/s)</span>\
					// <span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
					// 	" (mm/s)</span>\
					// </p></div>";
					// $('#qiushitu').append(strNumber)
					
					var strNumber =
						"<div style='margin-top:15px;padding-top:5px;background-color:white;height:50px;width:100%;'>\
					<table style='width:100%'><tr><td>预警值</td><td>告警值</td><td>危险值</td></tr>\
					<tr><td>"+strYJ+"(mm/s)</td>\
					<td>"+strGJ+"(mm/s)</td>\
					<td>"+strDanger+"(mm/s)</td></tr>\
					</table></div>";
					$('#qiushitu').append(strNumber);

					// }

				}


				var strChart = '<div class="chart_qushiClass" id="chartLong_' + keyItem + '"';
				strChart += '></div>';
				$("#qiushitu").append(strChart);


				var chartTitle = "Z轴振动趋势图"
				if (selectObject.alias_z != undefined) {
					chartTitle = "Z轴(" + selectObject.alias_z + ")振动趋势图"
				}


				array_x = valueData[keyItem].list_x
				array_y = valueData[keyItem].list_y
				var chartID = "chartLong_" + keyItem

				setChartLong(chartID, chartTitle, array_x, array_y, 'mm/s', strYJ, strGJ, strDanger)
			}

		}

		if (keyItem == 'store_rms_t') {

			if (simWorkModeLongVO.alarm_on_off != undefined && simWorkModeLongVO.alarm_on_off == "1") {
				if (simWorkModeLongVO.threshold_temperature_early != undefined) {
					strYJ = simWorkModeLongVO.threshold_temperature_early
				}
				if (simWorkModeLongVO.threshold_temperature != undefined) {
					strGJ = simWorkModeLongVO.threshold_temperature
				}
				if (simWorkModeLongVO.threshold_temperature_danger != undefined) {
					strDanger = simWorkModeLongVO.threshold_temperature_danger
				}
				// if (simWorkModeLongVO.threshold_temperature_early != undefined && simWorkModeLongVO.threshold_temperature !=
				// undefined &&
				// simWorkModeLongVO.threshold_temperature_danger != undefined) {
				// var strNumber =
				// 	"<div style='margin-top:15px;background-color:white;'>\
				// 	<p style='padding-top:5px'>\
				// 	<span></span>\
				// 	<span style='color:#88d807'>预警值:" +
				// 	strYJ +
				// 	" (℃)</span>\
				// 	<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
				// 	" (℃)</span>\
				// 	<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
				// 	" (℃)</span>\
				// 	</p></div>";
				// $('#qiushitu').append(strNumber)
				
				var strNumber =
					"<div style='margin-top:15px;padding-top:5px;background-color:white;height:50px;width:100%;'>\
				<table style='width:100%'><tr><td>预警值</td><td>告警值</td><td>危险值</td></tr>\
				<tr><td>"+strYJ+" (℃)</td>\
				<td>"+strGJ+" (℃)</td>\
				<td>"+strDanger+" (℃)</td></tr>\
				</table></div>";
				$('#qiushitu').append(strNumber);

				// }

			}

			var strChart = '<div class="chart_qushiClass" id="chartLong_' + keyItem + '"';
			strChart += '></div>';
			$("#qiushitu").append(strChart);

			var chartTitle = "温度趋势图"
			array_x = valueData[keyItem].list_x
			array_y = valueData[keyItem].list_y
			var chartID = "chartLong_" + keyItem

			setChartLong(chartID, chartTitle, array_x, array_y, '℃', strYJ, strGJ, strDanger)
		}
	}
}

function setChartLong(strLongChartID, strTitle, dataXHeng, dataYZong, YName, markLineData, strMarkLine_alerm,
	strMarkLine_denger) {

	var option_long = {
		title: {
			text: strTitle,
			left: 'center',
		},
		backgroundColor: 'white',
		tooltip: {
			trigger: 'axis',
			position: function(pos, params, dom, rect, size) {
				// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
				var obj = {
					top: 180
				};
				obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
				return obj;
			},
			triggerOn: 'click',
			formatter: '{b0}<br/>{c0} ' + YName
		},
		dataZoom: {
			type: 'inside',
			show: true,
			start: 0,
			end: 100
		},
		xAxis: {
			type: 'category',
			data: dataXHeng,
			axisLabel: {
				rotate: 45
			},
			inverse: true
		},
		grid: {
			left: '17%',
			right: '15%',
			bottom: '37%'
		},
		yAxis: {
			type: 'value',
			name: YName
		},
		series: [{
			data: dataYZong,
			type: 'line',
			lineStyle: {
				color: '#5692E8',
				width: '1'
			},
			inverse: true,
			markLine: {
				symbol: 'none',
				silent: true,
				data: [{
						yAxis: markLineData,
						lineStyle: {
							type: 'solid',
							color: '#88d807'
						},
						label: {
							position: 'start'
						}
					},
					{
						yAxis: strMarkLine_alerm,
						lineStyle: {
							type: 'solid',
							color: '#d89e07'
						},
						label: {
							position: 'start'
						}
					},
					{
						yAxis: strMarkLine_denger,
						lineStyle: {
							type: 'solid',
							color: '#d83b53'
						},
						label: {
							position: 'start'
						}
					}
				]
			}
		}]
	}
	var longCharts = echarts.init(document.getElementById(strLongChartID))
	longCharts.setOption(option_long)
}

$('#realTime').on('tap', function() {
	$('#realTime').removeClass('unselectButton');
	$('#realTime').addClass('selectButton');

	$('#selHour').removeClass('selectButton');
	$('#selHour').addClass('unselectButton');

	$('#selDay').removeClass('selectButton');
	$('#selDay').addClass('unselectButton');

	$('#selMonth').removeClass('selectButton');
	$('#selMonth').addClass('unselectButton');

	$('#selYear').removeClass('selectButton');
	$('#selYear').addClass('unselectButton');
	strShowType = 4

	$('#selTimeIDs').hide();

	// longChartsGetData(strShowType)
})

$('#selHour').on('tap', function() {
	$('#selHour').removeClass('unselectButton');
	$('#selHour').addClass('selectButton');

	$('#realTime').removeClass('selectButton');
	$('#realTime').addClass('unselectButton');

	$('#selDay').removeClass('selectButton');
	$('#selDay').addClass('unselectButton');

	$('#selMonth').removeClass('selectButton');
	$('#selMonth').addClass('unselectButton');

	$('#selYear').removeClass('selectButton');
	$('#selYear').addClass('unselectButton');
	strShowType = 0
	$('#selTimeIDs').show();
	document.getElementById('selectTimes').innerHTML = "请选择查询时间";
	// longChartsGetData(strShowType)
})
$('#selDay').on('tap', function() {
	$('#selHour').removeClass('selectButton');
	$('#selHour').addClass('unselectButton');

	$('#realTime').removeClass('selectButton');
	$('#realTime').addClass('unselectButton');

	$('#selDay').removeClass('unselectButton');
	$('#selDay').addClass('selectButton');

	$('#selMonth').removeClass('selectButton');
	$('#selMonth').addClass('unselectButton');

	$('#selYear').removeClass('selectButton');
	$('#selYear').addClass('unselectButton');
	strShowType = 1
	$('#selTimeIDs').show();
	document.getElementById('selectTimes').innerHTML = "请选择查询时间";
	// longChartsGetData(strShowType)
})
$('#selMonth').on('tap', function() {
	$('#selHour').removeClass('selectButton');
	$('#selHour').addClass('unselectButton');

	$('#realTime').removeClass('selectButton');
	$('#realTime').addClass('unselectButton');

	$('#selDay').removeClass('selectButton');
	$('#selDay').addClass('unselectButton');

	$('#selMonth').removeClass('unselectButton');
	$('#selMonth').addClass('selectButton');

	$('#selYear').removeClass('selectButton');
	$('#selYear').addClass('unselectButton');
	strShowType = 2
	$('#selTimeIDs').show();
	document.getElementById('selectTimes').innerHTML = "请选择查询时间";
	// longChartsGetData(strShowType)
})
$('#selYear').on('tap', function() {
	$('#selHour').removeClass('selectButton');
	$('#selHour').addClass('unselectButton');

	$('#selDay').removeClass('selectButton');
	$('#selDay').addClass('unselectButton');

	$('#selMonth').removeClass('selectButton');
	$('#selMonth').addClass('unselectButton');

	$('#selYear').removeClass('unselectButton');
	$('#selYear').addClass('selectButton');
	strShowType = 3
	$('#selTimeIDs').show();
	document.getElementById('selectTimes').innerHTML = "请选择查询时间";
	// longChartsGetData(strShowType)
})



//选择时间
$('#selectTimes').on('tap', function() {
	
	//单位，小时
	if (strShowType == 0) {

		var dtpicker = new mui.DtPicker({
			type: 'hour'
		});
		dtpicker.show(function(items) {
			console.log("===============times====" + JSON.stringify(items))
			strQueryTime = items.text
			document.getElementById('selectTimes').innerHTML = items.y.text + '年' + items.m.text + '月' + items.d.text + '日' + items.h.text + '时';
		})
	}
	//单位，天
	else if (strShowType == 1) {
		var dtpicker = new mui.DtPicker({
			type: 'date'
		});
		dtpicker.show(function(items) {
			console.log("===============times====" + JSON.stringify(items))
			strQueryTime = items.text
			document.getElementById('selectTimes').innerHTML = items.y.text + '年' + items.m.text + '月' + items.d.text + '日';
		})
	}
	//单位，月
	else if (strShowType == 2) {
		var dtpicker = new mui.DtPicker({
			type: 'month'
		});
		dtpicker.show(function(items) {
			console.log("===============times====" + JSON.stringify(items))
			strQueryTime = items.text
			document.getElementById('selectTimes').innerHTML = items.y.text + '年' + items.m.text + '月';
		})
	}
	//单位，年
	else if (strShowType == 3) {
		var dtpicker = new mui.DtPicker({
			type: 'hour'
		});
		dtpicker.show(function(items) {
			console.log("===============times====" + JSON.stringify(items))
			strQueryTime = items.text
			document.getElementById('selectTimes').innerHTML = items.y.text + '年' + items.m.text + '月' + items.d.text + '日' + items.h.text + '时';;
		})
	}
	
})

function refreshQushiCharts() {
	if (selectObject.connect_model == 0) {
		getChartDataWithInstall()
	}
	if (selectObject.connect_model == 1) {
		longChartsGetData(strShowType)
	}
}


//********************* 长连接、省电模式选择，点击取消，隐藏弹出菜单
$('#cancelshortOrLongSheet').on('tap', function() {
	mui('#shortOrLongSheet').popover('toggle');
})
//长连接模式
$('#shortOrLongLong').on('tap', function() {
	mui('#shortOrLongSheet').popover('toggle');

	document.getElementById("qushiModel").innerHTML = '长连接模式';
})
//省电模式
$('#shortOrLongShort').on('tap', function() {
	mui('#shortOrLongSheet').popover('toggle');
	document.getElementById("qushiModel").innerHTML = '省电模式';
})

//********************* 选择速度有效值或加速度有效值，算法类型，点击取消，隐藏弹出菜单
$('#cancelalgorithm').on('tap', function() {
	mui('#algorithmType').popover('toggle');
})
//加速度有效值
$('#algorithm1').on('tap', function() {
	mui('#algorithmType').popover('toggle');
	document.getElementById("selDeepType").innerHTML = '加速度有效值';
})
//速度有效值
$('#algorithm2').on('tap', function() {
	mui('#algorithmType').popover('toggle');
	document.getElementById("selDeepType").innerHTML = '速度有效值';
})

/*
var menuWrapper = document.getElementById('menu-wrapper');
var menu = document.getElementById('menu');
var menuWrapperClassList = menuWrapper.classList;
document.getElementById('queryClicked').addEventListener('tap', toggleMenu);
var busying = false;
var backdrop = document.getElementById("menu-backdrop");
backdrop.addEventListener('tap', toggleMenu);

function toggleMenu() {
	if (busying) {
		return;
	}
	busying = true;
	if (menuWrapperClassList.contains('mui-active')) {
		document.body.classList.remove('menu-open');
		menuWrapper.className = 'menu-wrapper fade-out-up animated';
		menu.className = 'menu bounce-out-up animated';
		setTimeout(function() {
			backdrop.style.opacity = 0;
			menuWrapper.classList.add('hidden');
		}, 500);
	} else {
		document.body.classList.add('menu-open');
		menuWrapper.className = 'menu-wrapper fade-in-down animated mui-active';
		menu.className = 'menu bounce-in-down animated';
		backdrop.style.opacity = 1;
	}
	setTimeout(function() {
		busying = false;
	}, 500);
}


document.getElementById('screenCancel').addEventListener('tap', toggleMenu);
document.getElementById('screenOK').addEventListener('tap', beginQueryClicked);
//*/
document.getElementById('screenOK').addEventListener('tap', beginQueryClicked);

function beginQueryClicked (){
	console.log("开始查询数据====")
	// toggleMenu();
}
