//mui.plusReady(function() {

var companyArray = new Array();
var reginArray = new Array();
var companyID = null;
var regionID = null;

getInitCompany();

$('#addNewCPX').on('tap', function() {
	//	window.location.replace('devicelisttoscancode.html');
	localStorage.setItem('fatherID', 'updateDevice');
	
//	var webViewScan = plus.webview.create('devicelisttoscancode.html','devicelisttoscancode.html');
//	webViewScan.show();
	
//	mui.init({
//		subpages:[{
//			url:"devicelisttoscancode.html",
//			id:'devicelisttoscancode.html'
//		}]
//	})
	
	mui.openWindow({
		url: 'devicelisttoscancode.html',
		id: 'devicelisttoscancode.html'
	})
})

function getInitCompany() {
	$.ajax({
		type: "get",
		url: commen_gain_company_map_Interface,
		async: true,
		dataType: "json",
		success: function(respData) {
			console.log(JSON.stringify(respData))
			var dataArray = respData.data;
			for(var i = 0; i < dataArray.length; i++) {
				var subRegionArray = dataArray[i].region_list;
				var company_region = new Array();
				for(var j = 0; j < subRegionArray.length; j++) {
					var obj_subRegion = {
						value: subRegionArray[j].id,
						text: subRegionArray[j].region_name
					}
					company_region.push(obj_subRegion);
				}

				var obj_company = {
					value: dataArray[i].id,
					text: dataArray[i].company_name,
					children: company_region
				};
				companyArray.push(obj_company)
			}
		}
	});
}

//选择所属公司
$("#devices_company").click(function() {
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	userPicker.setData(companyArray);
	var strid = "devices_company";
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
		companyID = items[0].value;
		regionID = null;
		reginArray = items[0].children;
		$("#devices_region").val("");
	});
})
//选择所属厂区
$("#devices_region").click(function() {
	var userPicker = new mui.PopPicker();

	if(reginArray.length == 0) {
		var strCompay = $("#devices_company").val();
		for(var i = 0; i < companyArray.length; i++) {
			var companyText = companyArray[i].text;
			if(strCompay == companyText) {
				reginArray = companyArray[i].children;
			}
		}
	}

	userPicker.setData(reginArray);
	var strid = "devices_region";
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
		regionID = items[0].value;
	});
})

var CPXCount = 0;

$("#devices_out_time").jeDate({
	format: "YYYY-MM-DD"
})

$("#djjzgd").click(function() {
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();

	userPicker.setData([{
		text: "刚性"
	}, {
		text: "弹性"
	}]);
	var strid = "djjzgd";
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
	});
});

function isUndefined(list, key) {
	if(list == undefined || list == null || list[key] == null || list[key] == undefined) {
		val = '';
		return val;
	} else {

		return list[key];
	}

}

$("#addphoto").click(function() {
	var deviceId = $('#devices_no').html();
//	plus.storage.setItem('imgDeviceID', deviceId);
	localStorage.setItem('imgDeviceID', deviceId);
	mui.openWindow({
		url:'uploadpicture.html'
	})
//	mui.openWindow({
//		url: 'UploadImage.html'
//	})
})

/**
 * http://47.94.166.103:1111/APP/appGetSim
 * @param  emeId 传感器卡卡号
 */
