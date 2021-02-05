//mui.plusReady(function() {

var sim_sensorList = new Array()

var companyArray = new Array();
var reginArray = new Array();
var companyID = null;
var regionID = null;
//安装位置选择，数据源
var installList = new Array();
//安装位置，选中的数据
var selInstallArray = new Array();

var selInsObj = new Object();


//设备类型，L：电动机车，E:电机
var strDeviceType = ''


getInitCompany();

$('#addNewCPX').on('tap', function() {
	//	window.location.replace('devicelisttoscancode.html');
	localStorage.setItem('fatherID', 'updateDevice');

	mui.openWindow({
		url: 'barcodescanupdate.html',
		id: 'barcodescanupdate.html'
	})

	//	var webViewScan = plus.webview.create('devicelisttoscancode.html','devicelisttoscancode.html');
	//	webViewScan.show();

	//	mui.init({
	//		subpages:[{
	//			url:"devicelisttoscancode.html",
	//			id:'devicelisttoscancode.html'
	//		}]
	//	})

	// 	mui.openWindow({
	// 		url: 'devicelisttoscancode.html',
	// 		id: 'devicelisttoscancode.html'
	// 	})
})

function getInitCompany() {
	$.ajax({
		type: "get",
		url: commen_gain_company_map_Interface,
		async: true,
		dataType: "json",
		success: function(respData) {
			
			// console.log('bbbbbbbbbb====',JSON.stringify(respData))
			
			var dataArray = respData.data;
			for (var i = 0; i < dataArray.length; i++) {
				var subRegionArray = dataArray[i].region_list;
				var company_region = new Array();
				for (var j = 0; j < subRegionArray.length; j++) {
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

	if (reginArray.length == 0) {
		var strCompay = $("#devices_company").val();
		for (var i = 0; i < companyArray.length; i++) {
			var companyText = companyArray[i].text;
			if (strCompay == companyText) {
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
	if (list == undefined || list == null || list[key] == null || list[key] == undefined) {
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
		url: 'uploadpicture.html'
	})
	//	mui.openWindow({
	//		url: 'UploadImage.html'
	//	})
})


var tempSensorSettingObj = {};//传感器 采样信号点数、频率、量程、精度  list

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
			//console.log('data====',JSON.stringify(data))
			sim_sensorList.push(msg.data)
			if (typeof(data) != "undefined") {

				var sensorStr = '<div class="tree-folder" >';

				var strUserType = localStorage.getItem("userType");
				if (strUserType > 10) {
					sensorStr +=
						'<div class="tree-folder-header"> <i style="hidden:display" onclick="hiddenOrDisplay(this)" class="icon-minus"></i><div class="tree-folder-name">' +
						isUndefined(data, 'sim_name') + ' ' + data.serial_no +
						'</div><div onclick="cancleCard(this)" class="cancle">取消关联</div><div onclick="cancleCardForce(this)" class="cancle" style="margin-right:10px;">强制取消关联</div></div>';
				} else {
					sensorStr +=
						'<div class="tree-folder-header"> <i style="hidden:display" onclick="hiddenOrDisplay(this)" class="icon-minus"></i><div class="tree-folder-name">' +
						isUndefined(data, 'sim_name') + ' ' + data.serial_no +
						'</div><div onclick="cancleCard(this)" class="cancle">取消关联</div></div>';
				}

				sensorStr += '<div class="tree-folder-content" style="display: block;">';
				sensorStr +=
					'<div hidden="hidden" class="modifyCom"><span class="name">传感器卡编号：</span><input type="button" class="sensor_num" id="CPXID' +
					i + '" value=' + data.serial_no + ' /></div>';

				if (data.sim_name != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">名称：</span><span class="serial_no">' + data.sim_name +
						'</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">名称：</span><span class="serial_no">' + "----" +
						'</span></div>';

				}

				sensorStr +=
					'<div hidden="hidden" class="modifyCom"><span class="name">12121212：</span><span class="serial_no">' + data.serial_no +
					'</span></div>';

				if (data.imei != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">IMEI：</span><span class="val">' + data.imei +
						'</span></div>';
				} else {
					sensorStr += '<div class="modifyCom"><span class="name">IMEI：</span><span class="val">' + "----" +
						'</span></div>';
				}
				if (data.internet_things_no != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">物联网卡：</span><span class="val">' + data.internet_things_no +
						'</span></div>';
				} else {
					sensorStr += '<div class="modifyCom"><span class="name">物联网卡：</span><span class="val">' + "----" +
						'</span></div>';
				}
				if (data.produce != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">生产厂商：</span><span class="val">' + data.produce +
						'</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">生产厂商：</span><span class="val">' + "----" +
						'</span></div>';

				}
				sensorStr += '<div class="modifyCom"><span class="name">生产批次：</span><span class="val">' + data.pro_bitch +
					'</span></div>';
				if (data.version != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">硬件版本：</span><span class="val">' + data.version +
						'</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">硬件版本：</span><span class="val">' + "----" +
						'</span></div>';

				}

				if (data.local_time != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">本地时间：</span><span class="val">' + data.local_time +
						'</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">本地时间：</span><span class="val">' + "缺少----" +
						'</span></div>';

				}

				if (data.content) {
					sensorStr += '<div class="divForMoreLine"><span class="name">维护日志：</span><span class="moreLine">' + "----" +
						'</span></div>';

				} else {
					sensorStr += '<div class="divForMoreLine"><span class="name">维修日志：</span><span class="moreLine">' + "" +
						'</span></div>';

				}
				if (typeof(data.mcc) != "undefined") {
					sensorStr += '<div class="modifyCom"><span class="name">小区信息：</span><span class="val"> ' + data.mcc + data.mnc +
						'-' + data.lac + '-' + data.cell_no + '-' + data.bsic + '</span></div>';
				} else {
					sensorStr += '<div class="modifyCom"><span class="name">小区信息：</span><span class="val"> ' + "----" +
						'</span></div>';
				}
				if (typeof(data.signal_intensity) == "undefined") {
					sensorStr +=
						'<div class="modifyCom" style="height:20px;"><span class="name">信号强度：&nbsp &nbsp</span><img src="img/xinhaoNO.png" height="20px" style="margin-top:10px;" /></div>';
				} else {
					if (data.signal_intensity == 0) {
						sensorStr +=
							'<div class="modifyCom" style="height:20px;"><span class="name">信号强度：&nbsp &nbsp</span><img src="img/xinhaonull.png" height="20px" /></div>';
					}
					if ((data.signal_intensity > 1 || data.signal_intensity == 1) && (data.signal_intensity < 8 || data.signal_intensity ==
							8)) {
						sensorStr +=
							'<div class="modifyCom" style="height:20px;"><span class="name">信号强度：&nbsp &nbsp</span><img src="img/xinhao1.png" height="20px" /></div>';
					}
					if ((data.signal_intensity > 9 || data.signal_intensity == 9) && (data.signal_intensity < 12 || data.signal_intensity ==
							12)) {
						sensorStr +=
							'<div class="modifyCom" style="height:20px;"><span class="name">信号强度：&nbsp &nbsp</span><img src="img/xinhao2.png" height="20px" /></div>';
					}
					if ((data.signal_intensity > 13 || data.signal_intensity == 13) && (data.signal_intensity < 17 || data.signal_intensity ==
							17)) {
						sensorStr +=
							'<div class="modifyCom" style="height:20px;"><span class="name">信号强度：&nbsp &nbsp</span><img src="img/xinhao3.png" height="20px" /></div>';
					}
					if ((data.signal_intensity > 18 || data.signal_intensity == 18) && (data.signal_intensity < 20 || data.signal_intensity ==
							20)) {
						sensorStr +=
							'<div class="modifyCom" style="height:20px;"><span class="name">信号强度：&nbsp &nbsp</span><img src="img/xinhao4.png" height="20px" /></div>';
					}
					if ((data.signal_intensity > 21 || data.signal_intensity == 21) && (data.signal_intensity < 25 || data.signal_intensity ==
							25)) {
						sensorStr +=
							'<div class="modifyCom" style="height:20px;"><span class="name">信号强度：&nbsp &nbsp</span><img src="img/xinhao5.png" height="20px" /></div>';
					}
					if ((data.signal_intensity > 26 || data.signal_intensity == 26) && (data.signal_intensity < 31 || data.signal_intensity ==
							31)) {
						sensorStr +=
							'<div class="modifyCom" style="height:20px;"><span class="name">信号强度：&nbsp &nbsp</span><img src="img/xinhao6.png" height="20px" /></div>';
					}

				}


				// sensorStr += '<div class="modifyCom"><span class="name">电池电量：</span><span class="val"> ' + "----" +'</span></div>';
				if (data.supply_type == 0 || data.supply_type == undefined) {


					sensorStr +=
						'<div class="modifyCom" style="height:20px;"><span class="name">供电模式：</span><span style="padding-top:2px;">电池供电</span></div>';

					if (typeof(data.dump_percentage) != "undefined") {
						if (data.dump_percentage > 84 || data.dump_percentage == 84) {
							sensorStr +=
								'<div class="modifyCom" style="height:20px;"><span class="name">电池电量：&nbsp &nbsp</span><img src="img/dianchi100.jpg" height="10px" style="margin-top:5px;"/></div>';
						}
						if ((data.dump_percentage > 67 || data.dump_percentage == 67) && data.dump_percentage < 84) {
							sensorStr +=
								'<div class="modifyCom" style="height:20px;"><span class="name">电池电量：&nbsp &nbsp</span><img src="img/dianchi84.jpg" height="10px" style="margin-top:5px;"/></div>';
						}
						if ((data.dump_percentage > 50 || data.dump_percentage == 50) && data.dump_percentage < 67) {
							sensorStr +=
								'<div class="modifyCom" style="height:20px;"><span class="name">电池电量：&nbsp &nbsp</span><img src="img/dianchi50.jpg" height="10px" style="margin-top:5px;"/></div>';
						}
						if ((data.dump_percentage > 34 || data.dump_percentage == 34) && data.dump_percentage < 50) {
							sensorStr +=
								'<div class="modifyCom" style="height:20px;"><span class="name">电池电量：&nbsp &nbsp</span><img src="img/dianchi34.jpg" height="10px" style="margin-top:5px;"/></div>';
						}
						if ((data.dump_percentage > 16 || data.dump_percentage == 16) && data.dump_percentage < 34) {
							sensorStr +=
								'<div class="modifyCom" style="height:20px;"><span class="name">电池电量：&nbsp &nbsp</span><img src="img/dianchi16.jpg" height="10px" style="margin-top:5px;"/></div>';
						}
						if ((data.dump_percentage > 0 || data.dump_percentage == 0) && data.dump_percentage < 16) {
							sensorStr +=
								'<div class="modifyCom" style="height:20px;"><span class="name">电池电量：&nbsp &nbsp</span><img src="img/dianchi00.jpg" height="10px" style="margin-top:5px;"/></div>';
						}

					} else {
						sensorStr +=
							'<div class="modifyCom" style="height:20px;"><span class="name">电池电量：&nbsp &nbsp</span>----</div>';
					}

				} else if (data.supply_type == 1) {
					sensorStr +=
						'<div class="modifyCom" style="height:20px;"><span class="name">供电模式：</span><span style="padding-top:2px;">外接电源</span></div>';
				}


				sensorStr += '<div class="modifyCom"><span class="name">数据流量：</span><span class="val"> ' + "----" +
					'</span></div>';
				sensorStr += '<div class="modifyCom"><span class="name">工作状态：</span><span class="val"> ' + simState(data.state,
					data.work_status) + '</span></div>';
				if (data.active_time != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">激活时间：</span><span class="val">' + data.active_time +
						'</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">激活时间：</span><span class="val">' + "----" +
						'</span></div>';
				}
				if (data.software_version != undefined) {
					sensorStr += '<div class="modifyCom"><span class="name">固件版本：</span><span class="val">' + data.software_version +
						'</span></div>';

				} else {
					sensorStr += '<div class="modifyCom"><span class="name">固件版本：</span><span class="val">' + "----" +
						'</span></div>';
				}

				if (data.connect_model != undefined) {
					if (data.connect_model == 0) {
						sensorStr +=
							'<div style="display:block" class="modifyCom"><span class="modifyFont">CPX工作模式：</span><input type="button" onclick="chooseCPXWorkType(' +
							i + ')" id="cpxworktype' + i + '" value="省电模式"/></div>';
					} else {
						sensorStr +=
							'<div style="display:block" class="modifyCom"><span class="modifyFont">CPX工作模式：</span><input type="button" onclick="chooseCPXWorkType(' +
							i + ')" id="cpxworktype' + i + '" value="长连接模式"/></div>';
					}

				} else {
					sensorStr +=
						'<div style="display:block" class="modifyCom"><span class="modifyFont">CPX工作模式：</span><input type="button" onclick="chooseCPXWorkType(' +
						i + ')" id="cpxworktype' + i + '" value="省电模式"/></div>';
				}

				sensorStr += '<div style="display:block" class="div_cpxworktypeSD' + i + '">'; //省电模式

				sensorStr += '<div class="modifyCom"><span class="modifyFont">数据采集模式：</span><input onclick="CPXModelClicked(' +
					i + ')" type="button" id="deviceCPX_model' + i + '" /></div>';

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

				if (data.sampling_duration != undefined) {
					sensorStr +=
						'<div class="modifyCom"><span class="modifyFont">数据采集周期：</span><input type="button" id="timeLangth' + i +
						'" onclick="timeLangth(' + i + ')" value=' + data.sampling_duration + ' /><span>s</span></div>';

				} else {
					sensorStr +=
						'<div class="modifyCom"><span class="modifyFont">数据采集周期：</span><input type="button" id="timeLangth' + i +
						'" onclick="timeLangth(' + i + ')" /><span>s</span></div>';
				}
				if (data.update_duration != undefined) {
					sensorStr +=
						'<div class="modifyCom"><span class="modifyFont">数据上传周期：</span><input type="button" id="uploadZhouqi' + i +
						'" onclick="uploadZhouqifun(' + i + ')"  value=' + data.update_duration + ' /></div>';

				} else {
					sensorStr +=
						'<div class="modifyCom"><span class="modifyFont">数据上传周期：</span><input type="button" id="uploadZhouqi' + i +
						'" onclick="uploadZhouqifun(' + i + ')"  /></div>';
				}

				sensorStr += '</div>';

				//长链接模式
				sensorStr += '<div style="display:none" class="div_cpxworktypeCLJ' + i + '">';
				if (data.sampling_interval != undefined) {
					sensorStr += '<div class="classCPXCLJ"><span>采样间隔时间：</span><input type="number" id="SD_caiyangjiange' + i +
						'" value="' + data.sampling_interval + '"/><span>s</span></div>';
				} else {
					sensorStr += '<div class="classCPXCLJ"><span>采样间隔时间：</span><input type="number" id="SD_caiyangjiange' + i +
						'" value="5" /><span>s</span></div>';
				}
				if (data.upload_duration != undefined) {
					sensorStr += '<div class="classCPXCLJ"><span>上传间隔时间：</span><input type="number" id="SD_shangchuanjiange' + i +
						'" value="' + data.upload_duration + '"/><span>s</span></div>';
				} else {
					sensorStr += '<div class="classCPXCLJ"><span>上传间隔时间：</span><input type="number" id="SD_shangchuanjiange' + i +
						'" value="60" /><span>s</span></div>';
				}

				if (data.heart_duration != undefined) {
					sensorStr += '<div class="classCPXCLJ"><span>心跳间隔时间：</span><input type="number" id="SD_xintiaojiange' + i +
						'" value="' + data.heart_duration + '"/><span>s</span></div>';
				} else {
					sensorStr += '<div class="classCPXCLJ"><span>心跳间隔时间：</span><input type="number" id="SD_xintiaojiange' + i +
						'" value="60" /><span>s</span></div>';
				}



				sensorStr += '</div></div>'

				sensorStr += '<div class="tree-folder-content" style="display: block;">';

				if (typeof(data.sensorList) != 'undefined') {

					senData = data.sensorList;
					
					//console.log('senData=====',JSON.stringify(senData))

					for (var j = 0; j < senData.length; j++) {

						sensorStr +=
							'<div class="tree-folder"><div class="tree-folder-header"> <i></i><div class="tree-folder-name chuanNameNumber' +
							i + '">SE-L01智能传感器:' + senData[j].sensor_no + '</div></div></div></div>';
						sensorStr += '<div class="tree-folder-content" style="display: block;">';
						sensorStr += '<div hidden="hidden" class="modifyCom"><span class="modifyFont">卡编号：</span><input id="cardID' +
							i + j + '" type="button" class="topology" value=' + senData[j].serial_no + ' /><span>点</span></div>';
						sensorStr += '<div hidden="hidden" class="modifyCom"><span class="modifyFont">传感器编号：</span><input id="chuanID' +
							i + j + '" type="button" class="topology" value=' + senData[j].sensor_no + ' /><span>点</span></div>';

						if (senData[j].version != undefined) {
							sensorStr += '<div class="modifyCom"><span>硬件版本：</span><span class="val">' + senData[j].version +
								'</span></div>';
						} else {
							sensorStr += '<div class="modifyCom"><span>硬件版本：</span><span class="val">' + "----" + '</span></div>';

						}
						if (senData[j].fw_version != undefined) {
							sensorStr += '<div class="modifyCom"><span>固件版本：</span><span class="val">' + senData[j].fw_version +
								'</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span >固件版本：</span><span class="val">' + "----" + '</span></div>';

						}
						if (senData[j].calibration_time != undefined) {
							sensorStr += '<div class="modifyCom"><span class="name">校准日期：</span><span class="val">' + senData[j].calibration_time +
								'</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">校准日期：</span><span class="val">' + "----" +
								'</span></div>';
						}

						if (senData[j].topology_xy != undefined) {
							sensorStr += '<div class="modifyCom"><span class="name">MODBUS地址：</span><span class="val">' + senData[j].topology_xy +
								'</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">MODBUS地址：</span><span class="val">' + "----" +
								'</span></div>';
						}

						if (senData[j].sensor_status != undefined) {
							if (senData[j].sensor_status == 0) {
								sensorStr += '<div class="modifyCom"><span class="name">传感器状态：</span><span class="val">' + "正常" +
									'</span></div>';
							}
							if (senData[j].sensor_status == 1) {
								sensorStr += '<div class="modifyCom"><span class="name">传感器状态：</span><span class="val">' + "损坏" +
									'</span></div>';
							}

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">传感器状态：</span><span class="val">' + "----" +
								'</span></div>';
						}

						if (senData[j].sensitives != undefined) {
							sensorStr += '<div class="modifyCom"><span class="name">温度传感器灵敏度：</span><span class="val">' + senData[j].sensitives +
								'</span></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="name">温度传感器灵敏度：</span><span class="val">' + "----" +
								'</span></div>';
						}


						if (senData[j].sensorType != undefined && senData[j].sensorType == 'V') {
							if (senData[j].probe_name != undefined) {
								sensorStr += '<div class="modifyCom"><span class="name">振动探头名称：</span><span class="emeId">' + senData[j].probe_name +
									'</span></div>';

							} else {
								sensorStr += '<div class="modifyCom"><span class="name">振动探头名称：</span><span class="emeId">' + "----" +
									'</span></div>';
							}
							if (senData[j].sensitivity != undefined) {
								sensorStr += '<div class="modifyCom"><span class="name">振动传感器灵敏度：</span><span class="val">' + senData[j].sensitivity +
									'</span></div>';
							} else {
								sensorStr += '<div class="modifyCom"><span class="name">振动传感器灵敏度：</span><span class="val">' + "----" +
									'</span></div>';
							}
						}
						if (senData[j].install_xy != undefined) {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">安装位置：</span><input id="anzhuang' + i + j +
								'" type="button" onclick="cedianSelected(' + i + ',' + j + ')" value=' + senData[j].install_xy + ' /></div>';

						} else {
							sensorStr += '<div class="modifyCom"><span class="modifyFont">安装位置：</span><input id="anzhuang' + i + j +
								'" type="button" onclick="cedianSelected(' + i + ',' + j + ')"  class="sensorLocation"/></div>';
						}

						// selInstallArray
						var objDefInstall = {
							sensorNO: senData[j].sensor_no,
							install_index: 'anzhuang' + i + j,
							old_installId: senData[j].install_id,
							old_installXY: senData[j].install_xy,
							new_installId: '',
							new_installXY: ''
						};
						var strIndex = 'anzhuang' + i + j;
						selInsObj[strIndex] = objDefInstall;
						//当传感器为振动类型时，
						if (senData[j].sensorType != undefined && senData[j].sensorType == 'V') {
							sensorStr += '<div class="sensorSD' + i + '">';

							// if (senData[j].sampling_model != undefined) {
							// 	sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号模式：</span><input id="caiyangmodel' + i + j +
							// 		'" type="button" onclick="caiyangModelClick(' + i + ',' + j + ')" class="sensorLocation" value=' + senData[
							// 			j]
							// 		.sampling_model + ' /></div>';

							// } else {
							// 	sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号模式：</span><input id="caiyangmodel' + i + j +
							// 		'" type="button" onclick="caiyangModelClick(' + i + ',' + j + ')" class="sensorLocation"/></div>';

							// }

							if (senData[j].sampling_number != undefined) {
								sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号点数：</span><input id="caiyangcount' + i + j +
									'"  onclick="caiyangcountClick(' + i + ',' + j + ')" type="button" class="topology" value=' + senData[j].sampling_number +
									' /><span style="margin-left:1px">点</span></div>';

							} else {
								sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号点数：</span><input id="caiyangcount' + i + j +
									'"  onclick="caiyangcountClick(' + i + ',' + j +
									')" type="button" class="topology" /><span style="margin-left:1px">点</span></div>';

							}

							if (senData[j].sampling_frequency != undefined) {
								sensorStr +=
									'<div class="modifyCom"><span class="modifyFont">采样信号频率：</span><input onclick="caiyangpinlvClick(' + i +
									',' +
									j + ')" id="caiyangpinlv' + i + j + '" type="button" class="sensorLocation" value=' + senData[j].sampling_frequency +
									' /><span style="margin-left:1px">Hz</span></div>';

							} else {
								sensorStr +=
									'<div class="modifyCom"><span class="modifyFont">采样信号频率：</span><input onclick="caiyangpinlvClick(' + i +
									',' +
									j + ')" id="caiyangpinlv' + i + j +
									'" type="button" class="sensorLocation"/><span style="margin-left:1px">Hz</span></div>';

							}

							if (senData[j].range_data != undefined) {
								sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号量程：</span><input id="caiyangliangcheng' +
									i +
									j + '"  onclick="caiyangliangchengClick(' + i + ',' + j + ')" type="button" class="sensorLocation" value=' +
									senData[j].range_data + ' /></div>';

							} else {
								sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号量程：</span><input id="caiyangliangcheng' +
									i +
									j + '"  onclick="caiyangliangchengClick(' + i + ',' + j + ')" type="button" class="sensorLocation"/></div>';

							}

							if (senData[j].sampling_accuracy != undefined) {
								sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号精度：</span><input id="caiyangjingdu' + i +
									j +
									'"  onclick="caiyangjingduClick(' + i + ',' + j + ')" type="button" class="sensorLocation" value=' +
									senData[
										j].sampling_accuracy + ' /><span style="margin-left:1px">bit</span></div>';

							} else {
								sensorStr += '<div class="modifyCom"><span class="modifyFont">采样信号精度：</span><input id="caiyangjingdu' + i +
									j +
									'"  onclick="caiyangjingduClick(' + i + ',' + j +
									')" type="button" class="sensorLocation"/><span style="margin-left:1px">bit</span></div>';

							}
							let objSettingOption = 'option' + i + j; 
							console.log('option========',objSettingOption)
							tempSensorSettingObj[objSettingOption] = senData[j].sensorSampleVO;
							console.log('temp========',JSON.stringify(tempSensorSettingObj))
							
							
							

							// 							if (senData[j].calibration_coefficient != undefined) {
							// 								sensorStr +=
							// 									'<div class="modifyCom"><span class="modifyFont">传感器频率校准系数：</span><input style="width:100px" id="jiaoxishu' +
							// 									i + '' + j + '" type="text" class="sensorLocation" value=' + senData[j].calibration_coefficient +
							// 									' /></div>';
							// 
							// 							} else {
							// 								sensorStr +=
							// 									'<div class="modifyCom"><span class="modifyFont">传感器频率校准系数：</span><input  style="width:100px" id="jiaoxishu' +
							// 									i + '' + j + '" type="text " class="sensorLocation " /></div>';
							// 
							// 							}
							sensorStr += '</div>'
						}


					}

					sensorStr += '<br/><br/></div>';
				}

				sensorStr += '</div>';
				$('#tree1').append(sensorStr)

			}

			if (typeof(data) != "undefined") {
				var itemKey = '[name=item_' + i + ']:checkbox';
				$(itemKey).each(function(index) {
					var arrTimeCount = JSON.parse(data.work_point_json).sample_time_point;
					var idType = arrTimeCount[index];
					var bolCheck = false;
					if (idType == 1) {
						bolCheck = true;
					}
					$(this).prop("checked", bolCheck);
				})
			}

			if (typeof(data) != "undefined") {

				var objdiv_cpxworktypeSD = document.getElementById('div_cpxworktypeSD' + i)
				//判断选择的cpx工作模式是哪个，
				//省电模式：隐藏cpx采样时间间隔、心跳时间间隔等；显示数据采集模式、数据上传周期等；显示sensor信号采样模式、采样量程等
				//长连接模式：cpx显示心跳时间；隐藏上传周期；sensor隐藏信号采样量程等
				var objDivForTypeSD = document.getElementsByClassName('div_cpxworktypeSD' + i)
				var objDivForTypeCLJ = document.getElementsByClassName('div_cpxworktypeCLJ' + i)
				var objSendorGaojing = document.getElementsByClassName('sensorGaoJing' + i)
				if (data.alarm_judge == undefined || data.alarm_judge == 0) {
					for (var k = 0; k < objSendorGaojing.length; k++) {
						objSendorGaojing[k].style.display = 'none'
					}
				}
				if (data.alarm_judge == 1) {
					for (var k = 0; k < objSendorGaojing.length; k++) {
						objSendorGaojing[k].style.display = 'block'
					}
				}


				// 长连接模式
				if (data.connect_model != undefined && data.connect_model == 1) {
					for (var k = 0; k < objDivForTypeSD.length; k++) {
						objDivForTypeSD[k].style.display = 'none'
					}
					for (var k = 0; k < objDivForTypeCLJ.length; k++) {
						objDivForTypeCLJ[k].style.display = 'block'
					}
				} else { //省电模式
					for (var k = 0; k < objDivForTypeSD.length; k++) {
						objDivForTypeSD[k].style.display = 'block'
					}
					for (var k = 0; k < objDivForTypeCLJ.length; k++) {
						objDivForTypeCLJ[k].style.display = 'none'
					}
				}

			}

		}
	})


	//	return sensor;
}

//不管是长连接模式还是省点模式
//在cpx下，勾选cpx告警判断，则显示sensor下的各个告警值设置，取消勾选，则隐藏
function gaojingClicked(index) {
	var index_id = 'ifGaoJing' + index
	var objCheckbox = document.getElementById(index_id)
	var objSensorGaoJing = document.getElementsByClassName('sensorGaoJing' + index)
	if (objCheckbox.checked == true) {
		for (var i = 0; i < objSensorGaoJing.length; i++) {
			objSensorGaoJing[i].style.display = 'block'
		}
	}
	if (objCheckbox.checked == false) {

		for (var i = 0; i < objSensorGaoJing.length; i++) {
			objSensorGaoJing[i].style.display = 'none'
		}
	}
}


function getDate(tm) {
	var tt = new Date(parseInt(tm)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ")
	return tt;

}


function simState(statue, work_statues) {

	var sta_1 = statue;

	var sta_2 = work_statues;
	var strStute = "----";
	if (sta_1 == 5) {
		if (sta_2 == 0) {
			strStute = "工作";
		}
		if (sta_2 == 1) {
			strStute = "失联";
		}
		if (sta_2 == 2) {
			strStute = "关机";
		}
		if (sta_2 == 3) {
			strStute = "休眠";
		}
		if (sta_2 == 4) {
			strStute = "故障";
		}

	}
	if (sta_1 == 6) {
		strStute = "未激活";
	}
	if (sta_1 == 7) {
		strStute = "待激活";
	}
	if (sta_1 == 8) {
		strStute = "待解绑";
	}
	if (sta_1 == 9) {
		strStute = "配置待同步";
	}
	return strStute;

}

///*
function buildSensorData(sim) {
	// console.log("--------" + JSON.stringify(sim));

	var cheArray = [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1];
	for (var i = 0; i < sim.length; i++) {
		sensorData(sim[i]['serial_no'], i);
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
			if (typeId == 0) {
				strReturn = msg.data[0].mode_name;
			}
			if (typeId == 1) {
				strReturn = msg.data[0].sampling_time;
			}
			if (typeId == 2) {
				strReturn = msg.data[0].sampling_duration;
			}
			if (typeId == 3) {
				strReturn = msg.data[0].upload_time;
			}
		}
	});
	return strReturn;
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

//选择cpx工作模式，长链接模式或省电模式
function chooseCPXWorkType(indexRowType) {
	var userPicker = new mui.PopPicker();
	var setdataArray = [{
			text: "省电模式"
		},
		{
			text: "长连接模式"
		},
	]
	userPicker.setData(setdataArray);
	var strid = "cpxworktype" + indexRowType;
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
		//判断选择的cpx工作模式是哪个，
		//省电模式：隐藏cpx采样时间间隔、心跳时间间隔等；显示数据采集模式、数据上传周期等；显示sensor信号采样模式、采样量程等
		//长连接模式：cpx显示心跳时间；隐藏上传周期；sensor隐藏信号采样量程等
		var objDivForTypeSD = document.getElementsByClassName('div_cpxworktypeSD' + indexRowType)
		var objDivForTypeCLJ = document.getElementsByClassName('div_cpxworktypeCLJ' + indexRowType)
		// var cpxclj
		if (items[0].text == '省电模式') {
			for (var i = 0; i < objDivForTypeSD.length; i++) {
				objDivForTypeSD[i].style.display = 'block'
			}

			for (var i = 0; i < objDivForTypeCLJ.length; i++) {
				objDivForTypeCLJ[i].style.display = 'none'
			}

			var strid = "#deviceCPX_model" + indexRowType;
			var objCpxModel = document.getElementById(strid);
			$(strid).val(arrayDataModel[0].mode_name)
			updateTimes(arrayDataModel[0].mode_name, indexRowType);
		}
		if (items[0].text == '长连接模式') {
			for (var i = 0; i < objDivForTypeSD.length; i++) {
				objDivForTypeSD[i].style.display = 'none'
			}
			for (var i = 0; i < objDivForTypeCLJ.length; i++) {
				objDivForTypeCLJ[i].style.display = 'block'
			}

		}

	});
}


