//2019-05-08
var installArrayList = new Array()
var selectObject = new Object()
//2019-05-08
getDeviceInstallActiveList()
var strShowType = 0
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
		var objPickerData = {
			value: installArrayList[i].id,
			text: installArrayList[i].install_xy,
			connect_model: installArrayList[i].connect_model,
			alias_x: installArrayList[i].alias_x,
			alias_y: installArrayList[i].alias_y,
			alias_z: installArrayList[i].alias_z,
		}
		newUserPickerData.push(objPickerData)
	}
	userPicker.setData(newUserPickerData);
	userPicker.show(function(items) {
		$("#qushiChartSelected").html(items[0].text);

		selectObject = {
			id: items[0].value,
			install_xy: items[0].text,
			connect_model: items[0].connect_model,
			alias_x: items[0].alias_x,
			alias_y: items[0].alias_y,
			alias_z: items[0].alias_z,
		}


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
			console.log("++++++=====" + JSON.stringify(response))

			if (response.status == "SUCCESS") {
				setDataToEchart(response.data)
			}

		},
		error: function(error) {
			console.log(error)
		}
	})

}
//省电模式绘图数据处理2019-05-08
function setDataToEchart(DataResp) {

	//	$("#qiushitu").remove();
	console.log("===============")

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

	chart_qushifengfengzhi(strInstally, strPostID, legendData, eachData.store_rms_z.list_x, yDatax, yDatay, yDataz,
		yDataTeamer);


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
			}
		}, {
			type: 'value',
			name: '温度:℃',
			splitLine: {
				show: false
			}
		}],

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
				name: "X",
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
				name: "Y",
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
				name: "Z",
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

		},
		error: function(error) {
			console.log(error)
		}
	})

}