function sensorData(emeId, i) {

	$.ajax({
		type: "get",
		async: true,
		data: {
			serial_no: emeId
		},
		url: commen_gain_sim_Interface,
		dataType: 'json',
		success: function(msg) {
			var data = msg.data;
			if(typeof(data) != "undefined") {

				var sensorStr = '<div class="tree-folder" >';
				sensorStr += '<div class="tree-folder-header"> <i style="hidden:display" onclick="hiddenOrDisplay(this)" class="icon-minus"></i><div class="tree-folder-name">' + isUndefined(data, 'sim_name') + ' ' + data.serial_no + '</div><div onclick="cancleCard(this)" class="cancle">取消关联</div></div>'
				sensorStr += '<div class="tree-folder-content" style="display: block;">';
				sensorStr += '<div hidden="hidden" class="modifyCom"><span class="name">传感器卡编号：</span><input type="button" class="sensor_num" id="CPXID' + i + '" value=' + data.serial_no + ' /></div>';

				//sensorStr += '<div class="modifyCom"><span class="name">传感器卡：</span><span class="serial_no">' + data.sim_name + ' ' + data.serial_no + '</span></div>';
				if(data.sim_name != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">名称：</span><span class="serial_no">' + data.sim_name + '</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">名称：</span><span class="serial_no">' + "----" + '</span></div>';

				}

				sensorStr += '<div hidden="hidden" class="modifyCom"><span class="name">12121212：</span><span class="serial_no">' + data.serial_no + '</span></div>';

				if(data.imei != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">IMEI：</span><span class="val">' + data.imei + '</span></div>';
				} else {
					sensorStr += '<div class="modifyCom"><span class="name">IMEI：</span><span class="val">' + "----" + '</span></div>';
				}
				//			sensorStr += '<div class="modifyCom"><span class="name">IMEI：</span><span class="val">' + data.imei + '</span><input class="sensor_num" type="hidden" value=' + data.serial_no + ' /></div>';
				if(data.internet_things_no != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">物联网卡：</span><span class="val">' + data.internet_things_no + '</span></div>';
				} else {
					sensorStr += '<div class="modifyCom"><span class="name">物联网卡：</span><span class="val">' + "----" + '</span></div>';
				}
				if(data.produce != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">生产厂商：</span><span class="val">' + data.produce + '</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">生产厂商：</span><span class="val">' + "----" + '</span></div>';

				}
				sensorStr += '<div class="modifyCom"><span class="name">生产批次：</span><span class="val">' + data.pro_bitch + '</span></div>';
				if(data.version != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">硬件版本：</span><span class="val">' + data.version + '</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">硬件版本：</span><span class="val">' + "----" + '</span></div>';

				}
				//			sensorStr += '<div class="modifyCom"><span class="name">当前状态：</span><span class="val">' + simState(data.state) + '</span><input class="workStatus" type="hidden" value=' + data.state + ' /></div>';

				if(data.local_time != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">本地时间：</span><span class="val">' + data.local_time + '</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">本地时间：</span><span class="val">' + "缺少----" + '</span></div>';

				}

				//sensorStr += '<div class="modifyCom"><span class="modifyFont">上传时间：</span><input type="text" class="cardUpdateTime"  value=' + data.upload_time + ' /></div>';
				//sensorStr += '<div class="modifyCom"><span class="name">卡固件版本：</span><span class="val">' + data.sim_verison_id + '</span></div>';
				if(data.content) {
					sensorStr += '<div class="divForMoreLine"><span class="name">维护日志：</span><span class="moreLine">' + "----" + '</span></div>';

				} else {
					sensorStr += '<div class="divForMoreLine"><span class="name">维修日志：</span><span class="moreLine">' + "" + '</span></div>';

				}
				if(typeof(data.mcc) != "undefined") {
					sensorStr += '<div class="modifyCom"><span class="name">小区信息：</span><span class="val"> ' + data.mcc + data.mnc + '-' + data.lac + '-' + data.cell_no + '-' + data.bsic + '</span></div>';
				} else {
					sensorStr += '<div class="modifyCom"><span class="name">小区信息：</span><span class="val"> ' + "----" + '</span></div>';
				}
				if(typeof(data.signal_intensity) == "undefined") {
					sensorStr += '<div class="modifyCom" style="height:40px;"><span class="name" style="margin-top:13px;">信号强度：&nbsp &nbsp</span><img src="img/xinhaoNO.png" height="35px" style="margin-top:1px;" /></div>';
				} else {
					if(data.signal_intensity == 0) {
						sensorStr += '<div class="modifyCom" style="height:40px;"><span class="name" style="margin-top:13px;">信号强度：&nbsp &nbsp</span><img src="img/xinhaonull.png" height="35px" style="margin-top:1px;" /></div>';
					}
					if((data.signal_intensity > 1 || data.signal_intensity == 1) && (data.signal_intensity < 8 || data.signal_intensity == 8)) {
						sensorStr += '<div class="modifyCom" style="height:40px;"><span class="name" style="margin-top:13px;">信号强度：&nbsp &nbsp</span><img src="img/xinhao1.png" height="35px" style="margin-top:1px;" /></div>';
					}
					if((data.signal_intensity > 9 || data.signal_intensity == 9) && (data.signal_intensity < 12 || data.signal_intensity == 12)) {
						sensorStr += '<div class="modifyCom" style="height:40px;"><span class="name" style="margin-top:13px;">信号强度：&nbsp &nbsp</span><img src="img/xinhao2.png" height="35px" style="margin-top:1px;" /></div>';
					}
					if((data.signal_intensity > 13 || data.signal_intensity == 13) && (data.signal_intensity < 17 || data.signal_intensity == 17)) {
						sensorStr += '<div class="modifyCom" style="height:40px;"><span class="name" style="margin-top:13px;">信号强度：&nbsp &nbsp</span><img src="img/xinhao3.png" height="35px" style="margin-top:1px;" /></div>';
					}
					if((data.signal_intensity > 18 || data.signal_intensity == 18) && (data.signal_intensity < 20 || data.signal_intensity == 20)) {
						sensorStr += '<div class="modifyCom" style="height:40px;"><span class="name" style="margin-top:13px;">信号强度：&nbsp &nbsp</span><img src="img/xinhao4.png" height="35px" style="margin-top:1px;" /></div>';
					}
					if((data.signal_intensity > 21 || data.signal_intensity == 21) && (data.signal_intensity < 25 || data.signal_intensity == 25)) {
						sensorStr += '<div class="modifyCom" style="height:40px;"><span class="name" style="margin-top:13px;">信号强度：&nbsp &nbsp</span><img src="img/xinhao5png" height="35px" style="margin-top:1px;" /></div>';
					}
					if((data.signal_intensity > 26 || data.signal_intensity == 26) && (data.signal_intensity < 31 || data.signal_intensity == 31)) {
						sensorStr += '<div class="modifyCom" style="height:40px;"><span class="name" style="margin-top:13px;">信号强度：&nbsp &nbsp</span><img src="img/xinhao6.png" height="35px" style="margin-top:1px;" /></div>';
					}

				}

				sensorStr += '<div class="modifyCom"><span class="name">电池电量：</span><span class="val"> ' + "----" + '</span></div>';
				sensorStr += '<div class="modifyCom"><span class="name">数据流量：</span><span class="val"> ' + "----" + '</span></div>';
				sensorStr += '<div class="modifyCom"><span class="name">工作状态：</span><span class="val"> ' + simState(data.state, data.work_status) + '</span></div>';
				if(data.active_time != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">激活时间：</span><span class="val">' + data.active_time + '</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">激活时间：</span><span class="val">' + "----" + '</span></div>';
				}
				if(data.sim_verison_id != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">固件版本：</span><span class="val">' + data.sim_verison_id + '</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">固件版本：</span><span class="val">' + "----" + '</span></div>';
				}

				//			sensorStr += '<div class="modifyCom"><span class="modifyFont">卡工作模式：</span><input type="text" class="cardModel" value=' + data.sim_model + ' /></div>';
				//			sensorStr += '<div class="modifyCom"><span class="modifyFont">卡LED灯模式：</span><input type="text" class="cardLedModel" value=' + data.led_model + ' /></div>';
				//			sensorStr += '<div class="modifyCom"><span class="modifyFont">数据采集模式：</span><input type="button" id="dataModel" onclick="dataModelClicked()" class="cardLedModel" value=' + data.led_model + ' /></div>';
				sensorStr += '<div class="modifyCom"><span class="modifyFont">数据采集模式：</span><input onclick="CPXModelClicked(' + i + ')" type="button" id="deviceCPX_model' + i + '" /></div>';
				//			if(data.sampling_time != undefined) {
				//				sensorStr += '<div class="modifyCom"><span class="modifyFont">数据采集时间：</span><input type="button" id="getDataTime' + i + '" onclick="getDataTime(' + i + ')" value=' + data.sampling_time + ' /></div>';
				//
				//			} else {
				//				sensorStr += '<div class="modifyCom"><span class="modifyFont">数据采集时间：</span><input type="button" id="getDataTime' + i + '" onclick="getDataTime(' + i + ')" /></div>';
				//			}

				sensorStr += '<div class="modifyCom"><span class="modifyFont">数据采集时间：</span></div>';

				sensorStr += '<div class="checkBox_24">' +
					'<div><input name="item_' + i + '" id="chebox_0"  type="checkbox"><p>00:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_1"  type="checkbox"><p>01:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_2"  type="checkbox"><p>02:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_3"  type="checkbox"><p>03:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_4"  type="checkbox"><p>04:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_5"  type="checkbox"><p>05:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_6"  type="checkbox"><p>06:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_7"  type="checkbox"><p>07:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_8"  type="checkbox"><p>08:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_9"  type="checkbox"><p>09:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_10"  type="checkbox"><p>10:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_11"  type="checkbox"><p>11:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_12"  type="checkbox"><p>12:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_13"  type="checkbox"><p>13:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_14"  type="checkbox"><p>14:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_15"  type="checkbox"><p>15:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_16"  type="checkbox"><p>16:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_17"  type="checkbox"><p>17:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_18"  type="checkbox"><p>18:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_19"  type="checkbox"><p>19:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_20"  type="checkbox"><p>20:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_21"  type="checkbox"><p>21:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_22"  type="checkbox"><p>22:00:00</p></div>' +
					'<div><input name="item_' + i + '" id="chebox_23"  type="checkbox"><p>23:00:00</p></div>' +
					'</div>';
				//			sensorStr += '<div class="checkBox_24"><input name="item" id="box'+i+'" type="checkbox" value="0"/></div>';

				if(data.sampling_duration != undefined) {
					sensorStr += '<div class="modifyCom"><span class="modifyFont">数据采集周期：</span><input type="button" id="timeLangth' + i + '" onclick="timeLangth(' + i + ')" value=' + data.sampling_duration + ' /><span>s</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="modifyFont">数据采集周期：</span><input type="button" id="timeLangth' + i + '" onclick="timeLangth(' + i + ')" /><span>s</span></div>';
				}
				//			if(data.upload_time_mode != undefined) {
				//				sensorStr += '<div class="modifyCom"><span class="modifyFont">数据上传时间：</span><input type="button" id="uploadTime' + i + '" onclick="uploadTime(' + i + ')"  value=' + data.upload_time_mode + ' /></div>';
				//
				//			} else {
				//				sensorStr += '<div class="modifyCom"><span class="modifyFont">数据上传时间：</span><input type="button" id="uploadTime' + i + '" onclick="uploadTime(' + i + ')"  /></div>';
				//			}
				if(data.update_duration != undefined) {
					sensorStr += '<div class="modifyCom"><span class="modifyFont">数据上传周期：</span><input type="button" id="uploadZhouqi' + i + '" onclick="uploadZhouqifun(' + i + ')"  value=' + data.update_duration + ' /></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="modifyFont">数据上传周期：</span><input type="button" id="uploadZhouqi' + i + '" onclick="uploadZhouqifun(' + i + ')"  /></div>';
				}

				sensorStr += '</div>';

				sensorStr += '<div class="tree-folder-content" style="display: block;">';

				//			if(data.sensorList != undefined || data.sensorList != '' || data.sensorList != 'undifined' || data.hasOwnProperty('sensorList') == true) {
				//			console.log(JSON.stringify(data.sensorList))
				if(typeof(data.sensorList) != 'undefined') {

					senData = data.sensorList;

					for(var j = 0; j < senData.length; j++) {
						sensorStr += '<div class="tree-folder"><div class="tree-folder-header"> <i></i><div class="tree-folder-name chuanNameNumber' + i + '">SE-L01智能传感器:' + senData[j].sensor_no + '</div></div></div></div>';
						sensorStr += '<div class="tree-folder-content" style="display: block;">';
						sensorStr += '<div hidden="hidden" class="modifyCom"><span class="modifyFont">卡编号：</span><input id="cardID' + i + j + '" type="button" class="topology" value=' + senData[j].serial_no + ' /><span>点</span></div>';
						sensorStr += '<div hidden="hidden" class="modifyCom"><span class="modifyFont">传感器编号：</span><input id="chuanID' + i + j + '" type="button" class="topology" value=' + senData[j].sensor_no + ' /><span>点</span></div>';

						if(senData[j].version != undefined) {
							sensorStr += '<div class="modifyCom"><span>硬件版本：</span><span class="val">' + senData[j].version + '</span></div>';
						} else {
							sensorStr += '<div class="modifyCom"><span>硬件版本：</span><span class="val">' + "----" + '</span></div>';

						}
						if(senData[j].fw_version != undefined) {
							sensorStr += '<div class="modifyCom"><span>固件版本：</span><span class="val">' + senData[j].fw_version + '</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span >固件版本：</span><span class="val">' + "----" + '</span></div>';

						}
						if(senData[j].calibration_time != undefined) {
							sensorStr += '<div class="modifyCom"><span class="name">校准日期：</span><span class="val">' + senData[j].calibration_time + '</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">校准日期：</span><span class="val">' + "----" + '</span></div>';
						}

						if(senData[j].topology_xy != undefined) {
							sensorStr += '<div class="modifyCom"><span class="name">MODBUS地址：</span><span class="val">' + senData[j].topology_xy + '</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">MODBUS地址：</span><span class="val">' + "----" + '</span></div>';
						}

						if(senData[j].sensor_status != undefined) {
							if(senData[j].sensor_status == 0) {
								sensorStr += '<div class="modifyCom"><span class="name">传感器状态：</span><span class="val">' + "正常" + '</span></div>';
							}
							if(senData[j].sensor_status == 1) {
								sensorStr += '<div class="modifyCom"><span class="name">传感器状态：</span><span class="val">' + "损坏" + '</span></div>';
							}

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">传感器状态：</span><span class="val">' + "----" + '</span></div>';
						}

						if(senData[j].sensitives != undefined) {
							sensorStr += '<div class="modifyCom"><span class="name">温度传感器灵敏度：</span><span class="val">' + senData[j].sensitives + '</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">温度传感器灵敏度：</span><span class="val">' + "----" + '</span></div>';
						}

						if(senData[j].probe_name != undefined) {
							sensorStr += '<div class="modifyCom"><span class="name">振动探头名称：</span><span class="emeId">' + senData[j].probe_name + '</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">振动探头名称：</span><span class="emeId">' + "----" + '</span></div>';

						}
						if(senData[j].sensitivity != undefined) {
							sensorStr += '<div class="modifyCom"><span class="name">振动传感器灵敏度：</span><span class="val">' + senData[j].sensitivity + '</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">振动传感器灵敏度：</span><span class="val">' + "----" + '</span></div>';

						}
						if(senData[j].install_xy != undefined) {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">安装位置：</span><input id="anzhuang' + i + j + '" type="text"  value=' + senData[j].install_xy + ' /></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">安装位置：</span><input id="anzhuang' + i + j + '" type="text"  class="sensorLocation"/></div>';

						}
						if(senData[j].sampling_model != undefined) {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号模式：</span><input id="caiyangmodel' + i + j + '" type="button" onclick="caiyangModelClick(' + i + ',' + j + ')" class="sensorLocation" value=' + senData[j].sampling_model + ' /></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号模式：</span><input id="caiyangmodel' + i + j + '" type="button" onclick="caiyangModelClick(' + i + ',' + j + ')" class="sensorLocation"/></div>';

						}

						if(senData[j].sampling_number != undefined) {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号点数：</span><input id="caiyangcount' + i + j + '"  onclick="caiyangcountClick(' + i + ',' + j + ')" type="button" class="topology" value=' + senData[j].sampling_number + ' /><span style="margin-left:1px">点</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号点数：</span><input id="caiyangcount' + i + j + '"  onclick="caiyangcountClick(' + i + ',' + j + ')" type="button" class="topology" /><span style="margin-left:1px">点</span></div>';

						}

						if(senData[j].sampling_frequency != undefined) {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号频率：</span><input onclick="caiyangpinlvClick(' + i + ',' + j + ')" id="caiyangpinlv' + i + j + '" type="button" class="sensorLocation" value=' + senData[j].sampling_frequency + ' /><span style="margin-left:1px">Hz</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号频率：</span><input onclick="caiyangpinlvClick(' + i + ',' + j + ')" id="caiyangpinlv' + i + j + '" type="button" class="sensorLocation"/><span style="margin-left:1px">Hz</span></div>';

						}

						if(senData[j].range_data != undefined) {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号量程：</span><input id="caiyangliangcheng' + i + j + '"  onclick="caiyangliangchengClick(' + i + ',' + j + ')" type="button" class="sensorLocation" value=' + senData[j].range_data + ' /></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号量程：</span><input id="caiyangliangcheng' + i + j + '"  onclick="caiyangliangchengClick(' + i + ',' + j + ')" type="button" class="sensorLocation"/></div>';

						}

						if(senData[j].sampling_accuracy != undefined) {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号精度：</span><input id="caiyangjingdu' + i + j + '"  onclick="caiyangjingduClick(' + i + ',' + j + ')" type="button" class="sensorLocation" value=' + senData[j].sampling_accuracy + ' /><span style="margin-left:1px">bit</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号精度：</span><input id="caiyangjingdu' + i + j + '"  onclick="caiyangjingduClick(' + i + ',' + j + ')" type="button" class="sensorLocation"/><span style="margin-left:1px">bit</span></div>';

						}
						//sensorStr += '<div class="modifyCom"><span class="modifyFont">传感器工作轴数（至少选择一个轴工作）：</span><input type="button" class="sensorLocation" value=' + "----" + ' /></div>';

						sensorStr += '<div class="modifyCom"><span class="modifyFont">传感器工作轴数（至少选择一个轴工作）：</span></div>';
						sensorStr += setCheckButton(i, j, senData[j].working_axis);

						if(senData[j].calibration_coefficient != undefined) {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">传感器频率校准系数：</span><input style="width:100px" id="jiaoxishu' + i + '' + j + '" type="text" class="sensorLocation" value=' + senData[j].calibration_coefficient + ' /></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">传感器频率校准系数：</span><input  style="width:100px" id="jiaoxishu' + i + '' + j + '" type="text " class="sensorLocation " /></div>';

						}

					}

					sensorStr += '<br/><br/></div>';
				}

				sensorStr += '</div>';
				$('#tree1').append(sensorStr)

			}

			if(typeof(data) != "undefined") {
				var itemKey = '[name=item_' + i + ']:checkbox';
				$(itemKey).each(function(index) {
					var arrTimeCount = JSON.parse(data.work_point_json).sample_time_point;
					//				console.log("===" + arrTimeCount);
					var idType = arrTimeCount[index];
					var bolCheck = false;
					if(idType == 1) {
						bolCheck = true;
					}
					$(this).prop("checked", bolCheck);
				})
			}

			if(typeof(data) != "undefined") {
				if(data.sensorList != undefined) {

					var whxSenData = data.sensorList;
					for(var j = 0; j < whxSenData.length; j++) {
						var strWorking = whxSenData[j].working_axis;
						checkwork_axis(i, j, strWorking);
					}
				}
			}

		}
	})

	//	return sensor;
}


