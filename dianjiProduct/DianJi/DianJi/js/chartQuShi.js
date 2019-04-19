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
			var strChart = '<div class="chart_qushiClass" id="chartLong_' + i + keyItem + '"';
			strChart += '></div>';
			$("#qiushitu").append(strChart);
			//图表的title ---- y轴单位
			var titleType = keyItem.charAt(keyItem.length - 1)
			var chartTitle = ''
			var titleOfY = ''
			if (titleType == 't') {
				chartTitle = titleStart + '温度趋势图'
				titleOfY = "℃"
			} else {
				chartTitle = titleStart + titleType + '轴趋势图'
				titleOfY = "mm/s"
			}

			//x轴数据
			var dataHeng = objRms[keyItem].list_x
			//y轴数据
			var dataZong = objRms[keyItem].list_y

			setChartLong('chartLong_' + i + keyItem, chartTitle, dataHeng, dataZong,titleOfY)
		}
	}
}

function setChartLong(strLongChartID, strTitle, dataXHeng, dataYZong,YName) {


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
			inverse: true
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
			position:function (pos, params, dom, rect, size) {
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
	//*/
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