//提供数据到选择列表
function CPXModelClicked(indexPathRow) {
	//普通示例
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	for (var i = 0; i < arrayDataModel.length; i++) {
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
	$.ajax({
		type: "get",
		async: true,
		data: {
			mode_name: modelID
		},
		url: commen_gain_model_list_Interface,
		dataType: 'json',
		success: function(msg) {

			var secondstr = "timeLangth" + index;
			var uploadZhouqi = "uploadZhouqi" + index;
			var timelengthobj = document.getElementById(secondstr);
			var uploadZhouqiobj = document.getElementById(uploadZhouqi);

			timelengthobj.value = msg.data[0].sampling_duration;
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
		if (idType == 1) {
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
			if (respMsg.status == "SUCCESS") {

				caiyangModelArray = respMsg.data;

			} else {
				mui.toast(respMsg.message);
			}
		},
		error: function(error) {}
	});

}



//采样信号模式
function caiyangModelClick(index_1, index_2) {

	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	for (var i = 0; i < caiyangModelArray.length; i++) {
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

		//校准系数
		var strCaiyangxishu = "#jiaoxishu" + index_1 + index_2;
		$(strCaiyangxishu).val(items[0].calibration_coefficient);

	});

}

var newInstallSelArray = new Array();

//测点位置选择
function cedianSelected(index_1, index_2) {
	var userPicker = new mui.PopPicker();
	var strIndex = "anzhuang" + index_1 + index_2;
	var setdataArray = new Array();
	setdataArray = installList.slice(0);
	for (var i = 0; i < setdataArray.length; i++) {
		if (setdataArray[i].install_index == strIndex) {
			setdataArray[i].status = "N";
		}
	}
	var new_setdataArray = new Array();
	for (var j = 0; j < setdataArray.length; j++) {
		if (setdataArray[j].status == "N") {
			new_setdataArray.push(setdataArray[j]);
		}
	}


	userPicker.setData(new_setdataArray);
	var strid = "anzhuang" + index_1 + index_2;
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
		selInsObj[strIndex].new_installXY = items[0].text;
		selInsObj[strIndex].new_installId = items[0].id;
		for (var i = 0; i < installList.length; i++) {
			if (installList[i].id == items[0].id) {
				installList[i].status = "Y";
				installList[i].install_index = "anzhuang" + index_1 + index_2;
			}
			if (selInsObj[strIndex].old_installId == installList[i].id) {
				installList[i].status = "N";
			}
		}
	});

}


