//title
//var titleName = localStorage.getItem("deviceName");
//document.getElementById("titleText").innerHTML = titleName;
mui.toast("正在获取数据，请稍后...");
var caiyangData = new Array();
var ceDianArray = new Array();

//初始化数据
$.ajax({
	type: "get",
	url: new_commen_gain_detect_data_Interface,
	async: true,
	data: {
		devices_no: localStorage.DeveciId
	},
	dataType: 'json',
	success: function(respData) {
		if(respData.status == "SUCCESS") {

			if(respData.data.length != 'undefined') {

				if(typeof(respData.data) != "undefined") {
					if(typeof(respData.data.probeDrawVO) != "undefined") {
						if(typeof(respData.data.probeDrawVO.devices_name) != "undefined") {
							$("#titleText").html(respData.data.probeDrawVO.devices_name);
							// $("#titleText").html('长连接模式，长连接模式，长连接模式');
							localStorage.setItem("deviceName", respData.data.probeDrawVO.devices_name)
						}
					}
				}

				//波形
				loadDataWithDate(respData,'init');
				//趋势图
				// getInitData(respData.data);
				//特征值
				getDataFromInit(respData.data);
				if(typeof(respData.data.installList) != "undefined") {
					var cediandata = respData.data.installList;

					for(var i = 0; i < cediandata.length; i++) {
						var strings = cediandata[i];
						var objs = {
							text: strings
						}
						ceDianArray.push(objs);
					}
				}
				
				if(respData.data.probeDrawVO != 'undefined') {
					if(respData.data.timeIntervalVO != 'undefined' && respData.data.timeIntervalVO != undefined) {
						localStorage.setItem("StartTime", respData.data.timeIntervalVO.min_time);
						localStorage.setItem("EndTime", respData.data.timeIntervalVO.max_time);
						var timeStart = respData.data.timeIntervalVO.min_time;
						var timeEnd = respData.data.timeIntervalVO.max_time;
						var strPlace = respData.data.probeDrawVO.install_xy;
						getCaiYangDianData(timeStart, timeEnd, strPlace, "init", "");
					}

				}
			} else {
				// mui.toast("没有相关数据...");
			}
		} else {
			// mui.toast("没有相关数据...");
		}
	}
});
//获取采样时间数据
function getCaiYangDianData(startTime, strEndTime, instally, strInitOrChoose, zhouxian) {
	$.ajax({
		type: "get",
		url: new_commen_search_detect_data_Interface,
		async: true,
		data: {
			devices_no: localStorage.DeveciId,
			start_time: startTime,
			end_time: strEndTime,
			install_xy: instally
		},
		dataType: 'json',
		success: function(respData) {

			if(respData.status == "SUCCESS") {
				caiyangData.splice(0, caiyangData.length);
				if(respData.data.length > 0) {
					$("#boxing_weizhi").val(respData.data[0].sensor_no + "_" + respData.data[0].create_time.substr(0, respData.data[0].create_time.length - 2))
					strWeiZhi = respData.data[0].id;

					for(var i = 0; i < respData.data.length; i++) {
						var sensorObj = respData.data[i];
						var strTime = sensorObj.create_time;
						var strTimeUse = strTime.substr(0, strTime.length - 2);
						var strSensor = {
							text: sensorObj.sensor_no + "_" + strTimeUse,
							id: sensorObj.id
						};
						caiyangData.push(strSensor);
					}

					getDataFromInitWithCaiyang(ceDianArray, caiyangData, instally, caiyangData[0]);
					getDataFromInitWithBoxing(ceDianArray, caiyangData, instally, caiyangData[0]);
					if(strInitOrChoose == "init") {

					}
					if(strInitOrChoose == "choose") {
						getDataFromSeverWithParam(caiyangData[0].id, zhouxian);
					}

				} else {
					// mui.toast("没有相关数据...");
					$("#boxing_weizhi").val("");
					caiyangData.splice(0, caiyangData.length);
				}

			} else {
				mui.toast(respData.message);
			}
		},
		error: function(error) {
			mui.toast("获取数据失败，请重新获取...")
		}

	})

}

//根据筛选条件获取数据
function getDataFromSeverWithParam(proid, strZhouXaing) {
	mui.toast("正在请求数据...");

	if(proid != '' && proid != 'undefined' && proid != undefined) {
		$.ajax({
			type: "get",
			url: new_commen_gain_single_data_Interface,
			async: true,
			data: {
				devices_no: localStorage.DeveciId,
				probe_id: proid,
				axial_info: strZhouXaing
			},
			dataType: 'json',
			success: function(respData) {
				if(respData.status == "SUCCESS") {
					var proData = respData.data["probeDrawVO"];
					if(proData != undefined) {
						//波形
						loadDataWithDate(respData);
						//特征值
						getDataFromInit(respData.data);
					} else {
						// mui.toast("没有相关数据...");
						$("#chart_shiyu").hide();
						$("#chart_pinpu").hide();
						$("#chart_sudu").hide();
						$("#chart_baoluopu").hide();
					}
				} else {
					mui.toast(respData.message);
				}
			},
			error: function(error) {
				mui.toast("获取数据失败，请重新获取...")
			}

		})

	} else {
		mui.toast("筛选条件不得为空，请查看筛选条件是否正确填写！");
	}

}

var strUserType = localStorage.getItem("userType");
if(strUserType < 10) {
	$("#DisplayChangeDevice").hide();
	if(localStorage.getItem('is_manage') == '1'){
		$("#DisplayChangeDevice").show();
	}
}
if(strUserType > 10) {
	$("#DisplayChangeDevice").show();
}

//=========****************************  趋势图，波形图，特征值三个页面切换
//*********************** 在趋势图页面时，显示header上的 刷新和 长短连接模式 选择按钮

$('#qushiChart').on('tap',function(){
	$('#qushiRefresh').show();
	$('#queryClicked').show();
})

$('#boxingChart').on('tap',function(){
	$('#qushiRefresh').hide();
	$('#queryClicked').hide();
})

$('#tezhengChart').on('tap',function(){
	$('#qushiRefresh').hide();
	$('#queryClicked').hide();
})