function setEleForLongModel(valueData) {
	for (var keyItem in valueData) {

		// var strLast = keyItem.charAt(keyItem.length - 1)

		var array_x = new Array()
		var array_y = new Array()
		var simWorkModeLongVO = valueData.simWorkModeLongVO
		var strYJ = '--'
		var strGJ = '--'
		var strDanger = '--'


		if (keyItem == 'store_rms_x') {

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
				if (simWorkModeLongVO.threshold_early_x != undefined && simWorkModeLongVO.threshold_alarm_x != undefined &&
					simWorkModeLongVO.threshold_danger_x != undefined) {
						
					var strNumber =
						"<div style='margin-top:15px;'>\
					<p style='margin-top:-10px'>\
					<span></span>\
					<span style='color:#88d807'>预警值:" + strYJ +
						" (mm/s)</span>\
					<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
						" (mm/s)</span>\
					<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
						" (mm/s)</span>\
					</p></div>";
					$('#qiushitu').append(strNumber)

				}

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
				if (simWorkModeLongVO.threshold_alarm_y!= undefined) {
					strGJ = simWorkModeLongVO.threshold_alarm_y
				}
				if (simWorkModeLongVO.threshold_danger_y != undefined) {
					strDanger = simWorkModeLongVO.threshold_danger_y
				}
				if (simWorkModeLongVO.threshold_early_y != undefined && simWorkModeLongVO.threshold_alarm_y != undefined &&
					simWorkModeLongVO.threshold_danger_y != undefined) {
					var strNumber =
						"<div style='margin-top:15px;'>\
					<p style='margin-top:-10px'>\
					<span></span>\
					<span style='color:#88d807'>预警值:" + strYJ +
						" (mm/s)</span>\
					<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
						" (mm/s)</span>\
					<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
						" (mm/s)</span>\
					</p></div>";
					$('#qiushitu').append(strNumber)
			
				}
			
			}
			
/*
			var bolMarkLine = false

			if (simWorkModeLongVO.threshold_early_y != undefined) {
				strYJ = simWorkModeLongVO.threshold_early_y
			} else {
				strYJ = '--'
			}
			if (simWorkModeLongVO.threshold_alarm_y != undefined) {
				strGJ = simWorkModeLongVO.threshold_alarm_y
			} else {
				strGJ = "--"
			}
			if (simWorkModeLongVO.threshold_danger_y != undefined) {
				strDanger = simWorkModeLongVO.threshold_danger_y
			} else {
				strDanger = '--'
			}

			if (simWorkModeLongVO.threshold_early_y != undefined && simWorkModeLongVO.threshold_early_y != undefined &&
				simWorkModeLongVO.threshold_early_y != undefined) {
				var strNumber =
					"<div style='margin-top:15px;'>\
					<p>X轴(" + selectObject.alias_y +
					")</p>\
					<p style='margin-top:-10px'>\
					<span></span>\
					<span style='color:#88d807'>预警值:" + strYJ +
					" (mm/s)</span>\
					<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
					" (mm/s)</span>\
					<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
					" (mm/s)</span>\
					</p></div>";
				$('#qiushitu').append(strNumber)
				bolMarkLine = true

			}

			// 			strYJ = simWorkModeLongVO.threshold_early_y
			// 			strGJ = simWorkModeLongVO.threshold_alarm_y
			// 			strDanger = simWorkModeLongVO.threshold_danger_y
			// 			var strNumber =
			// 				"<div style='margin-top:15px;'>\
			// 				<p>Y轴("+selectObject.alias_y+")</p>\
			// 				<p style='margin-top:-10px'>\
			// 				<span></span>\
			// 				<span style='color:#88d807'>预警值:"+strYJ+" (mm/s)</span>\
			// 				<span style='margin-left:3px;color:#d89e07'>告警值:"+strGJ+" (mm/s)</span>\
			// 				<span style='margin-left:3px;color:#d83b53'>危险值:"+strDanger+" (mm/s)</span>\
			// 				</p></div>";
			// 			$('#qiushitu').append(strNumber)
			
			//*/
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
				if (simWorkModeLongVO.threshold_alarm_z!= undefined) {
					strGJ = simWorkModeLongVO.threshold_alarm_z
				}
				if (simWorkModeLongVO.threshold_danger_z != undefined) {
					strDanger = simWorkModeLongVO.threshold_danger_z
				}
				if (simWorkModeLongVO.threshold_early_z != undefined && simWorkModeLongVO.threshold_alarm_z != undefined &&
					simWorkModeLongVO.threshold_danger_z != undefined) {
					var strNumber =
						"<div style='margin-top:15px;'>\
					<p style='margin-top:-10px'>\
					<span></span>\
					<span style='color:#88d807'>预警值:" + strYJ +
						" (mm/s)</span>\
					<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
						" (mm/s)</span>\
					<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
						" (mm/s)</span>\
					</p></div>";
					$('#qiushitu').append(strNumber)
			
				}
			
			}
			

// 			if (simWorkModeLongVO.threshold_early_z != undefined) {
// 				strYJ = simWorkModeLongVO.threshold_early_z
// 			} else {
// 				strYJ = '--'
// 			}
// 			if (simWorkModeLongVO.threshold_alarm_z != undefined) {
// 				strGJ = simWorkModeLongVO.threshold_alarm_z
// 			} else {
// 				strGJ = "--"
// 			}
// 			if (simWorkModeLongVO.threshold_danger_z != undefined) {
// 				strDanger = simWorkModeLongVO.threshold_danger_z
// 			} else {
// 				strDanger = '--'
// 			}
// 
// 			if (simWorkModeLongVO.threshold_early_z != undefined && simWorkModeLongVO.threshold_early_z != undefined &&
// 				simWorkModeLongVO.threshold_early_z != undefined) {
// 				var strNumber =
// 					"<div style='margin-top:15px;'>\
// 					<p>Z轴(" + selectObject.alias_z +
// 					")</p>\
// 					<p style='margin-top:-10px'>\
// 					<span></span>\
// 					<span style='color:#88d807'>预警值:" + strYJ +
// 					" (mm/s)</span>\
// 					<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
// 					" (mm/s)</span>\
// 					<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
// 					" (mm/s)</span>\
// 					</p></div>";
// 				$('#qiushitu').append(strNumber)
// 
// 			}
// 
			// 			strYJ = simWorkModeLongVO.threshold_early_z
			// 			strGJ = simWorkModeLongVO.threshold_alarm_z
			// 			strDanger = simWorkModeLongVO.threshold_danger_z
			// 			var strNumber =
			// 				"<div style='margin-top:15px;'>\
			// 				<p>Z轴(" + selectObject.alias_z +
			// 				")</p>\
			// 				<p style='margin-top:-10px'>\
			// 				<span></span>\
			// 				<span style='color:#88d807'>预警值:" + strYJ +
			// 				" (mm/s)</span>\
			// 				<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
			// 				" (mm/s)</span>\
			// 				<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
			// 				" (mm/s)</span>\
			// 				</p></div>";
			// 			$('#qiushitu').append(strNumber)

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
		if (keyItem == 'store_rms_t') {
			
			if (simWorkModeLongVO.alarm_on_off != undefined && simWorkModeLongVO.alarm_on_off == "1") {
				if (simWorkModeLongVO.threshold_temperature_early != undefined) {
					strYJ = simWorkModeLongVO.threshold_temperature_early
				}
				if (simWorkModeLongVO.threshold_temperature!= undefined) {
					strGJ = simWorkModeLongVO.threshold_temperature
				}
				if (simWorkModeLongVO.threshold_temperature_danger != undefined) {
					strDanger = simWorkModeLongVO.threshold_temperature_danger
				}
				if (simWorkModeLongVO.threshold_temperature_early != undefined && simWorkModeLongVO.threshold_temperature != undefined &&
					simWorkModeLongVO.threshold_temperature_danger != undefined) {
					var strNumber =
						"<div style='margin-top:15px;'>\
					<p style='margin-top:-10px'>\
					<span></span>\
					<span style='color:#88d807'>预警值:" + strYJ +
						" (℃)</span>\
					<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
						" (℃)</span>\
					<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
						" (℃)</span>\
					</p></div>";
					$('#qiushitu').append(strNumber)
			
				}
			
			}
			

// 			if (simWorkModeLongVO.threshold_temperature_early != undefined) {
// 				strYJ = simWorkModeLongVO.threshold_temperature_early
// 			} else {
// 				strYJ = '--'
// 			}
// 			if (simWorkModeLongVO.threshold_temperature != undefined) {
// 				strGJ = simWorkModeLongVO.threshold_temperature
// 			} else {
// 				strGJ = "--"
// 			}
// 			if (simWorkModeLongVO.threshold_temperature_danger != undefined) {
// 				strDanger = simWorkModeLongVO.threshold_temperature_danger
// 			} else {
// 				strDanger = '--'
// 			}
// 
// 			if (simWorkModeLongVO.threshold_temperature_early != undefined && simWorkModeLongVO.threshold_temperature !=
// 				undefined &&
// 				simWorkModeLongVO.threshold_temperature_danger != undefined) {
// 				var strNumber =
// 					"<div style='margin-top:15px;'>\
// 					<p>温度</p>\
// 					<p style='margin-top:-10px'>\
// 					<span></span>\
// 					<span style='color:#88d807'>预警值:" +
// 					strYJ +
// 					" (℃)</span>\
// 					<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
// 					" (℃)</span>\
// 					<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger +
// 					" (℃)</span>\
// 					</p></div>";
// 				$('#qiushitu').append(strNumber)
// 
// 			}

			// 			strYJ = simWorkModeLongVO.threshold_temperature_early
			// 			strGJ = simWorkModeLongVO.threshold_temperature
			// 			strDanger = simWorkModeLongVO.threshold_temperature_danger
			// 			var strNumber =
			// 				"<div style='margin-top:15px;'>\
			// 				<p>温度</p>\
			// 				<p style='margin-top:-10px'>\
			// 				<span></span>\
			// 				<span style='color:#88d807'>预警值:" +
			// 				strYJ + " (℃)</span>\
			// 				<span style='margin-left:3px;color:#d89e07'>告警值:" + strGJ +
			// 				" (℃)</span>\
			// 				<span style='margin-left:3px;color:#d83b53'>危险值:" + strDanger + " (℃)</span>\
			// 				</p></div>";
			// 			$('#qiushitu').append(strNumber)


			var strChart = '<div class="chart_qushiClass" id="chartLong_' + keyItem + '"';
			strChart += '></div>';
			$("#qiushitu").append(strChart);

			var chartTitle = "温度趋势图"
			array_x = valueData[keyItem].list_x
			array_y = valueData[keyItem].list_y
			var chartID = "chartLong_" + keyItem

			setChartLong(chartID, chartTitle, array_x, array_y, '℃', strYJ, strGJ, strDanger)
		}







		// 		var strChart = '<div class="chart_qushiClass" id="chartLong_'+i+'"';
		// 		
		// 		strChart += '></div>';
		// 		
		// 		$("#qiushitu").append(strChart);
	}




	/*
	var objRms = valueData.simWorkModeLongVO
	var titleStart = valueData.install_xy
	
	for (var keyItem in objRms) {
		
		console.log("11111111111111111111111==" + keyItem)
		
		//图表的title ---- y轴单位
		var titleType = keyItem.charAt(keyItem.length - 1)
		var chartTitle = ''
		var titleOfY = ''
		var strCounts = ''
		//MarkLine 标线值
		var strMarkLine = ''
		var strMarkLine_alerm = ''
		var strMarkLine_denger = ''
		if (titleType == 't') {
			strCounts = titleStart + '温度'
			chartTitle = titleStart + '温度趋势图'
			titleOfY = "℃"
			strMarkLine = valueData[i]['threshold_temperature_early']
			strMarkLine_alerm = valueData[i]['threshold_temperature']
			strMarkLine_denger = valueData[i]['threshold_temperature_danger']
		} else {
			chartTitle = titleStart + titleType + '轴趋势图'
			titleOfY = "mm/s"
			strCounts = titleStart + titleType + '轴'
			if (titleType == 'x') {
				strMarkLine = valueData[i]['threshold_early_x']
				strMarkLine_alerm = valueData[i]['threshold_alarm_x']
				strMarkLine_denger = valueData[i]['threshold_danger_x']
			}
			if (titleType == 'y') {
				strMarkLine = valueData[i]['threshold_early_y']
				strMarkLine_alerm = valueData[i]['threshold_alarm_y']
				strMarkLine_denger = valueData[i]['threshold_danger_y']
			}
			if (titleType == 'z') {
				strMarkLine = valueData[i]['threshold_early_z']
				strMarkLine_alerm = valueData[i]['threshold_alarm_z']
				strMarkLine_denger = valueData[i]['threshold_danger_z']
			}
		}



		//x轴数据
		var dataHeng = objRms[keyItem].list_x
		//y轴数据
		var dataZong = objRms[keyItem].list_y



		var strNumber = "<div style='margin-top:15px;'>\
			<p>\
			<span>" + strCounts +
			"</span>\
			<span style='color:#88d807'>预警值:" + strMarkLine +
			"</span>\
			<span style='margin-left:3px;color:#d89e07'>告警值:" + strMarkLine_alerm +
			"</span>\
			<span style='margin-left:3px;color:#d83b53'>危险值:" + strMarkLine_denger + "</span>\
			</p>\
			</div>"
		$('#qiushitu').append(strNumber)

		var strChart = '<div class="chart_qushiClass" id="chartLong_' + keyItem + '"';

		strChart += '></div>';
		

		$("#qiushitu").append(strChart);
		setChartLong('chartLong_'+ keyItem, chartTitle, dataHeng, dataZong, titleOfY, strMarkLine, strMarkLine_alerm,
			strMarkLine_denger)
	}
//*/
}