//采样点数
function caiyangcountClick(index_1, index_2) {
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	
	let list = tempSensorSettingObj['option' + index_1 + index_2]['sampling_numList']	
	for (var i = 0; i < list.length; i++) {
		setdataArray.push({
			text: list[i]
		})
	}
	
	// var sum = 256;
	// setdataArray.push({
	// 	text: sum
	// });
	// for (var i = 0; i < 7; i++) {
	// 	sum = sum * 2;
	// 	var textDic = {
	// 		text: sum
	// 	};
	// 	setdataArray.push(textDic);
	// }

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

	// userPicker.setData([{
	// 	text: "200"
	// }, {
	// 	text: "400"
	// }, {
	// 	text: "800"
	// }, {
	// 	text: "1600"
	// }, {
	// 	text: "3200"
	// }]);
	
	let list = tempSensorSettingObj['option' + index_1 + index_2]['sampling_frequencyList']
	for (var i = 0; i < list.length; i++) {
		setdataArray.push({
			text: list[i]
		})
	}
	
	userPicker.setData(setdataArray);
	
	
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

	// userPicker.setData([{
	// 	text: "±2g"
	// }, {
	// 	text: "±4g"
	// }, {
	// 	text: "±8g"
	// }, {
	// 	text: "±16g"
	// }]);
	
	let list = tempSensorSettingObj['option' + index_1 + index_2]['sapmlingAccuracyAndRangeList']
	for (var i = 0; i < list.length; i++) {
		setdataArray.push({
			text: list[i]['sampling_accuracy'],
			value: list[i]['sampling_range']
		})
	}
	
	userPicker.setData(setdataArray);
	
	var strid = "caiyangliangcheng" + index_1 + index_2;
	var userResult = document.getElementById(strid);
	
	var strIdLC = 'caiyangjingdu' + index_1 + index_2;
	var userResultLC = document.getElementById(strIdLC);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
		
		userResultLC.value = items[0].value;
	});
}
//采样精度
function caiyangjingduClick(index_1, index_2) {

	// var userPicker = new mui.PopPicker();
	// var setdataArray = new Array();
	// for (var i = 10; i < 49; i++) {
	// 	var setdataDic = {
	// 		text: i
	// 	};
	// 	setdataArray.push(setdataDic);
	// }
	// userPicker.setData(setdataArray);
	// var strid = "caiyangjingdu" + index_1 + index_2;
	// var userResult = document.getElementById(strid);
	// userPicker.show(function(items) {
	// 	userResult.value = items[0].text;
	// });
	
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();
	
	// userPicker.setData([{
	// 	text: "±2g"
	// }, {
	// 	text: "±4g"
	// }, {
	// 	text: "±8g"
	// }, {
	// 	text: "±16g"
	// }]);
	
	let list = tempSensorSettingObj['option' + index_1 + index_2]['sapmlingAccuracyAndRangeList']
	for (var i = 0; i < list.length; i++) {
		setdataArray.push({
			value: list[i]['sampling_accuracy'],
			text: list[i]['sampling_range']
		})
	}
	
	userPicker.setData(setdataArray);
	
	var strid = "caiyangliangcheng" + index_1 + index_2;
	var userResult = document.getElementById(strid);
	
	var strIdLC = 'caiyangjingdu' + index_1 + index_2;
	var userResultLC = document.getElementById(strIdLC);
	userPicker.show(function(items) {
		userResult.value = items[0].value;
		
		userResultLC.value = items[0].text;
	});

}
getDefData();

