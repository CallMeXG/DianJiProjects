function isUndefined(list, key) {
	if(list == undefined || list == null || list[key] == null || list[key] == undefined) {
		val = '----';
		return val;
	} else {

		return list[key];
	}

}
getDataSever();

function getDataSever() {
	$.ajax({
		type: "get",
		url: commen_gain_device_detail_Interface,
		async: false,
		dataType: "json",
		data: {
			str_devices_no: localStorage.DeveciId
		},
		success: function(reqMsg) {
			console.log("+++++++" + JSON.stringify(reqMsg));
			if(reqMsg.status == "SUCCESS") {
				bulindingDataToHtml(reqMsg.data);
			} else {
				mui.toast(reqMsg.message);
			}
		}
	})
}

function bulindingDataToHtml(dataSource) {

	$("#idOFdeviceName").val(isUndefined(dataSource, "devices_name"));
	$("#idOFdeviceNUM").val(isUndefined(dataSource, "devices_no"));
	$("#idOFdeviceType").val(isUndefined(dataSource, "devices_model"));
	$("#idOFqiName").val(isUndefined(dataSource, "company"));
	$("#idOFdeviceTime").val(isUndefined(dataSource, "devices_out_time"));
	$("#idOFGonglv").val(isUndefined(dataSource, "devices_power"));
	$("#idOFAnzhuang").val(isUndefined(dataSource, "install_way"));
	$("#idOFdianya").val(isUndefined(dataSource, "work_voltage"));
	var strWorkStatus = workStatus(isUndefined(dataSource, 'work_status'));
	//工作状态
	$("#idOFWorkStatus").val(strWorkStatus);
	//设备预期寿命
	var age = 0;
	if(dataSource['devices_age']) age = dataSource['devices_age'];

	$('#bar').css({
		"background-color": "gray",
		'width': '40%',
		'display': 'inline-block',
		'height': '2px',
		'border-radius': '2px'
	});
	$('#bar i').css({
		"background-color": "#007aff",
		'width': age + '%',
		'display': 'inline-block',
		'height': '2px',
		'border-radius': '2px',
		'float': 'left'
	});

	if(dataSource.devices_waring == undefined) {
		$("#idOFguzhangtype").val("----");
	} else {
		var strGuzhangTyep = devicesWaring(isUndefined(dataSource, 'devices_waring'));
		$("#idOFguzhangtype").val(strGuzhangTyep);
	}
	$("#idOFchejian").val(isUndefined(dataSource, "work_shop"));
	$("#idOFshengchanLine").val(isUndefined(dataSource, "pro_line"));
	$("#idOFchangjing").val(isUndefined(dataSource, "use_scenes"));

	//	$("#idOFdeviceName").val(isUndefined(dataSource,""));
	//	$("#idOFdeviceName").val(isUndefined(dataSource,""));

}

function workStatus(val) {
	switch(val) {
		case 0:
			return "正常";
			break;
		case 1:
			return "待维护";
			break;
		case 2:
			return "待维修";
			break;
		default:
			return "未知";

	}
}

function submitbtnClick() {

//	var strUserType = localStorage.getItem("userType");
//	console.log(strUserType)
//	if(strUserType == USERTYPE_T) {
//		mui.toast("您的权限不足，不能进行点检");
//	}
//	if(strUserType == USERTYPE_Y) {
		console.log(JSON.stringify(setParamData()));
		console.log(commen_check_device_Interface)
		var bolCheck = setParamData();

		if(bolCheck != false) {
			$.ajax({
				type: "get",
				url: commen_check_device_Interface,
				async: false,
				data: bolCheck,
				dataType: "json",
				success: function(msg) {
					console.log(JSON.stringify(msg))
					if(msg.status == "SUCCESS") {
						mui.toast("点检成功");
						window.location.href = "check_done.html"
					} else {
						mui.toast(msg.message);
					}

				},
				error: function(msg) {
					mui.toast(msg.message);
				}
			});
		}

//	}

}

function setParamData() {
	var deviceId = $("#idOFdeviceNUM").val();
	var checkResult = $("#dianjianResult").val();
	if(checkResult == "点击选择") {
		mui.toast("请选择点检结果");
		return false;
	} else {
		//点检结果
		var strCheckResult = "";
		if(checkResult == "正常") {
			strCheckResult = "0";
		}
		if(checkResult == "故障") {
			strCheckResult = "1";
		}
		//点检员
		var checkName = $('#dianjianPerson').val();
		//点检时间
		var checkTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
		//点检说明
		var checkRemarK = $("#dianjianText").val();
		var data = {
			ck_name: checkName,
			ck_result: strCheckResult,
			ck_time: checkTime,
			ck_remark: checkRemarK,
			devices_no_list: deviceId,
			ck_status:"2"
		};
		return data;
	}

}

mui.plusReady(function() {

	$("#dianjianPerson").val(plus.storage.getItem("userName"));

	$("#dianjianResult").click(function() {
		var userPicker = new mui.PopPicker();
		var setdataArray = [{
			text: "正常"
		}, {
			text: "故障"
		}];
		userPicker.setData(setdataArray);
		var strid = "dianjianResult";
		var userResult = document.getElementById(strid);
		userPicker.show(function(items) {
			userResult.value = items[0].text;
		});
	});

	$('#look-checkPage').click(function() {
		window.location.href = "../Monitor.html";
	})

	$('#check_done').click(function() {
		window.location.href = '../index.html';
	})
	$('#check_next').click(function() {
		plus.storage.setItem("beforeScanPage", "2");
		//	alert(plus.storage.getItem("beforeScanPage"))
		window.location.href = '../ScanCode.html';
	})
})