function setChartLong(strLongChartID, strTitle, dataXHeng, dataYZong, YName, markLineData, strMarkLine_alerm,
	strMarkLine_denger) {

	var option_long = {
		title: {
			text: strTitle,
			left: 'center',
			
		},
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

$('#selHour').on('tap', function() {
	$('#selHour').removeClass('unselectButton');
	$('#selHour').addClass('selectButton');

	$('#selDay').removeClass('selectButton');
	$('#selDay').addClass('unselectButton');

	$('#selMonth').removeClass('selectButton');
	$('#selMonth').addClass('unselectButton');

	$('#selYear').removeClass('selectButton');
	$('#selYear').addClass('unselectButton');
	strShowType = 0
	longChartsGetData(strShowType)
})
$('#selDay').on('tap', function() {
	$('#selHour').removeClass('selectButton');
	$('#selHour').addClass('unselectButton');

	$('#selDay').removeClass('unselectButton');
	$('#selDay').addClass('selectButton');

	$('#selMonth').removeClass('selectButton');
	$('#selMonth').addClass('unselectButton');

	$('#selYear').removeClass('selectButton');
	$('#selYear').addClass('unselectButton');
	strShowType = 1
	longChartsGetData(strShowType)
})
$('#selMonth').on('tap', function() {
	$('#selHour').removeClass('selectButton');
	$('#selHour').addClass('unselectButton');

	$('#selDay').removeClass('selectButton');
	$('#selDay').addClass('unselectButton');

	$('#selMonth').removeClass('unselectButton');
	$('#selMonth').addClass('selectButton');

	$('#selYear').removeClass('selectButton');
	$('#selYear').addClass('unselectButton');
	strShowType = 2
	longChartsGetData(strShowType)
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
	longChartsGetData(strShowType)
})


function refreshQushiCharts(){
	if (selectObject.connect_model == 0) {
		getChartDataWithInstall()
	}
	if (selectObject.connect_model == 1) {
		longChartsGetData(strShowType)
	}
}


/*

var placeArray = new Array();
//初始化设置选项数据
function getInitData(respData) {

	if (typeof(respData.timeIntervalVO) != "undefined") {
		//起始时间
		var startTime = respData.timeIntervalVO.min_time;
		$("#qushi_dateStart").val(startTime.substr(0, 19));
		//结束时间
		var endTime = respData.timeIntervalVO.max_time;
		$("#qushi_dateEnd").val(endTime.substr(0, 19));
	}
	if (typeof(respData.probeDrawVO) != "undefined") {
		//安装位置
		var weizhi = respData.probeDrawVO.install_xy;
		$("#qushi_place").val(weizhi);
	}
	if (typeof(respData.installList) != "undefined") {
		//安装位置选项
		placeArray = respData.installList;
	}
	if (typeof(respData.installList) != "undefined" && typeof(respData.probeDrawVO) != "undefined" && typeof(respData.timeIntervalVO) !=
		"undefined") {
		//初始画图
		demofuncation(startTime, endTime, weizhi);
	}

}
gainLongModelData()
//获取长连接模式的趋势图
function gainLongModelData() {
	$.ajax({
		type: 'get',
		url: new_commen_gain_trend_chart_long_Interface,
		async: true,
		data: {
			devices_no: localStorage.DeveciId
		},
		dataType: 'json',
		success: function(response) {
			if (response.status == "SUCCESS") {
				if (response.data != undefined) {
					if (response.data.install_list != undefined) {
						setEleForLongModel(response.data.install_list)
					}
				}
			}

		}
	})
}

function setEleForLongModel(valueData) {
	for (var i = 0; i < valueData.length; i++) {

		var objRms = valueData[i].rmsDrawVO
		var titleStart = valueData[i].install_xy
		for (var keyItem in objRms) {

			//图表的title ---- y轴单位
			var titleType = keyItem.charAt(keyItem.length - 1)
			var chartTitle = ''
			var titleOfY = ''
			var strCounts = ''
			//MarkLine 标线值
			var strMarkLine = ''
			var strMarkLine_alerm = ''
			var strMarkLine_denger = ''
			if (titleType == 't') {
				strCounts = titleStart + '温度'
				chartTitle = titleStart + '温度趋势图'
				titleOfY = "℃"
				strMarkLine = valueData[i]['threshold_temperature_early']
				strMarkLine_alerm = valueData[i]['threshold_temperature']
				strMarkLine_denger = valueData[i]['threshold_temperature_danger']
			} else {
				chartTitle = titleStart + titleType + '轴趋势图'
				titleOfY = "mm/s"
				strCounts = titleStart + titleType + '轴'
				if (titleType == 'x') {
					strMarkLine = valueData[i]['threshold_early_x']
					strMarkLine_alerm = valueData[i]['threshold_alarm_x']
					strMarkLine_denger = valueData[i]['threshold_danger_x']
				}
				if (titleType == 'y') {
					strMarkLine = valueData[i]['threshold_early_y']
					strMarkLine_alerm = valueData[i]['threshold_alarm_y']
					strMarkLine_denger = valueData[i]['threshold_danger_y']
				}
				if (titleType == 'z') {
					strMarkLine = valueData[i]['threshold_early_z']
					strMarkLine_alerm = valueData[i]['threshold_alarm_z']
					strMarkLine_denger = valueData[i]['threshold_danger_z']
				}
			}



			//x轴数据
			var dataHeng = objRms[keyItem].list_x
			//y轴数据
			var dataZong = objRms[keyItem].list_y



			var strNumber = "<div style='margin-top:15px;'>\
			<p>\
			<span>" + strCounts +
				"</span>\
			<span style='color:#88d807'>预警值:" + strMarkLine +
				"</span>\
			<span style='margin-left:3px;color:#d89e07'>告警值:" + strMarkLine_alerm +
				"</span>\
			<span style='margin-left:3px;color:#d83b53'>危险值:" + strMarkLine_denger + "</span>\
			</p>\
			</div>"
			$('#qiushitu').append(strNumber)

			var strChart = '<div class="chart_qushiClass" id="chartLong_' + i + keyItem + '"';

			strChart += '></div>';

			$("#qiushitu").append(strChart);
			setChartLong('chartLong_' + i + keyItem, chartTitle, dataHeng, dataZong, titleOfY, strMarkLine, strMarkLine_alerm,
				strMarkLine_denger)

		}
	}
}

function setChartLong(strLongChartID, strTitle, dataXHeng, dataYZong, YName, markLineData, strMarkLine_alerm,
	strMarkLine_denger) {


	var option_long = {
		title: {
			text: strTitle,
			left: 'center'
		},
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


function demofuncation(param_dateStart, param_dataend, param_place) {
	$.ajax({
		type: "get",
		url: new_commen_gain_trend_chart_fix_Interface,
		async: true,
		data: {
			devices_no: localStorage.DeveciId
		},
		dataType: 'json',
		success: function(respData) {
			if (respData.status == "SUCCESS") {
				if (respData.data.length != 'undefined') {
					setDataToEchart(respData.data);
				} else {
					mui.toast("没有查询到相关数据...");
				}
			} else {
				mui.toast(respData.message);
			}
		},
		error: function(error) {
			mui.toast("数据查询失败，请重试");
		}
	});

}

function setDataToEchart(DataResp) {

	//	$("#qiushitu").remove();

	for (var i = 0; i < DataResp.length; i++) {
		var strChart = '<div class="chart_qushiClass" id="chartQushi_' + i + '"';
		strChart += '></div>';
		$("#qiushitu").append(strChart);

		var eachData = DataResp[i];
		var strInstally = eachData.install_xy;

		var width = $(window).width();
		var strIDs = '#chartQushi_' + i;
		$(strIDs).css("width", width);

		var strPostID = "chartQushi_" + i;

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
		if (eachData.store_rms_t.list_x.length > 0) {
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
	}

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
			top: 30
		},
		tooltip: {
			trigger: 'axis',
			// 			axisPointer: {
			// 				type: 'cross',
			// 				label: {
			// 					backgroundColor: '#6a7985',
			// 				}
			// 			},
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
			}
		}, {
			type: 'value',
			name: '温度:℃',
			splitLine: {
				show: false
			}
		}],

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
				name: "X",
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
				name: "Y",
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
				name: "Z",
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

function chart_qushiwendu(xData, yData) {

	var option_wendu = {
		title: {
			text: '温度',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		xAxis: {
			axisLine: {
				onZero: false
			},
			type: 'category',
			data: xData
		},
		yAxis: {
			type: 'value',
			name: '℃'
		},

		grid: {
			left: '10%',
			right: '10%'
		},
		dataZoom: [{
			type: 'slider',
			start: 0,
			end: 100
		}],
		series: [{
			data: yData,
			type: 'line',
			markLine: {
				data: [{
						type: 'vaerage',
						name: '平均值'
					},
					{
						type: 'vaerage',
						name: '平均值'
					},
					{
						type: 'vaerage',
						name: '平均值'
					},
					{
						type: 'vaerage',
						name: '平均值'
					}
				]
			}
		}]
	};
	var wenduChart = echarts.init(document.getElementById("chart_qushi_wendu"))
	wenduChart.setOption(option_wendu);
}


//*/