var strCompany_name = '';

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
			
			// console.log('aaaaa===',JSON.stringify(msg))
			
			localStorage.setItem('ActiveMZDevice', JSON.stringify(msg.data));
			var data = msg.data;
			var sim_list = null;
			if (data.hasOwnProperty("sim_list") == true) {
				sim_list = data.sim_list;
				CPXCount = sim_list.length;
				buildSensorData(sim_list);
			}
			
			if (typeof(data.install_list) != "undefined") {

				for (var i = 0; i < data.install_list.length; i++) {
					var dicInstall = {
						id: data.install_list[i].id,
						devices_no: data.install_list[i].devices_no,
						install_no: data.install_list[i].install_no,
						text: data.install_list[i].install_xy,
						install_num: data.install_list[i].install_num,
						status: data.install_list[i].status,
						install_index: ''
					}
					installList.push(dicInstall);
				}
			}
			var list = msg.data.list;

			strDeviceType = data.devices_type

			//L 电动机车
			if (data.devices_type == 'L') {
				var objJCDD = document.getElementsByClassName('classDDJC')
				for (var i = 0; i < objJCDD.length; i++) {
					objJCDD[i].style.display = 'block'
				}

				var objDianji = document.getElementsByClassName('classDJ')
				for (var i = 0; i < objDianji.length; i++) {
					objDianji[i].style.display = 'none'
				}
			}
			//E电机
			if (data.devices_type == 'E') {

				var objJCDD = document.getElementsByClassName('classDDJC')
				for (var i = 0; i < objJCDD.length; i++) {
					objJCDD[i].style.display = 'none'
				}

				var objDianji = document.getElementsByClassName('classDJ')
				for (var i = 0; i < objDianji.length; i++) {
					objDianji[i].style.display = 'block'
				}
			}

			$('#devices_name').val(isUndefined(data, 'devices_name'));
			$('#devices_no').html(isUndefined(data, 'devices_no'));
			//企业名称
			$('#devices_company').val(isUndefined(data, 'company_name'));
			strCompany_name = isUndefined(data, 'company_name');
			//分厂
			$('#devices_region').val(isUndefined(data, 'region_name'));

			$('#devices_out_time').val(data.devices_out_time);

			$('#devices_model').val(isUndefined(data, 'devices_model'));

			$('#devices_power').val(isUndefined(data, 'devices_power'));
			$('#install_way').val(isUndefined(data, 'install_way'));

			if (data.work_voltage != undefined) {
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
			//--------------------------电动机车，
			$('#dojckW').val(isUndefined(data, 'allocate_power'));
			$('#ddjcCount').val(isUndefined(data, 'electric_num'));
		}
	});

}