function getDate(tm) {
	var tt = new Date(parseInt(tm)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ")
	return tt;

}

function sensorStatus(val) {
	switch(val) {
		case 0:
			return "正常";
			break;
		case 1:
			return "损坏";
			break;
	}

}

function simState(statue, work_statues) {

	var sta_1 = statue;

	var sta_2 = work_statues;
	var strStute = "";
	///*
	if(sta_1 == 5) {
		if(sta_2 == 0) {
			strStute = "工作";
		}
		if(sta_2 == 1) {
			strStute = "失联";
		}
		if(sta_2 == 2) {
			strStute = "关机";
		}
		if(sta_2 == 3) {
			strStute = "休眠";
		}
		if(sta_2 == 4) {
			strStute = "故障";
		}

	}
	if(sta_1 == 6) {
		strStute = "未激活";
	}
	if(sta_1 == 7) {
		strStute = "待激活";
	}
	return strStute;
	//*/

}

///*
function buildSensorData(sim) {
	console.log("--------" + JSON.stringify(sim));

	var cheArray = [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1];

	for(var i = 0; i < sim.length; i++) {
		sensorData(sim[i]['serial_no'], i);
	}
}


//*/

function setCheckButton(i, j, str_working) {

	return '<label class="checkLabel"><input id="xzhou' + i + j + '" class="checkXYZBox" type="checkbox" value="" />X轴 </label><label class="checkLabel"><input id="yzhou' + i + j + '" class="checkXYZBox" type="checkbox" value="" />Y轴 </label><label class="checkLabel"><input id="zzhou' + i + j + '" class="checkXYZBox" type="checkbox" value="" />Z轴 </label>';

}
//传感器工作轴数
function checkwork_axis(i, j, str_working) {

	if(str_working != undefined) {
		var xaxis = str_working.substring(0, 1);
		var yaxis = str_working.substring(1, 2);
		var zaxis = str_working.substring(2, 3);

		if(xaxis == "1") {
			var strXinputid = "xzhou" + i + j;
			var obj_xinput = document.getElementById(strXinputid);
			obj_xinput.checked = true;
		}
		if(yaxis == "1") {
			var strYinputid = "yzhou" + i + j;
			var obj_Yinput = document.getElementById(strYinputid);
			obj_Yinput.checked = true;
		}
		if(zaxis == "1") {
			var strZinputid = "zzhou" + i + j;
			var obj_Zinput = document.getElementById(strZinputid);
			obj_Zinput.checked = true;
		}
	}

}

function getDataTime(index) {
	var ids = "#getDataTime" + index;
	$.jeDate(ids, {
		format: "hh:mm:ss",
		language: {
			name: "cn",
			times: ["小时", "分钟", "秒"],
			titText: "请选择时间",
			clear: "清空",
			today: "现在",
			yes: "确定",
			close: "关闭"
		}
	})
}

function timeLangth(index) {
	var ids = "#timeLangth" + index;
	//	console.log(ids)
	$.jeDate(ids, {
		format: "hh:mm:ss",
		language: {
			name: "cn",
			times: ["小时", "分钟", "秒"],
			titText: "请选择时间",
			clear: "清空",
			today: "现在",
			yes: "确定",
			close: "关闭"
		}
	})

}

function uploadTime(index) {
	var ids = "#uploadTime" + index;
	//	console.log(ids)
	$.jeDate(ids, {
		format: "hh:mm:ss",
		language: {
			name: "cn",
			times: ["小时", "分钟", "秒"],
			titText: "请选择时间",
			clear: "清空",
			today: "现在",
			yes: "确定",
			close: "关闭"
		}
	})
}
//上传周期
function uploadZhouqifun(index) {
	var ids = "#uploadZhouqi" + index;
	//	console.log(ids)
	$.jeDate(ids, {
		format: "hh:mm:ss",
		language: {
			name: "cn",
			times: ["小时", "分钟", "秒"],
			titText: "请选择时间",
			clear: "清空",
			today: "现在",
			yes: "确定",
			close: "关闭"
		}
	})
}

//初始化数据采集模式,数据采集时间、采集周期、数据上传时间
function getStringForHtml(modelID, typeId) {

	///*
	var strReturn = "";

	$.ajax({
		type: "get",
		async: true,
		data: {
			mode_name: modelID
		},
		url: commen_gain_model_list_Interface,
		dataType: 'json',
		success: function(msg) {
			if(typeId == 0) {
				strReturn = msg.data[0].mode_name;
			}
			if(typeId == 1) {
				strReturn = msg.data[0].sampling_time;
			}
			if(typeId == 2) {
				strReturn = msg.data[0].sampling_duration;
			}
			if(typeId == 3) {
				strReturn = msg.data[0].upload_time;
			}
		}
	});
	return strReturn;
	//*/
}
//修改数据采集模式，并根据模式自动刷新下面三个时间
var arrayDataModel = new Array();
var dataModelType = "";
getModelDatasource();
//先获取总的模式，
function getModelDatasource() {
	$.ajax({
		type: "get",
		async: true,
		url: commen_gain_model_list_Interface,
		dataType: 'json',
		success: function(msg) {
			arrayDataModel = msg.data;
		}
	});
}
//提供数据到选择列表
function CPXModelClicked(indexPathRow) {
	//普通示例
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	for(var i = 0; i < arrayDataModel.length; i++) {
		var setdataDic = {
			text: arrayDataModel[i].mode_name
		};
		setdataArray.push(setdataDic);
	}
	userPicker.setData(setdataArray);
	var strid = "deviceCPX_model" + indexPathRow;
	//	console.log(strid);
	var userResult = document.getElementById(strid);
	//  var userResult = $(".deviceCPX_model");
	//  console.log(indexPathRow);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
		dataModelType = userResult.value;
		//返回 false 可以阻止选择框的关闭
		//return false;
		//		console.log(userResult.value+indexPathRow);
		updateTimes(userResult.value, indexPathRow);
	});

}

