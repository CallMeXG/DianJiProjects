mui.plusReady(function() {


	//2019-05-08
	var installArrayList = new Array()
	var selectObject = new Object()
	//2019-05-08
	getDeviceInstallActiveList()
	var strShowType = 0
	var strSensorType = '';

	var strRefreshCedian = '';
	var strRefreshworkmodel = '';
	var strRefreshmythtype = '';
	var strRefreshtimelong = '';
	var strRefreshtimes = '';

	//header 电机名称
	document.getElementById("titleText").innerHTML = localStorage.getItem('DeveciName');
	// 小时、天、月、年  数据列表
	var hourList = new Array(),
		dayList = new Array(),
		montList = new Array(),
		yearList = new Array()

	//初始化筛选时间
	var strQueryTime = ''

	//获取测点列表
	function getDeviceInstallActiveList() {

		plus.nativeUI.showWaiting('正在获取测点列表数据...')
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

				plus.nativeUI.closeWaiting()

				if (response.status == "SUCCESS") {
					installArrayList = response.data;
					if (installArrayList.length > 0) {

						if (installArrayList[0].status != undefined && installArrayList[0].status == 'Y') {
							$("#qushiChartSelected").html(installArrayList[0].install_xy + '  ★');
						} else {
							$("#qushiChartSelected").html(installArrayList[0].install_xy);
						}

						//单个测点内容
						selectObject = installArrayList[0]


						//设置工作模式
						setWorkModelWithCeDian();
						//设置算法
						setMathTypeWithCeDian();
						//设置时长
						setTimeLong();

						strSensorType = installArrayList[0].sensorType

						//以下四个list ，为 不同时长的时间列表
						if (selectObject.time_hour != undefined) {
							hourList = selectObject.time_hour;
						}
						if (selectObject.time_day != undefined) {
							dayList = selectObject.time_day;
						}
						if (selectObject.time_month != undefined) {
							montList = selectObject.time_month;
						}
						if (selectObject.time_year != undefined) {
							yearList = selectObject.time_year;
						}

						// gainChartDataWithInstallXY(selectObject.id, '1', '0200', '3', '2019-06');

						strRefreshCedian = selectObject.id;
						strRefreshworkmodel = selectObject.connect_model;
						strRefreshmythtype = selectObject.math_type;
						strRefreshtimelong = selectObject.show_type;

						setTimesFunction();

						$('#selectTimes').html(strRefreshtimes)

						gainChartDataWithInstallXY(selectObject.id, selectObject.connect_model, selectObject.math_type, selectObject
							.show_type, strRefreshtimes)

					}

				}
				if (response.status == 'ILLEGAL') {
					mui.alert('您的账户登录过期，请退出重新登录！')
				}

			},
			error: function(error) {
				plus.nativeUI.closeWaiting()
				console.log(error)
			}
		})

	}

	//根据测点，获取趋势图数据 newStrInstallId:测点id    newStartTime：查询的时间条件    newConnectModel：长短连接模式      
	//newShowType：查询的时长类型   newMathType:查询的算法类型
	function gainChartDataWithInstallXY(newStrInstallId, newConnectModel, newMathType, newShowType, newStartTime) {
		plus.nativeUI.showWaiting('正在获取趋势图数据...');
		$("#qiushitu").empty();

		var objParams = new Object();
		objParams.install_id = newStrInstallId;
		objParams.connect_model = newConnectModel;
		if (newStartTime != '') {
			objParams.start_time = newStartTime;
		}
		if (newShowType != '') {
			objParams.show_type = newShowType;
		}
		if (newMathType != '') {
			objParams.math_type = newMathType;
		}

		$.ajax({
			type: 'get',
			url: new_commen_gain_trend_chart_install_arrange_Interface,
			async: true,
			data: objParams,
			dataType: 'json',
			success: function(response) {

				plus.nativeUI.closeWaiting()
				if (response.status == 'SUCCESS') {
					
					if (Object.keys(response.data).length != 0) {
						

						//进入数据整理方法
						dealWithChartData(response.data.store_rms_x, response.data.store_rms_y, response.data.store_rms_z,
							response.data.store_rms_t, response.data.simWorkModeLongVO)
					}

				} else {
					plus.nativeUI.closeWaiting()
					mui.toast('暂无数据')
				}

			},
			error: function(error) {
				plus.nativeUI.closeWaiting()
			}
		})
	}

	//根据获取到的趋势图数据，首先进行数据的整理
	function dealWithChartData(store_rms_x, store_rms_y, store_rms_z, store_rms_t, simWorkModeLongVO) {
		
		console.log("=====maty-type===" + strRefreshmythtype)
			
		//********************X轴趋势图
		if (selectObject.sensorType == 'V') {
			var strXearly = '--';
			var strXalarm = '--';
			var strXdanger = '--';
			
			

			if (simWorkModeLongVO != undefined && strRefreshmythtype == '0200') {

				if (simWorkModeLongVO.threshold_early_x != undefined) {
					strXearly = simWorkModeLongVO.threshold_early_x;
				}
				if (simWorkModeLongVO.threshold_alarm_x != undefined) {
					strXalarm = simWorkModeLongVO.threshold_alarm_x;
				}
				if (simWorkModeLongVO.threshold_danger_x != undefined) {
					strXdanger = simWorkModeLongVO.threshold_danger_x;
				}
				var strNumber =
					"<div style='margin-top:15px;padding-top:5px;background-color:white;height:50px;width:100%;'>\
				<table style='width:100%;'><tr><td>预警值</td><td>告警值</td><td>危险值</td></tr>\
				<tr><td>" +
					strXearly + "(mm/s)</td>\
				<td>" + strXalarm + "(mm/s)</td>\
				<td>" + strXdanger +
					"(mm/s)</td></tr>\
				</table></div>";
				$('#qiushitu').append(strNumber);
			}

			var strChartX = '<div class="chart_qushiClass" id="chartX"></div><br>';
			$("#qiushitu").append(strChartX);

			var chartTitleX = "X轴振动趋势图"
			if (selectObject.alias_z != undefined) {
				chartTitleX = "X轴(" + selectObject.alias_x + ")振动趋势图"
			}

			var chartXarray_x = []
			var chartXarray_y = []
			var strValueDataX = new Array();

			if (store_rms_x !== undefined) {

				chartXarray_x = store_rms_x.list_x
				chartXarray_y = store_rms_x.list_y
				for (var i = 0; i < chartXarray_x.length; i++) {
					var objValue = {
						value: [chartXarray_x[i].substr(0, 19), chartXarray_y[i]]
					}
					strValueDataX.push(objValue)
				}
			}
			var strXName = '';
			if (selectObject.math_type == '0002') {
				strXName = 'm/s²';
			}
			if (selectObject.math_type == '0200') {
				strXName = 'mm/s';
			}
			drawQuShiChartWithData('chartX', chartTitleX, chartXarray_x, strValueDataX, strXName, strXearly, strXalarm,
				strXdanger)




			//********************Y轴趋势图
			var strYearly = '--';
			var strYalarm = '--';
			var strYdanger = '--';
			if (simWorkModeLongVO != undefined && strRefreshmythtype == '0200') {

				if (simWorkModeLongVO.threshold_early_y != undefined) {
					strYearly = simWorkModeLongVO.threshold_early_y;
				}
				if (simWorkModeLongVO.threshold_alarm_y != undefined) {
					strYalarm = simWorkModeLongVO.threshold_alarm_y;
				}
				if (simWorkModeLongVO.threshold_danger_y != undefined) {
					strYdanger = simWorkModeLongVO.threshold_danger_y;
				}
				var strNumber =
					"<div style='padding-top:5px;background-color:white;height:50px;width:100%;'>\
				<table style='width:100%;'><tr><td>预警值</td><td>告警值</td><td>危险值</td></tr>\
				<tr><td>" +
					strYearly + "(mm/s)</td>\
				<td>" + strYalarm + "(mm/s)</td>\
				<td>" + strYdanger +
					"(mm/s)</td></tr>\
				</table></div>";
				$('#qiushitu').append(strNumber);
			}

			var strChartY = '<div class="chart_qushiClass" id="chartY"></div><br>';
			$("#qiushitu").append(strChartY);

			var chartTitleY = "Y轴振动趋势图"
			if (selectObject.alias_z != undefined) {
				chartTitleY = "Y轴(" + selectObject.alias_y + ")振动趋势图"
			}

			var chartYarray_x = []
			var chartYarray_y = []
			var strValueDataY = new Array();

			if (store_rms_y != undefined) {
				chartYarray_x = store_rms_y.list_x
				chartYarray_y = store_rms_y.list_y
				for (var i = 0; i < chartYarray_x.length; i++) {
					var objValue = {
						value: [chartYarray_x[i].substr(0, 19), chartYarray_y[i]]
					}
					strValueDataY.push(objValue)
				}
			}
			var strYName = '';
			if (selectObject.math_type == '0002') {
				strYName = 'm/s²';
			}
			if (selectObject.math_type == '0200') {
				strYName = 'mm/s';
			}
			drawQuShiChartWithData('chartY', chartTitleY, chartYarray_x, strValueDataY, strYName, strYearly, strYalarm,
				strYdanger)


			//********************Z轴趋势图
			var strZearly = '--';
			var strZalarm = '--';
			var strZdanger = '--';
			if (simWorkModeLongVO != undefined && strRefreshmythtype == '0200') {

				if (simWorkModeLongVO.threshold_early_z != undefined) {
					strZearly = simWorkModeLongVO.threshold_early_z;
				}
				if (simWorkModeLongVO.threshold_alarm_z != undefined) {
					strZalarm = simWorkModeLongVO.threshold_alarm_z;
				}
				if (simWorkModeLongVO.threshold_danger_z != undefined) {
					strZdanger = simWorkModeLongVO.threshold_danger_z;
				}
				var strNumber =
					"<div style='padding-top:5px;background-color:white;height:50px;width:100%;'>\
				<table style='width:100%;'><tr><td>预警值</td><td>告警值</td><td>危险值</td></tr>\
				<tr><td>" +
					strZearly + "(mm/s)</td>\
				<td>" + strZalarm + "(mm/s)</td>\
				<td>" + strZdanger +
					"(mm/s)</td></tr>\
				</table></div>";
				$('#qiushitu').append(strNumber);
			}
			var strChartZ = '<div class="chart_qushiClass" id="chartZ"></div><br>';
			$("#qiushitu").append(strChartZ);

			var chartTitleZ = "Z轴振动趋势图"
			if (selectObject.alias_z != undefined) {
				chartTitleZ = "Z轴(" + selectObject.alias_z + ")振动趋势图"
			}
			var chartZarray_x = []
			var chartZarray_y = []
			var strValueDataZ = new Array();

			if (store_rms_z != undefined) {
				chartZarray_x = store_rms_z.list_x
				chartZarray_y = store_rms_z.list_y
				for (var i = 0; i < chartZarray_x.length; i++) {
					var objValue = {
						value: [chartZarray_x[i].substr(0, 19), chartZarray_y[i]]
					}
					strValueDataZ.push(objValue)
				}
			}
			var strZName = '';
			if (selectObject.math_type == '0002') {
				strZName = 'm/s²';
			}
			if (selectObject.math_type == '0200') {
				strZName = 'mm/s';
			}

			drawQuShiChartWithData('chartZ', chartTitleZ, chartZarray_x, strValueDataZ, strZName, strZearly, strZalarm,
				strZdanger)




		}

		if (selectObject.sensorType == 'V' || selectObject.sensorType == 'T') {
			var strTearly = '--';
			var strTalarm = '--';
			var strTdanger = '--';
			//********************温度趋势图
			if (simWorkModeLongVO != undefined && strRefreshmythtype == '0200') {

				if (simWorkModeLongVO.threshold_temperature_early != undefined) {
					strTearly = simWorkModeLongVO.threshold_temperature_early;
				}
				if (simWorkModeLongVO.threshold_temperature != undefined) {
					strTalarm = simWorkModeLongVO.threshold_temperature;
				}
				if (simWorkModeLongVO.threshold_temperature_danger != undefined) {
					strTdanger = simWorkModeLongVO.threshold_temperature_danger;
				}
				var strNumber =
					"<div style='padding-top:5px;background-color:white;height:50px;width:100%;'>\
		<table style='width:100%;'><tr><td>预警值</td><td>告警值</td><td>危险值</td></tr>\
		<tr><td>" +
					strTearly + " ℃</td>\
		<td>" + strTalarm + " ℃</td>\
		<td>" + strTdanger +
					" ℃</td></tr>\
		</table></div>";
				$('#qiushitu').append(strNumber);
			}
			var strChartT = '<div class="chart_qushiClass" id="chartT"></div><br>';
			$("#qiushitu").append(strChartT);

			var chartTitleT = "温度趋势图"
			if (selectObject.alias_z != undefined) {
				chartTitleT = "温度趋势图"
			}
			var chartTarray_x = []
			var chartTarray_y = []

			var strValueDataT = new Array();

			if (store_rms_t != undefined) {
				// console.log('----' + store_rms_t.list_x)
				chartTarray_x = store_rms_t.list_x
				chartTarray_y = store_rms_t.list_y
				for (var i = 0; i < chartTarray_x.length; i++) {
					var strFloaty = parseFloat(chartTarray_y[i])
					var floatTwo = strFloaty.toFixed(2)
					var objValue = {
						value: [chartTarray_x[i].substr(0, 19), floatTwo]
					}
					strValueDataT.push(objValue)
				}
			}

			drawQuShiChartWithData('chartT', chartTitleT, chartTarray_x, strValueDataT, ' ℃', strTearly, strTalarm,
				strTdanger)
		}



	}

	//根据获取到的趋势图数据，绘图
	function drawQuShiChartWithData(chartID, chartTitle, chartArrX, chartArrY, strDanWei, strEarlyNumber, strAlarmNumber,
		strDangerNumber) {

		var options = {
			title: {
				top:'5',
				text: chartTitle,
				left: 'center',
			},
			backgroundColor: 'white',
			tooltip: {
				trigger: 'axis',
				formatter: function(params) {
					params = params[0];
					var date = new Date(params.name);
					return params.value[0] + ' ---- ' + params.value[1] + '  ' + strDanWei;
				},
				position: function(pos, params, dom, rect, size) {
					// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
					var obj = {
						top: 190
					};
					obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
					return obj;
				},
				triggerOn: 'click',
				axisPointer: {
					animation: false
				}
			},
			dataZoom: {
				type: 'inside',
				show: true,
				start: 0,
				end: 100
			},
			xAxis: {
				type: 'time',
				splitLine: {
					show: false
				}
			},
			yAxis: {
				type: 'value',
				// scale: true,
				boundaryGap: [0, '100%'],
				splitLine: {
					show: false
				},
				name: strDanWei
			},
			series: [{
				animation: false,
				type: 'line',
				// symbolSize: 1,
				symbol: 'none',
				// hoverAnimation: true,
				data: chartArrY,
				lineStyle: {
					color: '#5692E8',
					width: '1'
				},
				markLine: {
					symbol: 'none',
					silent: true,
					data: [{
							yAxis: strEarlyNumber,
							lineStyle: {
								type: 'solid',
								color: '#88d807'
							},
							label: {
								position: 'end'
							}
						},
						{
							yAxis: strAlarmNumber,
							lineStyle: {
								type: 'solid',
								color: '#d89e07'
							},
							label: {
								position: 'end'
							}
						},
						{
							yAxis: strDangerNumber,
							lineStyle: {
								type: 'solid',
								color: '#d83b53'
							},
							label: {
								position: 'end'
							}
						}
					]
				}

			}]
		};


		var Charts = echarts.init(document.getElementById(chartID))
		Charts.setOption(options)
	}

	//选择测点位置 2019-05-08
	$("#qushiChartSelected").on('tap', function() {
		var userPicker = new mui.PopPicker();
		var newUserPickerData = new Array()
		for (var i = 0; i < installArrayList.length; i++) {

			//*************  判断该测点是否正在使用，如果正在使用，给它做个特殊标记， install_xy： 测点的实际名称，方便后面使用
			var objPickerData = new Object()
			objPickerData = installArrayList[i]

			// objPickerData['value'] = installArrayList[i].id;
			if (installArrayList[i].status == 'Y') {
				objPickerData['text'] = installArrayList[i].install_xy + '  ★';
			} else {
				objPickerData['text'] = installArrayList[i].install_xy;
			}


			newUserPickerData.push(objPickerData)
		}
		userPicker.setData(newUserPickerData);
		userPicker.show(function(items) {
			$("#qushiChartSelected").html(items[0].text);

			selectObject = items[0]
			setWorkModelWithCeDian();
			setMathTypeWithCeDian();
			setTimeLong();

			strSensorType = items[0].sensorType
			
			hourList = []
			dayList = []
			montList = []
			yearList = []

			//以下四个list ，为 不同时长的时间列表
			if (selectObject.time_hour != undefined) {
				hourList = selectObject.time_hour;
			}
			if (selectObject.time_day != undefined) {
				dayList = selectObject.time_day;
			}
			if (selectObject.time_month != undefined) {
				montList = selectObject.time_month;
			}
			if (selectObject.time_year != undefined) {
				yearList = selectObject.time_year;
			}
			strRefreshCedian = selectObject.id;
			strRefreshworkmodel = selectObject.connect_model

			setTimesFunction();

			gainChartDataWithInstallXY(selectObject.id, selectObject.connect_model, selectObject.math_type, selectObject
				.show_type, strRefreshtimes);


		});

	})
	// 缺省设置工作模式
	function setWorkModelWithCeDian() {
		var strWorkModel = ''
		if (selectObject.connect_model != undefined) {
			if (selectObject.connect_model == '0') {
				strWorkModel = '省电模式';

			} else if (selectObject.connect_model == '1') {
				strWorkModel = '长连接模式'
			}
		} else {
			strWorkModel = '--'
		}
		$('#qushiModel').html(strWorkModel)
	}

	// 缺省设置算法
	function setMathTypeWithCeDian() {
		var strMathType = ''
		if (selectObject.math_type != undefined) {
			if (selectObject.math_type == '0002') {
				strMathType = '加速度有效值'
			} else if (selectObject.math_type == '0200') {
				strMathType = '速度有效值'
			}
		} else {
			strMathType = '--'
		}
		$('#selDeepType').html(strMathType)
	}
	//设置时长
	function setTimeLong() {

		if (selectObject.show_type == '0') { //实时

			$('#selMonth,#selDay,#selYear,#selHour').removeClass('selectButton');
			$('#selMonth,#selDay,#selYear,#selHour').addClass('unselectButton');

			$('#realTime').removeClass('unselectButton');
			$('#realTime').addClass('selectButton');

			strShowType = 4
			document.getElementById('selectTimes').innerHTML = "";
			$('#selTimeIDs').hide();

		}
		if (selectObject.show_type == '1') { //小时
			$('#realTime,#selDay,#selYear,#selMonth').removeClass('selectButton');
			$('#realTime,#selDay,#selYear,#selMonth').addClass('unselectButton');

			$('#selHour').removeClass('unselectButton');
			$('#selHour').addClass('selectButton');

			strShowType = 0
			$('#selectTimes').html('请选择查询时间');
			$('#selTimeIDs').show();
		}
		if (selectObject.show_type == '2') {
			$('#realTime,#selMonth,#selYear,#selHour').removeClass('selectButton');
			$('#realTime,#selMonth,#selYear,#selHour').addClass('unselectButton');

			$('#selDay').removeClass('unselectButton');
			$('#selDay').addClass('selectButton');

			strShowType = 1
			$('#selectTimes').html('请选择查询时间');
			$('#selTimeIDs').show();
		}
		if (selectObject.show_type == '3') {
			$('#realTime,#selDay,#selYear,#selHour').removeClass('selectButton');
			$('#realTime,#selDay,#selYear,#selHour').addClass('unselectButton');

			$('#selMonth').removeClass('unselectButton');
			$('#selMonth').addClass('selectButton');

			strShowType = 2
			$('#selectTimes').html('请选择查询时间');
			$('#selTimeIDs').show();
		}
		if (selectObject.show_type == '4') {
			$('#realTime,#selDay,#selMonth,#selHour').removeClass('selectButton');
			$('#realTime,#selDay,#selMonth,#selHour').addClass('unselectButton');

			$('#selYear').removeClass('unselectButton');
			$('#selYear').addClass('selectButton');

			strShowType = 3
			$('#selectTimes').html('请选择查询时间');
			$('#selTimeIDs').show();
		}

		// gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
		// strRefreshtimes);

	}
	//设置时间默认值
	function setTimesFunction() {
		strRefreshtimes = '';
		strRefreshtimelong = 0;
		document.getElementById('selectTimes').innerHTML = '';

		if (selectObject.show_type == 1) {
			strRefreshtimelong = 1;
			if (hourList.length > 0) {
				strRefreshtimes = hourList[0];
				document.getElementById('selectTimes').innerHTML = hourList[0];
			} else {
				strRefreshtimes = '';
				document.getElementById('selectTimes').innerHTML = '过去30天没有监测数据';
			}
		}
		if (selectObject.show_type == 2) {
			strRefreshtimelong = 2;
			if (dayList.length > 0) {
				strRefreshtimes = dayList[0];
				document.getElementById('selectTimes').innerHTML = dayList[0];
			} else {
				strRefreshtimes = '';
				document.getElementById('selectTimes').innerHTML = '过去30天没有监测数据';
			}
		}
		if (selectObject.show_type == 3) {
			strRefreshtimelong = 3;
			if (montList.length > 0) {
				strRefreshtimes = montList[0];
				document.getElementById('selectTimes').innerHTML = montList[0];
			} else {
				strRefreshtimes = '';
				document.getElementById('selectTimes').innerHTML = '暂无可选数据';
			}
		}
		if (selectObject.show_type == 4) {
			strRefreshtimelong = 4;
			if (yearList.length > 0) {
				strRefreshtimes = yearList[0];
				document.getElementById('selectTimes').innerHTML = yearList[0];
			} else {
				strRefreshtimes = '';
				document.getElementById('selectTimes').innerHTML = '暂无可选数据';
			}
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

		document.getElementById('selectTimes').innerHTML = "";
		strRefreshtimelong = 0;
		strRefreshtimes = '';
		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);

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
		if (hourList.length > 0) {
			document.getElementById('selectTimes').innerHTML = hourList[0];
			strRefreshtimes = hourList[0];
		} else {
			document.getElementById('selectTimes').innerHTML = '过去30天没有监测数据';
			strRefreshtimes = '';
		}
		strRefreshtimelong = 1;
		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);
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
		if (dayList.length > 0) {
			document.getElementById('selectTimes').innerHTML = dayList[0];
			strRefreshtimes = dayList[0];
		} else {
			document.getElementById('selectTimes').innerHTML = '过去30天没有监测数据';
			strRefreshtimes = '';
		}
		strRefreshtimelong = 2;

		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);
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
		if (montList.length > 0) {
			document.getElementById('selectTimes').innerHTML = montList[0];
			strRefreshtimes = montList[0];
		} else {
			document.getElementById('selectTimes').innerHTML = '暂无可选数据';
			strRefreshtimes = '';
		}
		strRefreshtimelong = 3;

		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);
	})
	$('#selYear').on('tap', function() {
		$('#realTime').removeClass('selectButton');
		$('#realTime').addClass('unselectButton');

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
		if (yearList.length > 0) {
			document.getElementById('selectTimes').innerHTML = yearList[0];
			strRefreshtimes = yearList[0];
		} else {
			document.getElementById('selectTimes').innerHTML = '暂无可选数据';
			strRefreshtimes = '';
		}
		strRefreshtimelong = 4;

		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);
	})



	//选择时间
	$('#selectTimes').on('tap', function() {

		//单位，小时
		if (strShowType == 0) {
			if (hourList.length > 0) {
				var hourPicker = new mui.PopPicker();
				var newHourPickerData = new Array();
				for (var i = 0; i < hourList.length; i++) {
					var objSelect = {
						text: hourList[i] + '时',
						value: hourList[i]
					}
					newHourPickerData.push(objSelect)
				}
				hourPicker.setData(newHourPickerData);
				hourPicker.show(function(items) {
					$('#selectTimes').html(items[0].text)
					strRefreshtimelong = 1;
					strRefreshtimes = items[0].value;
					gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
						strRefreshtimes);
				});
			} else {
				plus.nativeUI.alert('过去30天没有监测数据')
			}

		}
		//单位，天
		else if (strShowType == 1) {
			if (dayList.length > 0) {
				var dayPicker = new mui.PopPicker();
				var newHourPickerData = new Array();
				for (var i = 0; i < dayList.length; i++) {
					var objSelect = {
						text: dayList[i],
						value: dayList[i]
					}
					newHourPickerData.push(objSelect)
				}
				dayPicker.setData(newHourPickerData);
				dayPicker.show(function(items) {
					$('#selectTimes').html(items[0].text);
					strRefreshtimelong = 2;
					strRefreshtimes = items[0].value;
					gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
						strRefreshtimes);
				});
			} else {
				plus.nativeUI.alert('过去30天没有监测数据')
			}

		}
		//单位，月
		else if (strShowType == 2) {
			if (montList.length > 0) {
				var monthPicker = new mui.PopPicker();
				var newHourPickerData = new Array();
				for (var i = 0; i < montList.length; i++) {
					var objSelect = {
						text: montList[i],
						value: montList[i]
					}
					newHourPickerData.push(objSelect)
				}
				monthPicker.setData(newHourPickerData);
				monthPicker.show(function(items) {
					$('#selectTimes').html(items[0].text);
					strRefreshtimelong = 3;
					strRefreshtimes = items[0].value;
					gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
						strRefreshtimes);
				});

			} else {
				plus.nativeUI.alert('暂无可选数据')
			}

		}
		//单位，年
		else if (strShowType == 3) {
			if (yearList.length > 0) {
				var yearPicker = new mui.PopPicker();
				var newHourPickerData = new Array();
				for (var i = 0; i < yearList.length; i++) {
					var objSelect = {
						text: yearList[i],
						value: yearList[i]
					}
					newHourPickerData.push(objSelect)
				}
				yearPicker.setData(newHourPickerData);
				yearPicker.show(function(items) {
					$('#selectTimes').html(items[0].text)
					strRefreshtimelong = 4;
					strRefreshtimes = items[0].value;
					gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
						strRefreshtimes);
				});
			} else {
				plus.nativeUI.alert('暂无可选数据')
			}
		}

	})

	//刷新、查询按钮点击事件
	$('#qushiRefresh').on('tap', function() {
		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);
	})


	//********************* 长连接、省电模式选择，点击取消，隐藏弹出菜单
	$('#cancelshortOrLongSheet').on('tap', function() {
		mui('#shortOrLongSheet').popover('toggle');
	})
	//长连接模式
	$('#shortOrLongLong').on('tap', function() {
		mui('#shortOrLongSheet').popover('toggle');
		document.getElementById("qushiModel").innerHTML = '长连接模式';
		selectObject.connect_model = '1';
		strRefreshworkmodel = '1';
		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);
	})
	//省电模式
	$('#shortOrLongShort').on('tap', function() {
		mui('#shortOrLongSheet').popover('toggle');
		document.getElementById("qushiModel").innerHTML = '省电模式';
		selectObject.connect_model = '0';
		strRefreshworkmodel = '0';
		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);
	})

	//********************* 选择速度有效值或加速度有效值，算法类型，点击取消，隐藏弹出菜单
	$('#cancelalgorithm').on('tap', function() {
		mui('#algorithmType').popover('toggle');
	})
	//加速度有效值
	$('#algorithm1').on('tap', function() {
		mui('#algorithmType').popover('toggle');
		document.getElementById("selDeepType").innerHTML = '加速度有效值';
		selectObject.math_type = '0002';
		strRefreshmythtype = '0002';
		console.log("加速度有效值 ===" + strRefreshmythtype)
		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);
	})
	//速度有效值
	$('#algorithm2').on('tap', function() {
		mui('#algorithmType').popover('toggle');
		document.getElementById("selDeepType").innerHTML = '速度有效值';
		selectObject.math_type = '0200';
		strRefreshmythtype = '0200';
		console.log("速度有效值 ===" + strRefreshmythtype)
		gainChartDataWithInstallXY(strRefreshCedian, strRefreshworkmodel, strRefreshmythtype, strRefreshtimelong,
			strRefreshtimes);
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
	// document.getElementById('screenOK').addEventListener('tap', beginQueryClicked);

	function beginQueryClicked() {

		//测点id
		var strInstallid = selectObject.id
		//工作模式
		var strWotkModel = '';
		var tempModel = $('#qushiModel').html();
		if (tempModel == '省电模式') {
			strWotkModel = '0'
		} else if (tempModel == '长连接模式') {
			strWotkModel = '1'
		}
		//算法
		var strMathType = '';
		var tempMath = $('#selDeepType').html();
		if (tempMath == '加速度有效值') {
			strMathType = '0002'
		} else if (tempMath == '速度有效值') {
			strMathType = '0200'
		}
		//时长
		var strTimeLong = ''
		if (strShowType == 0) {
			strTimeLong = '1'
		}
		if (strShowType == 1) {
			strTimeLong = '2'
		}
		if (strShowType == 2) {
			strTimeLong = '3'
		}
		if (strShowType == 3) {
			strTimeLong = '4'
		}
		if (strShowType == 4) {
			strTimeLong = '0'
		}
		//时间
		var strTimes = '';
		var tempTimes = $('#selectTimes').html();

		if (tempTimes == '请选择查询时间') {
			mui.toast('请选择查询时间');
			return false;
		}
		if (strShowType == 0) {
			strTimes = tempTimes.substr(0, 13)
		} else {
			strTimes = tempTimes;
		}


		console.log("开始查询数据====测点==" + strInstallid + '==工作模式==' + strWotkModel + '==算法==' + strMathType + '==时长==' +
			strTimeLong + '==时间==' + strTimes)

		gainChartDataWithInstallXY(strInstallid, strWotkModel, strMathType, strTimeLong, strTimes);

		strRefreshCedian = strInstallid;
		strRefreshworkmodel = strWotkModel;
		strRefreshmythtype = strMathType;
		strRefreshtimelong = strTimeLong;
		strRefreshtimes = strTimes;
		// toggleMenu();
	}



})