function getLocalTime(nS) {
	return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

function hiddenOrDisplay(obj) {
	var header = $(obj).parent().parent();

	var className = $(obj).prop('class');
	if (className == 'icon-plus') {
		$(obj).prop('class', 'icon-minus');
		$(header).find('.tree-folder-content').css('display', 'block');

	} else if (className == 'icon-minus') {
		$(obj).prop('class', 'icon-plus');
		$(header).find('.tree-folder-content').css('display', 'none');
	}
}

//管理员强制取消关联 2020-12-29
function cancleCardForce(obj) {
	mui.confirm("强制取消关联可能会造成数据丢失，请慎重", "您确定要强制取消关联吗?", ['不了', '确定'], function(e) {
		if (e.index == 1) {
			var devices_no = $('#devices_no').html();
			var treeFolder = $(obj).parent().parent();
			var serial_no = $(treeFolder).find('.sensor_num').val();
			// console.log('强制取消关联====' + devices_no + '-' + serial_no)
			// mui.toast("设备强制解绑成功！");
			// window.location.reload();
			// var fatherWeb = plus.webview.currentWebview().opener();
			// mui.fire(fatherWeb, 'activeBack');
			///*
			$.ajax({
				url: commen_force_cancel_relation_Interface,
				type: 'get',
				dataType: 'json',
				async: true,
				data: {
					serial_no: serial_no,
					// devices_no: devices_no
				},
				success: function(e) {
					console.log('-------------', JSON.stringify(e))
					if (e.status == 'SUCCESS') {
						mui.toast("设备强制解绑成功！");
						window.location.reload();
						var fatherWeb = plus.webview.currentWebview().opener();
						mui.fire(fatherWeb, 'activeBack');
					}else{
						mui.toast(e.message);
					}

				}

			})
			//*/
		}
	})

}

/**
 * 取消关联
 */
function cancleCard(obj) {
	var btnArray = ["否", "是"];
	mui.confirm("你确定要取消关联吗？", "系统提示", btnArray, function(e) {
		if (e.index == 1) {
			var deviceId = $('#devices_no').html();
			var treeFolder = $(obj).parent().parent();
			var emeId = $(treeFolder).find('.sensor_num').val();
			var workStatus = $(treeFolder).find('.workStatus').val();
			var cardModel = $(treeFolder).find('.cardModel').val();
			var cardLedModel = $(treeFolder).find('.cardLedModel').val();
			$.ajax({
				type: 'get',
				async: true,
				dataType: 'json',
				url: commen_cancel_relation_Interface,
				data: {
					devices_no: deviceId,
					serial_no: emeId,
				},
				success: function(msg) {
					if (msg.status == "SUCCESS") {
						mui.toast(msg.message);
						window.location.reload();
						var fatherWeb = plus.webview.currentWebview().opener();
						mui.fire(fatherWeb, 'activeBack');
					}
					if (msg.status == 'ILLEGAL') {
						mui.alert('您的账户登录过期，请退出重新登录！')
					}
				}
			})

		}
	});

}

/**
 * 添加新卡
 */

$('#addNewDevice').click(function() {
	var deviceId = $('#devices_no').html();
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
		if (checkBol == true) {
			cheNum = 1;
		}
		checkedArray.push(cheNum);
		count++;
	});
	if (checkedArray.length == 0) {
		alert("采集时间至少选择一个");
		return;
	}


	return checkedArray.toString();

}