function updateTimes(modelID, index) {
	console.log("-=-=-=-")
	$.ajax({
		type: "get",
		async: true,
		data: {
			mode_name: modelID
		},
		url: commen_gain_model_list_Interface,
		dataType: 'json',
		success: function(msg) {

			console.log("++++" + JSON.stringify(msg))

			//			var firststr = "getDataTime" + index;
			var secondstr = "timeLangth" + index;
			//			var thirdstr = "uploadTime" + index;
			var uploadZhouqi = "uploadZhouqi" + index;

			//			var getdatatimeobj = document.getElementById(firststr);
			var timelengthobj = document.getElementById(secondstr);
			//			var uploadTimeobj = document.getElementById(thirdstr);
			var uploadZhouqiobj = document.getElementById(uploadZhouqi);

			timelengthobj.value = msg.data[0].sampling_duration;
			//			getdatatimeobj.value = msg.data[0].sampling_time;
			//			uploadTimeobj.value = msg.data[0].upload_time;
			uploadZhouqiobj.value = msg.data[0].update_duration;

			var dataCaijiTime = msg.data[0].sampling_time;
			var caijiTimeHours = dataCaijiTime.substr(0, 2);
			var numCaiTime = parseInt(caijiTimeHours);
			var caijiArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			caijiArray[numCaiTime] = 1;
			setDataForNewCaijiTime(caijiArray, index);

		}
	});

}

