function getDataFromSever() {

	console.log("=========" + localStorage.simID);

	$.ajax({
		type: "get",
		url: commen_active_wait_Interface,
		async: true,
		data: {
			serial_no: localStorage.simID
		},
		dataType: 'json',
		success: function(msg) {
			console.log(JSON.stringify(msg))
			if(msg.status == "SUCCESS") {
				setDataToHtml(msg.data);
			} else {
				mui.toast(msg.message);
			}
		},
		error: function(error) {
//			console.log(JSON.stringify(error))
		}
	})
}
getDataFromSever();

function setDataToHtml(reqMsg) {
//	console.log(reqMsg.serial_no)
	if(reqMsg.serial_no != undefined) {
		$('#serialID').val(reqMsg.serial_no);
	} else {
		$('#serialID').val("----");
	}
//	console.log(reqMsg.connectionVO)
	///*
	if(reqMsg.connectionVO != undefined) {
		var timePO = reqMsg.connectionVO;
		$('#connect_severTime').val(timePO.connection_time);
		if (timePO.release_time != undefined) {
			$('#close_severTime').val(timePO.release_time);
		} else{
			$('#close_severTime').val("----");
		}
		
		if(timePO.status == "Y") {
			$('#severStatus').val("已连接");
		} else {
			$('#severStatus').val("未连接");
		}

	} else {
		$('#connect_severTime').val("----");
		$('#close_severTime').val("----");
		$('#severStatus').val("----");
	}

		if(reqMsg.sensor_no != undefined) {
			$('#id_lastuploadTime').val(reqMsg.sensor_no);
		} else {
			$('#id_lastuploadTime').val("----");
		}

	if(reqMsg.data_upload_status == "N") {
		$('#lastuploadStatus').val("未上传");
	} else if(reqMsg.data_upload_status == "Y") {
		$('#lastuploadStatus').val("已上传");
	} else {
		$('#lastuploadStatus').val("----");
	}
	//*/

	if(reqMsg.data_upload_time != undefined) {
		$('#lastuploadTime').val(reqMsg.data_upload_time);
	} else {
		$('#lastuploadTime').val("----");
	}

	if(reqMsg.sensorList != undefined) {
		var sensorList = reqMsg.sensorList;
		for(var i = 0; i < sensorList.length; i++) {
			var sensorStr = '<div class="sensorDiv">';
			sensorStr += '<div><span>传感器序列编号：</span><input disabled="disabled" value="' + sensorList[i].sensor_no + '"/></div>';
			sensorStr += '</div>';
			$('.center').append(sensorStr);
		}
	}
	

//	for(var i = 0; i < 1; i++) {
//		var sensorStr = '<div class="sensorDiv">';
//		sensorStr += '<div><span>传感器序列号：</span><input disabled="disabled" value="SA101500"/></div>';
//		sensorStr += '<hr>';
//		sensorStr += '</div>';
//
//		$('.center').append(sensorStr);
//	}

}
function refreshButtonClick(){
//	console.log("====");
	location.reload();
//	getDataFromSever();
}