/**
 *修改设备信息
 */
$('#FinshBth').click(function() {

	var postParam = finshBtnClickReturnData();
	console.log('post===',JSON.stringify(postParam))
	if (postParam != false) {
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

	if (boldjedzs == false || boldjcjds == false || bolclxcls == false || bolclxcdb == false) {
		return false;
	} else {
		///*
		var deviceId = $('#devices_no').html();

		//设备名称
		var devices_name = $('#devices_name').val();
		if (devices_name == '' || devices_name == undefined) {
			mui.toast('设备名称不能为空');
			return false;
		}
		//企业名称
		var devices_company = $('#devices_company').val();
		if (devices_company == '' || devices_company == undefined) {
			mui.toast('企业名称不能为空');
			return false;
		}
		//分厂
		var devices_region = $('#devices_region').val();
		if (devices_region == '' || devices_region == undefined) {
			mui.toast('分厂不能为空');
			return false;
		}

		//设备出厂时间
		var devices_out_time = $('#devices_out_time').val();
		var cancle = $('.cancle');

		var paramData = new Object();
		paramData.strLoginId = localStorage.getItem("strLoginId");
		paramData.strLoginToken = localStorage.getItem("strLoginToken");
		paramData.devices_no = deviceId;
		if (companyID != undefined) {
			paramData.company_id = companyID;
		}
		else{
			let tempCom_id = ''
			for (var i = 0; i < companyArray.length; i++) {
				if(strCompany_name == companyArray[i].text){
					tempCom_id = companyArray[i].value;
					break;
				} 
			}
			
			paramData.company_id = tempCom_id;
		}
		if (regionID != undefined) {
			paramData.region_id = regionID;
		}


		//设备名称
		paramData.devices_name = devices_name;
		//出厂时间
		paramData.devices_out_time = devices_out_time;


		//电动机车
		if (strDeviceType == 'L') {
			//设备配备电机功率
			var devices_KW = $('#dojckW').val();
			//配备电机台数
			var devices_Count = $('#ddjcCount').val();

			paramData.allocate_power = devices_KW;
			paramData.electric_num = devices_Count;
		}


		//电机
		if (strDeviceType == 'E') {
			//设备型号
			var devices_model = $('#devices_model').val();

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

			//生产线
			var pro_line = $('#pro_line').val();
			if (pro_line == '' || pro_line == undefined) {
				mui.toast('生产产线不能为空');
				return false;
			}
			//设备应用场景
			var use_scenes = $('#use_scenes').val();
			if (use_scenes == '' || use_scenes == undefined) {
				mui.toast('应用场景不能为空');
				return false;
			}

			paramData.devices_model = devices_model;

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

			paramData.pro_line = pro_line;
			paramData.use_scenes = use_scenes;
		}


		if (cancle.length == 0) {
			return paramData;
		}
		///*
		else {

			var common_jsonArray = new Array();

			for (var i = 0; i < cancle.length; i++) {

				var sim_dic = new Object();
				//传感器编号
				var strCPXid = "#CPXID" + i;
				var objCPXID = $(strCPXid).val();

				//判断cpx工作模式，是省电模式，还是长连接模式

				var strCPXType = "#cpxworktype" + i;
				var objCPXType = $(strCPXType).val();

				var strModelType = ''

				if (objCPXType == "省电模式") {
					strModelType = '0'

					//数据采集模式
					var strdatacaijimodel = "#deviceCPX_model" + i;
					var caijimodel = $(strdatacaijimodel).val();
					//数据采集时间
					var strgettime = "#getDataTime" + i;
					var obj_caiji_gettime = new Array();
					obj_caiji_gettime = getCaijishijian(i);
					//采集周期
					var strzhouqi = "#timeLangth" + i;
					var obj_caiji_zhouqi = $(strzhouqi).val();

					//数据上传周期
					var struploadzhouqi = "#uploadZhouqi" + i;
					var obj_caiji_uploadzhouqi = $(struploadzhouqi).val();
					
					console.log('省电模式====',objCPXID)

					sim_dic.serial_no = objCPXID;
					sim_dic.connect_model = '0';

					if (obj_caiji_gettime.indexOf('1') == -1) {
						mui.toast('数据采集时间至少选择一个时间');
						return false;
					} else {
						var arrTime = obj_caiji_gettime.split(',');
						var workPoint = {
							'sample_time_point': arrTime
						}
						sim_dic.work_point_json = JSON.stringify(workPoint);
					}

					if (obj_caiji_zhouqi.length == 0 || obj_caiji_uploadzhouqi.length == 0) {
						mui.toast("采集周期、上传周期必须全部填写！");
						return false;
					} else {

						if (obj_caiji_zhouqi != "00:00:00") {
							var arrZQ = obj_caiji_zhouqi.split(':');
							var seconds = arrZQ[2];
							var mins = arrZQ[1] * 60;
							var hours = arrZQ[0] * 3600;
							var toCount = parseInt(hours) + parseInt(mins) + parseInt(seconds);
							sim_dic.sampling_duration = obj_caiji_zhouqi;
						} else {
							sim_dic.sampling_duration = obj_caiji_zhouqi;
						}

						if (obj_caiji_uploadzhouqi != "00:00:00") {
							var arrZQ = obj_caiji_uploadzhouqi.split(':');
							var seconds = arrZQ[2];
							var mins = arrZQ[1] * 60;
							var hours = arrZQ[0] * 3600;
							var toCount = parseInt(hours) + parseInt(mins) + parseInt(seconds);
							sim_dic.update_duration = obj_caiji_uploadzhouqi;
						} else {
							sim_dic.update_duration = obj_caiji_uploadzhouqi;
						}

					}

				}

				if (objCPXType == "长连接模式") {

					strModelType = "1"

					//采样间隔时间
					var strSD_caiyangjiange = "#SD_caiyangjiange" + i;
					var objSD_caiyangjiange = $(strSD_caiyangjiange).val();
					//上传时间间隔
					var strSD_shangchuanjiange = "#SD_shangchuanjiange" + i;
					var objSD_shangchuanjiange = $(strSD_shangchuanjiange).val();
					//心跳时间间隔
					var strSD_xintiaojiange = "#SD_xintiaojiange" + i;
					var objSD_xintiaojiange = $(strSD_xintiaojiange).val();


					if (objSD_caiyangjiange.length == 0 || objSD_shangchuanjiange.length == 0 || objSD_xintiaojiange.length == 0) {
						mui.toast("采样时间间隔、上传时间间隔、心跳时间间隔必须全部填写！");
						return false;
					} else {
						console.log('长连接模式====',objCPXID)
						sim_dic.serial_no = objCPXID;
						sim_dic.sampling_interval = objSD_caiyangjiange;
						sim_dic.upload_duration = objSD_shangchuanjiange;
						sim_dic.heart_duration = objSD_xintiaojiange;
						sim_dic.connect_model = '1';
					}

				}

				var chuannumstr = ".chuanNameNumber" + i;
				var chuannum = $(chuannumstr);
				for (var j = 0; j < chuannum.length; j++) {

					var sensorObj = new Object();
					
					//振动传感器时，修改采样量程，采样点数，传感器系数等
					if ( sim_sensorList[i].sensorList !== undefined && sim_sensorList[i].sensorList[j].sensorType == 'V') {

						// var bolxishu = checkXishu(i, j);
						// if (bolxishu == false) {
						// 	return false;
						// } else {
						// 	sensorObj.calibration_coefficient = bolxishu;
						// }

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
						
						



						// if (obj_j_model.length > 0) {
						// 	sensorObj.sampling_model = obj_j_model;
						// }
						if (obj_j_count.length > 0) {
							sensorObj.sampling_number = obj_j_count;
						}
						if (obj_j_pinlv.length > 0) {
							sensorObj.sampling_frequency = obj_j_pinlv;
						}
						if (obj_j_jingdu.length > 0) {
							sensorObj.sampling_accuracy = obj_j_jingdu;
						}
						if (obj_j_liangcheng.length > 0) {
							sensorObj.range_data = obj_j_liangcheng;
						}
						
						console.log('========post==')

					}



					//卡编号
					var str_j_card = "#cardID" + i + j;
					var obj_j_card = $(str_j_card).val();

					//传感器编号
					var str_j_chuan = "#chuanID" + i + j;
					var obj_j_chaun = $(str_j_chuan).val();

					sensorObj.serial_no = obj_j_card;
					sensorObj.sensor_no = obj_j_chaun;
					
					console.log('0-0-0-0-0-=====',sensorObj.serial_no)



					//安装位置
					var str_j_anzhuang = "anzhuang" + i + j;
					var objSelIns = selInsObj[str_j_anzhuang];

					if (objSelIns.new_installId != '') {
						if (objSelIns.old_install_id != '') {
							sensorObj.old_install_id = selInsObj[str_j_anzhuang].old_installId;
						}
						sensorObj.install_xy = selInsObj[str_j_anzhuang].new_installXY;
						sensorObj.install_id = selInsObj[str_j_anzhuang].new_installId;
					} else {
						sensorObj.install_id = selInsObj[str_j_anzhuang].old_installId;
					}
					sensorObj.connect_model = strModelType;

					var obj_commenDic = new Object();
					obj_commenDic.sensorMsgPO = sensorObj;
					obj_commenDic.simWorkModelPO = sim_dic;
					common_jsonArray.push(obj_commenDic);
				}

			}


		}


		paramData.commen_json = JSON.stringify(common_jsonArray);
		
		console.log('===============',paramData.commen_json)

		return paramData;

	}

}





function checkNewBolNumber(strings, typeStr, strid) {
	if (strings.length > 0) {
		t = parseFloat(strings);
		if (isNaN(t)) {
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

	if (obj_xishu.length > 0) {
		t = parseFloat(obj_xishu);
		if (isNaN(t)) {
			//不能转换
			mui.toast("请输入0.500--1.500的数");
			user_xishu.value = null;
			return false;

		} else {
			//转换成功
			var tnum = t.toFixed(3);
			if (tnum > 0.500 && tnum < 1.500) {
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

	if (obj_xinput.checked == false && obj_Yinput.checked == false && obj_Zinput.checked == false) {
		return false;
	} else {
		var xcheck = "0";
		var ycheck = "0";
		var zcheck = "0";
		if (obj_xinput.checked == true) {
			xcheck = "1";
		}
		if (obj_Yinput.checked == true) {
			ycheck = "1";
		}
		if (obj_Zinput.checked == true) {
			zcheck = "1";
		}
		var totalCheck = xcheck + ycheck + zcheck;
		return totalCheck;
	}

}

function postData(data) {

	console.log('data======', JSON.stringify(data))
///*
	$.ajax({
		type: "post",
		url: commen_update_device_Interface,
		async: true,
		data: data,
		dataType: 'json',
		success: function(respData) {
			console.log('resp------',JSON.stringify(respData))
			if (respData.status == 'SUCCESS') {
				mui.toast(respData.message);

				window.location.replace("./DeviceDetail.html")
			} else if (respData.status == 'ILLEGAL') {
				mui.alert('您的账户登录过期，请退出重新登录！')
			} else {
				mui.toast("提交失败：", respData.message)
			}
			// 			
			// 			 else {
			// 				mui.toast(respData.message);
			// 			}
		},
		error: function(err) {
			mui.toast("error：", err)
		}
	});

//*/
}