function setDataForNewCaijiTime(dataSource, indexs) {
	var keyItems = '[name=item_' + indexs + ']:checkbox'
	$(keyItems).each(function(index) {
		var idType = dataSource[index];
		var bolCheck = false;
		if(idType == 1) {
			bolCheck = true;
		}
		$(this).prop("checked", bolCheck);
	})
}
//全局变量，信号采样模式的datasource
var caiyangModelArray = new Array();
//从服务器获取采样模式等信息,总体的
getCaiModelData();

function getCaiModelData() {
	$.ajax({
		type: "get",
		url: commen_gain_sampling_model_list_Interface,
		async: true,
		dataType: "json",
		success: function(respMsg) {
			if(respMsg.status == "SUCCESS") {

				caiyangModelArray = respMsg.data;

			} else {
				mui.toast(respMsg.message);
			}
		}
	})
}

//采样信号模式
function caiyangModelClick(index_1, index_2) {

	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	for(var i = 0; i < caiyangModelArray.length; i++) {
		setdataArray.push({
			text: caiyangModelArray[i].mode_name,
			sampling_number: caiyangModelArray[i].sampling_number,
			sampling_frequency: caiyangModelArray[i].sampling_frequency,
			range_data: caiyangModelArray[i].range_data,
			sampling_accuracy: caiyangModelArray[i].sampling_accuracy,
			calibration_coefficient: caiyangModelArray[i].calibration_coefficient,
			working_axis: caiyangModelArray[i].working_axis
		});

	}
	userPicker.setData(setdataArray);
	var strid = "caiyangmodel" + index_1 + index_2;
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;

		//采样点数
		var caiCountStr = "#caiyangcount" + index_1 + index_2;
		$(caiCountStr).val(items[0].sampling_number);
		//采样频率
		var strCaiyangpinlv = "#caiyangpinlv" + index_1 + index_2;
		$(strCaiyangpinlv).val(items[0].sampling_frequency);
		//采样量程
		var strCaiyangliangcheng = "#caiyangliangcheng" + index_1 + index_2;
		$(strCaiyangliangcheng).val(items[0].range_data + "g");
		//采样精度
		var strCaiyangjingdu = "#caiyangjingdu" + index_1 + index_2;
		$(strCaiyangjingdu).val(items[0].sampling_accuracy);
		//工作轴数
		var xyzzhou = items[0].working_axis;
		var xaxis = xyzzhou.substring(0, 1);
		var yaxis = xyzzhou.substring(1, 2);
		var zaxis = xyzzhou.substring(2, 3);

		if(xaxis == "1") {
			var strXinputid = "xzhou" + index_1 + index_2;
			var obj_xinput = document.getElementById(strXinputid);
			obj_xinput.checked = true;
		}
		if(yaxis == "1") {
			var strYinputid = "yzhou" + index_1 + index_2;
			var obj_Yinput = document.getElementById(strYinputid);
			obj_Yinput.checked = true;
		}
		if(zaxis == "1") {
			var strZinputid = "zzhou" + index_1 + index_2;
			var obj_Zinput = document.getElementById(strZinputid);
			obj_Zinput.checked = true;
		}
		//校准系数
		var strCaiyangxishu = "#jiaoxishu" + index_1 + index_2;
		$(strCaiyangxishu).val(items[0].calibration_coefficient);
		console.log(JSON.stringify(items))
	});

}
//采样点数
function caiyangcountClick(index_1, index_2) {
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	var sum = 256;
	setdataArray.push({
		text: sum
	});
	for(var i = 0; i < 7; i++) {
		sum = sum * 2;
		var textDic = {
			text: sum
		};
		setdataArray.push(textDic);
	}
	//	for(var i = 0; i < arrayDataModel.length; i++) {
	//		var setdataDic = {
	//			text: arrayDataModel[i].mode_name
	//		};
	//		setdataArray.push(setdataDic);
	//	}
	userPicker.setData(setdataArray);
	var strid = "caiyangcount" + index_1 + index_2;
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
	});
}
//采样频率
function caiyangpinlvClick(index_1, index_2) {

	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	//	for(var i = 0; i < arrayDataModel.length; i++) {
	//		var setdataDic = {
	//			text: arrayDataModel[i].mode_name
	//		};
	//		setdataArray.push(setdataDic);
	//	}
	userPicker.setData([{
		text: "200"
	}, {
		text: "400"
	}, {
		text: "800"
	}, {
		text: "1600"
	}, {
		text: "3200"
	}]);
	var strid = "caiyangpinlv" + index_1 + index_2;
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
	});

}
//采样量程
function caiyangliangchengClick(index_1, index_2) {
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();

	userPicker.setData([{
		text: "±2g"
	}, {
		text: "±4g"
	}, {
		text: "±8g"
	}, {
		text: "±16g"
	}]);
	var strid = "caiyangliangcheng" + index_1 + index_2;
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
	});
}
//采样精度
function caiyangjingduClick(index_1, index_2) {

	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	for(var i = 10; i < 49; i++) {
		var setdataDic = {
			text: i
		};
		setdataArray.push(setdataDic);
	}
	userPicker.setData(setdataArray);
	var strid = "caiyangjingdu" + index_1 + index_2;
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
	});

}
getDefData();

function getDefData() {
	$.ajax({
		type: "get",
		async: true,
		data: {
			str_devices_no: localStorage.DeveciId
		},
		url: commen_gain_device_detail_Interface,
		dataType: 'json',
		success: function(msg) {
			localStorage.setItem('ActiveMZDevice', JSON.stringify(msg.data));
			var data = msg.data;
			var sim_list = null;
			if(data.hasOwnProperty("sim_list") == true) {
				sim_list = data.sim_list;
				CPXCount = sim_list.length;
				buildSensorData(sim_list);
			} else {

			}
			//		var sim_list = data.sim_list;
			var list = msg.data.list;

			//			$('#company_name').val(isUndefined(data, 'company'));
			$('#devices_name').val(isUndefined(data, 'devices_name'));
			$('#devices_no').html(isUndefined(data, 'devices_no'));
			//企业名称
			$('#devices_company').val(isUndefined(data, 'company_name'));
			//分厂
			$('#devices_region').val(isUndefined(data, 'region_name'));
			$('#devices_model').val(isUndefined(data, 'devices_model'));
			$('#devices_out_time').val(data.devices_out_time);
			$('#devices_power').val(isUndefined(data, 'devices_power'));
			$('#install_way').val(isUndefined(data, 'install_way'));

			if(data.work_voltage != undefined) {
				$('#work_voltage').val(isUndefined(data, 'work_voltage'));
			}

			$('#devices_produce').val(isUndefined(data, 'devices_produce'));
			$('#power_factor').val(isUndefined(data, 'power_factor'));
			$('#protection').val(isUndefined(data, 'protection'));
			$('#insulation').val(isUndefined(data, 'insulation'));
			$('#bearing_model').val(isUndefined(data, 'bearing_model'));
			//-------新增
			$('#djedzs').val(isUndefined(data, 'rated_speed'));
			$('#djcjds').val(isUndefined(data, 'magnetism_pair'));
			$('#djjzgd').val(isUndefined(data, 'base_rigidity'));
			$('#djlaqlx').val(isUndefined(data, 'coupling_type'));
			//		$('#bearing_model').val(isUndefined(data, 'bearing_model'));
			$('#clxcls').val(isUndefined(data, 'gearbox_gear_pair'));
			$('#clxcdb').val(isUndefined(data, 'gearbox_transmission_ratio'));
			//-------
			//			$('#work_shop').val(isUndefined(data, 'work_shop'));
			$('#pro_line').val(isUndefined(data, 'pro_line'));
			$('#use_scenes').val(isUndefined(data, 'use_scenes'));
			$('#create_time').val(isUndefined(data, 'update_time'));
			$('#m_content').val(isUndefined(data, 'content'));

			//		buildSensorData(sim_list);

		}
	});

}

function getLocalTime(nS) {
	return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

function hiddenOrDisplay(obj) {
	var header = $(obj).parent().parent();

	var className = $(obj).prop('class');
	if(className == 'icon-plus') {
		$(obj).prop('class', 'icon-minus');
		$(header).find('.tree-folder-content').css('display', 'block');

		//		$(header).next().next().css('display', 'block');
	} else if(className == 'icon-minus') {
		$(obj).prop('class', 'icon-plus');
		$(header).find('.tree-folder-content').css('display', 'none');
		//		$(header).next().next().css('display', 'none');
	}
}

/**
 * 取消关联
 */
function cancleCard(obj) {
	var btnArray = ["否", "是"];
	mui.confirm("你确定要取消关联吗？", "系统提示", btnArray, function(e) {
		if(e.index == 1) {
			var deviceId = $('#devices_no').html();
			var treeFolder = $(obj).parent().parent();
			var emeId = $(treeFolder).find('.sensor_num').val();
			var workStatus = $(treeFolder).find('.workStatus').val();
			var cardModel = $(treeFolder).find('.cardModel').val();
			var cardLedModel = $(treeFolder).find('.cardLedModel').val();

			//			console.log(deviceId + "====" + emeId)

			///*
			$.ajax({
				type: 'get',
				async: true,
				dataType: 'json',
				//		url: 'http://47.94.166.103:1111/APP/commen_cancel_relation',
				url: commen_cancel_relation_Interface,
				data: {
					devices_no: deviceId,
					serial_no: emeId,
				},
				success: function(msg) {
					//			console.log(JSON.stringify(msg))
					if(msg.status == "SUCCESS") {
						mui.toast(msg.message);
						$(treeFolder).remove();
						//				getDefData();
						window.location.reload();
						var fatherWeb = plus.webview.currentWebview().opener();
						mui.fire(fatherWeb, 'activeBack');
					}
				}
			})
			//*/
		}
	});

}

/**
 * 添加新卡
 */

$('#addNewDevice').click(function() {
	var deviceId = $('#devices_no').html();
	//		plus.storage.setItem('deviceId',deviceId);

	window.location.href = "ScanCode.html";

})

function getCaijishijian(caijiTimeIndex) {
	var checkedArray = new Array(); //放已经选择的checkbox的value
	var count; //已经选择的个数
	checkedArray.length = 0;
	count = 0;
	var indexPathTitle = '[name=item_' + caijiTimeIndex + ']:checkbox';
	$(indexPathTitle).each(function() {
		var checkBol = $(this).is(':checked');

		var cheNum = 0;
		if(checkBol == true) {
			cheNum = 1;
		}
		//		console.log('=========' + $(this).attr('id'))
		checkedArray.push(cheNum);
		count++;
	});
	if(checkedArray.length == 0) {
		alert("采集时间至少选择一个");
		return;
	}

	return checkedArray.toString();

	//	confirm("已选复选框的值：" + checkedArray + "\n" + "选中的复选框个数：" + count);
}

/**
 *修改设备信息
 */
$('#FinshBth').click(function() {

	var postParam = finshBtnClickReturnData();
	if(postParam != false) {
		postData(postParam);
	}

})

function finshBtnClickReturnData() {
	//电机额定转速
	var obj_djedzs = $('#djedzs').val();
	//电机磁极对数
	var obj_djcjds = $('#djcjds').val();
	//电机基座刚度
	var obj_djjzgd = $('#djjzgd').val();
	//电机联轴器类型
	var obj_djlaqlx = $('#djlaqlx').val();
	//齿轮箱齿轮齿数
	var obj_clxcls = $('#clxcls').val();
	//齿轮箱传动比
	var obj_clxcdb = $('#clxcdb').val();

	var boldjedzs = checkNewBolNumber(obj_djedzs, "电机额定转速", "djedzs");
	var boldjcjds = checkNewBolNumber(obj_djcjds, "电机磁极对数", "djcjds");
	var bolclxcls = checkNewBolNumber(obj_clxcls, "齿轮箱齿轮齿数", "clxcls");
	var bolclxcdb = checkNewBolNumber(obj_clxcdb, "齿轮箱传动比", "clxcdb");

	if(boldjedzs == false || boldjcjds == false || bolclxcls == false || bolclxcdb == false) {
		return false;
	} else {
		///*
		var deviceId = $('#devices_no').html();
		//企业名称
		//		var company_name = $('#company_name').val();
		//		if(company_name == '' || company_name == undefined) {
		//			mui.toast('企业名称不能为空');
		//			return false;
		//		}
		//设备名称
		var devices_name = $('#devices_name').val();
		if(devices_name == '' || devices_name == undefined) {
			mui.toast('设备名称不能为空');
			return false;
		}
		//企业名称
		var devices_company = $('#devices_company').val();
		if(devices_company == '' || devices_company == undefined) {
			mui.toast('企业名称不能为空');
			return false;
		}
		//分厂
		var devices_region = $('#devices_region').val();
		if(devices_region == '' || devices_region == undefined) {
			mui.toast('分厂不能为空');
			return false;
		}
		//设备型号
		var devices_model = $('#devices_model').val();

		//设备出厂时间
		var devices_out_time = $('#devices_out_time').val();

		//功率
		var devices_power = $('#devices_power').val();

		//安装方式
		var install_way = $('#install_way').val();

		//工作电压
		var work_voltage = parseInt($('#work_voltage').val());

		//设备生产厂商
		var devices_produce = $('#devices_produce').val();

		//功率因数
		var power_factor = $('#power_factor').val();

		//防护等级
		var protection = $('#protection').val();

		//绝缘等级
		var insulation = $('#insulation').val();

		//设置内置轴承型号
		var bearing_model = $('#bearing_model').val();

		//分厂
		//		var work_shop = $('#work_shop').val();
		//		if(work_shop == '' || work_shop == undefined) {
		//			mui.toast('分厂不能为空');
		//			return false;
		//		}
		//生产线
		var pro_line = $('#pro_line').val();
		if(pro_line == '' || pro_line == undefined) {
			mui.toast('生产产线不能为空');
			return false;
		}
		//设备应用场景
		var use_scenes = $('#use_scenes').val();
		if(use_scenes == '' || use_scenes == undefined) {
			mui.toast('应用场景不能为空');
			return false;
		}

		//维修记录
		var content = $('#m_content').val();
		//设备维修日期
		var cardUpdateTime = $('#create_time').val();

		//
		var cancle = $('.cancle');

		var paramData = new Object();
		paramData.strLoginId = localStorage.getItem("strLoginId");
		paramData.strLoginToken = localStorage.getItem("strLoginToken");
		//		paramData.company = company_name;
		paramData.devices_no = deviceId;
		if(companyID != undefined) {
			paramData.company_id = companyID;
		}
		if(regionID != undefined) {
			paramData.region_id = regionID;
		}
		paramData.devices_model = devices_model;
		paramData.devices_name = devices_name;
		paramData.devices_out_time = devices_out_time;
		paramData.devices_power = devices_power;
		paramData.install_way = install_way;
		paramData.work_voltage = work_voltage;
		paramData.devices_produce = devices_produce;
		paramData.protection = protection;
		paramData.insulation = insulation;
		paramData.bearing_model = bearing_model;
		//------
		paramData.rated_speed = boldjedzs;
		paramData.magnetism_pair = boldjcjds;
		paramData.base_rigidity = obj_djjzgd;
		paramData.coupling_type = obj_djlaqlx;
		paramData.gearbox_gear_pair = bolclxcls;
		paramData.gearbox_transmission_ratio = bolclxcdb;

		//------
		//		paramData.work_shop = work_shop;
		paramData.pro_line = pro_line;
		paramData.content = content;
		paramData.maintenance_time = cardUpdateTime;
		paramData.use_scenes = use_scenes;

		if(cancle.length == 0) {
			return paramData;
		}
		///*
		else {

			var common_jsonArray = new Array();

			for(var i = 0; i < cancle.length; i++) {

				//				var sim_jsonArray = new Array();
				var sim_dic = new Object();
				//传感器编号
				var strCPXid = "#CPXID" + i;
				var objCPXID = $(strCPXid).val();
				//数据采集模式
				var strdatacaijimodel = "#deviceCPX_model" + i;
				var caijimodel = $(strdatacaijimodel).val();
				//数据采集时间
				var strgettime = "#getDataTime" + i;
				var obj_caiji_gettime = new Array();
				obj_caiji_gettime = getCaijishijian(i);
				//				console.log("采集时间=====" + obj_caiji_gettime)
				//采集周期
				var strzhouqi = "#timeLangth" + i;
				var obj_caiji_zhouqi = $(strzhouqi).val();
				//数据上传时间
				//				var struploadtime = "#uploadTime" + i;
				//				var obj_caiji_uploadtime = $(struploadtime).val();

				//数据上传周期
				var struploadzhouqi = "#uploadZhouqi" + i;
				var obj_caiji_uploadzhouqi = $(struploadzhouqi).val();

				sim_dic.serial_no = objCPXID;

				if(obj_caiji_gettime.indexOf('1') == -1) {
					mui.toast('数据采集时间至少选择一个时间');
					return false;
				} else {
					var arrTime = obj_caiji_gettime.split(',');
					var workPoint = {
						'sample_time_point': arrTime
					}
					sim_dic.work_point_json = JSON.stringify(workPoint);
				}

				if(obj_caiji_zhouqi.length == 0 || obj_caiji_uploadzhouqi.length == 0) {
					mui.toast("采集周期、上传周期必须全部填写！");
					return false;
				} else {

					if(obj_caiji_zhouqi != "00:00:00") {
						var arrZQ = obj_caiji_zhouqi.split(':');
						var seconds = arrZQ[2];
						var mins = arrZQ[1] * 60;
						var hours = arrZQ[0] * 3600;
						var toCount = parseInt(hours) + parseInt(mins) + parseInt(seconds);
						//						if(toCount < 3600) {
						//							mui.toast("数据采集周期不得小于1小时");
						//							return false;
						//						} else {
						sim_dic.sampling_duration = obj_caiji_zhouqi;
						//						}
					} else {
						sim_dic.sampling_duration = obj_caiji_zhouqi;
					}

					if(obj_caiji_uploadzhouqi != "00:00:00") {
						var arrZQ = obj_caiji_uploadzhouqi.split(':');
						var seconds = arrZQ[2];
						var mins = arrZQ[1] * 60;
						var hours = arrZQ[0] * 3600;
						var toCount = parseInt(hours) + parseInt(mins) + parseInt(seconds);
						//						if(toCount < 3600) {
						//							mui.toast("数据上传周期不得小于1小时");
						//							return false;
						//						} else {
						sim_dic.update_duration = obj_caiji_uploadzhouqi;
						//						}
					} else {
						sim_dic.update_duration = obj_caiji_uploadzhouqi;
					}

					var chuannumstr = ".chuanNameNumber" + i;
					var chuannum = $(chuannumstr);

					for(var j = 0; j < chuannum.length; j++) {
						var sensorObj = new Object();

						var bolCheck = checkCheckBox(i, j);
						if(bolCheck == false) {
							mui.toast("至少选择一个轴工作");
							return false;
						} else {
							sensorObj.working_axis = bolCheck;
						}
						var bolxishu = checkXishu(i, j);
						if(bolxishu == false) {
							return false;
						} else {

							sensorObj.calibration_coefficient = bolxishu;

						}

						//卡编号
						var str_j_card = "#cardID" + i + j;
						var obj_j_card = $(str_j_card).val();

						//传感器编号
						var str_j_chuan = "#chuanID" + i + j;
						var obj_j_chaun = $(str_j_chuan).val();

						//采样信号模式
						var str_j_model = "#caiyangmodel" + i + j;
						var obj_j_model = $(str_j_model).val();
						//采样点数
						var str_j_count = "#caiyangcount" + i + j;
						var obj_j_count = $(str_j_count).val();
						//采样频率
						var str_j_pinlv = "#caiyangpinlv" + i + j;
						var obj_j_pinlv = $(str_j_pinlv).val();
						//采样量程/精度
						var str_j_liangcheng = "#caiyangliangcheng" + i + j;
						var obj_j_liangcheng = $(str_j_liangcheng).val();
						//采样量程/精度
						var str_j_jingdu = "#caiyangjingdu" + i + j;
						var obj_j_jingdu = $(str_j_jingdu).val();

						//安装位置
						var str_j_anzhuang = "#anzhuang" + i + j;
						var obj_j_anzhuang = $(str_j_anzhuang).val();

						sensorObj.serial_no = obj_j_card;
						sensorObj.sensor_no = obj_j_chaun;

						if(obj_j_model.length > 0) {
							sensorObj.sampling_model = obj_j_model;
						}
						if(obj_j_count.length > 0) {
							sensorObj.sampling_number = obj_j_count;
						}
						if(obj_j_pinlv.length > 0) {
							sensorObj.sampling_frequency = obj_j_pinlv;
						}
						if(obj_j_jingdu.length > 0) {
							sensorObj.sampling_accuracy = obj_j_jingdu;
						}
						if(obj_j_liangcheng.length > 0) {
							sensorObj.range_data = obj_j_liangcheng;
						}
						if(obj_j_anzhuang.length > 0) {
							sensorObj.install_xy = obj_j_anzhuang;
						}

						var obj_commenDic = new Object();
						obj_commenDic.sensorMsgPO = sensorObj;
						obj_commenDic.simWorkModelPO = sim_dic;

						common_jsonArray.push(obj_commenDic);
						console.log(JSON.stringify(obj_commenDic))

					}

				}

			}

			paramData.commen_json = JSON.stringify(common_jsonArray);
			return paramData;

		}

	}

}

function checkNewBolNumber(strings, typeStr, strid) {
	if(strings.length > 0) {
		t = parseFloat(strings);
		if(isNaN(t)) {
			mui.toast("请输入纯数字的" + typeStr);
			var user_id = document.getElementById(strid);
			user_id.value = null;
			return false;
		} else {
			return strings;
		}
	} else {
		return;
	}
}

function checkXishu(i, j) {
	var strxishuid = "#jiaoxishu" + i + j;
	var obj_xishu = $(strxishuid).val();

	var strid_xishu = "jiaoxishu" + i + j;
	var user_xishu = document.getElementById(strid_xishu);

	if(obj_xishu.length > 0) {
		t = parseFloat(obj_xishu);
		if(isNaN(t)) {
			//不能转换
			mui.toast("请输入0.500--1.500的数");
			user_xishu.value = null;
			return false;

		} else {
			//转换成功
			var tnum = t.toFixed(3);
			if(tnum > 0.500 && tnum < 1.500) {
				return tnum;
			} else {
				mui.toast("请输入0.500--1.500的数");
				user_xishu.value = null;
				return false;
			}
		}
	}
}

function checkCheckBox(i, j) {

	var strXinputid = "xzhou" + i + j;
	var obj_xinput = document.getElementById(strXinputid);
	var strYinputid = "yzhou" + i + j;
	var obj_Yinput = document.getElementById(strYinputid);
	var strZinputid = "zzhou" + i + j;
	var obj_Zinput = document.getElementById(strZinputid);

	if(obj_xinput.checked == false && obj_Yinput.checked == false && obj_Zinput.checked == false) {
		return false;
	} else {
		var xcheck = "0";
		var ycheck = "0";
		var zcheck = "0";
		if(obj_xinput.checked == true) {
			xcheck = "1";
		}
		if(obj_Yinput.checked == true) {
			ycheck = "1";
		}
		if(obj_Zinput.checked == true) {
			zcheck = "1";
		}
		var totalCheck = xcheck + ycheck + zcheck;
		return totalCheck;
	}

}

function postData(data) {

	$.ajax({
		type: "post",
		url: commen_update_device_Interface,
		async: true,
		data: data,
		dataType: 'json',
		success: function(respData) {

			if(respData.status == 'SUCCESS') {
				mui.toast(respData.message);

				window.location.replace("./DeviceDetail.html")
			} else {
				mui.toast(respData.message);
			}
		},
		error: function(err) {

		}
	});

}

//})