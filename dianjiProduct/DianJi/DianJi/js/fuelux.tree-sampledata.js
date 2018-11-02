function hiddenOrDisplay(obj) {
	var header = $(obj).parent().parent();

	var className = $(obj).prop('class');
	if(className == 'icon-plus') {
		$(obj).prop('class', 'icon-minus');
		$(header).find('.tree-folder-content').css('display', 'block');
	} else if(className == 'icon-minus') {
		$(obj).prop('class', 'icon-plus');
		$(header).find('.tree-folder-content').css('display', 'none');
	}
}

mui.plusReady(function() {

	document.addEventListener('activeBack', function() {
		console.log('=====激活后，返回到设备详情页，并刷新');
		$('#tree1 div').remove();
		plus.nativeUI.showWaiting('正在加载数据...');
		$.ajax({

			type: "GET",
			async: false,
			data: {
				str_devices_no: localStorage.DeveciId
			},
			url: commen_gain_device_detail_Interface,
			dataType: 'json',

			success: function(msg) {
				plus.nativeUI.closeWaiting();
				if(msg.status == "SUCCESS") {
					var sim = "";
					if(msg.data.hasOwnProperty("sim_list")) {
						sim = msg.data.sim_list;
						for(var i = 0; i < sim.length; i++) {
							var key = sim[i]['serial_no'];
							sensorData_whx(key, i);
						}
					}
				} else {
					plus.nativeUI.closeWaiting();
					mui.toast(msg.message);
				}

			},
			error: function(error) {
				plus.nativeUI.closeWaiting();
			}

		});

	});

	var strUserType = localStorage.getItem("userType");
	if(strUserType < 10) {
		$("#xiugai").hide();
	}
	if(strUserType > 10) {
		$("#xiugai").show();
	}

	$("#xiugai").on("tap", function() {
		window.location.href = "ModifyInformation.html";
	})
	$("#dianjian").on("tap", function() {
		window.location.href = "view/check.html";
	})
	$("#shuju").on("tap", function() {
		var strname = $("#idOFdeviceName").val();
		localStorage.setItem("deviceName", strname);
		window.location.href = "newDataChart.html";
		//	window.location.href = "Monitor.html";
	})
	$("#changeDeviceID").on('tap', function() {
		//判断权限，是否显示修改信息
		var strUserType = localStorage.getItem("userType");
		if(strUserType < 10) {
			mui.alert('您没有权限进行设备信息修改，请先去申请相关权限！', '无访问权限', '我知道了');
		}
		if(strUserType > 10) {
			var webDetail = plus.webview.create('ModifyInformation.html', 'ModifyInformation.html');
			webDetail.show();

//			mui.openWindow({
//				url: 'ModifyInformation.html',
//				id: 'ModifyInformation.html'
//			})
		}

	})

	function ckResult(val) {

		if(val == 0) {
			return '正常';
		} else if(val == 1) {
			return '故障';
		} else {
			return '未知';
		}

	}

	function isUndefined(list, key) {
		if(list == undefined || list == null || list[key] == null || list[key] == undefined) {
			val = '----';
			return val;
		} else {

			return list[key];
		}
	}
	/**
	 * http://47.94.166.103:1111/APP/commen_gain_sim
	 * @param  emeId 传感器卡卡号
	 */
	function sensorData_whx(emeId, index) {

		var children;
		$.ajax({
			type: 'get',
			url: commen_gain_sim_Interface,
			async: false,
			data: {
				serial_no: emeId
			},
			dataType: 'json',
			success: function(msg) {

				if(msg.status == "SUCCESS") {

					if(typeof(msg.data) != "undefined") {
						setUIForCPX(msg.data, index);
					}

				} else {
					mui.toast(msg.message);
				}

			}
		})

		return children;

	}

	function setUIForCPX(simData, i) {

		//卡工作状态
		var workStute = simData.work_status;
		//卡激活状态
		var cardJihuostute = simData.state;

		var strWorkStuts = "----";
		var strJiHuoStatus = "----";

		if(cardJihuostute == 5) {
			strJiHuoStatus = "已激活";
		}
		if(cardJihuostute == 6) {
			strJiHuoStatus = "未激活";
		}
		if(cardJihuostute == 7) {
			strJiHuoStatus = "待激活";
		}

		if(workStute == undefined) {
			strWorkStuts = "----";
		}
		if(workStute == 0) {
			strWorkStuts = "工作";
		}
		if(workStute == 1) {
			strWorkStuts = "失联";
		}
		if(workStute == 2) {
			strWorkStuts = "关机";
		}
		if(workStute == 3) {
			strWorkStuts = "休眠";
		}
		if(workStute == 4) {
			strWorkStuts = "故障";
		}

		var sensorStr = '<div class="tree-folder">';
		sensorStr += '<div class="tree-folder-header">';
		sensorStr += '<i style="hidden:display" onclick="hiddenOrDisplay(this)" class="icon-minus"></i>';
		sensorStr += '<div class="tree-folder-name">' + isUndefined(simData, 'sim_name') + '传感器卡： ' + simData.serial_no + '</div></div>';
		sensorStr += '<div class="tree-folder-content" style="display: block;">';
		sensorStr += '<ul class="mui-table-view" style="margin-left:-20px;">';
		sensorStr += '<li class="mui-table-view-cell">Imie：' + isUndefined(simData, 'imei') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">物联网卡号：' + isUndefined(simData, 'internet_things_no') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">生产厂商：' + isUndefined(simData, 'produce') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">生产批次：' + isUndefined(simData, 'pro_bitch') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">硬件版本：' + isUndefined(simData, 'version') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">本地时间：' + isUndefined(simData, 'local_time') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">日志：----</li>';
		if(typeof(simData.mcc) == "undefined") {
			sensorStr += '<li class="mui-table-view-cell">小区信息：---- </li>';
		} else {
			sensorStr += '<li class="mui-table-view-cell">小区信息：' + simData.mcc + simData.mnc + '-' + simData.lac + '-' + simData.cell_no + '-' + simData.bsic + '</li>';
		}
		//	sensorStr += '<li class="mui-table-view-cell">小区信息：' + isUndefined(simData, 'cell_no') + '</li>';
		if(typeof(simData.signal_intensity) != 'undefined') {
			if(simData.signal_intensity == 0) {
				sensorStr += '<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhaonull.png" width="30px" height="30px" style="margin-top:-10px;" /></li>';
			}
			if((simData.signal_intensity > 1 || simData.signal_intensity == 1) && (simData.signal_intensity < 8 || simData.signal_intensity == 8)) {
				sensorStr += '<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao1.png" width="30px" height="30px" style="margin-top:-10px;" /></li>';
			}
			if((simData.signal_intensity > 9 || simData.signal_intensity == 9) && (simData.signal_intensity < 12 || simData.signal_intensity == 12)) {
				sensorStr += '<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao2.png" width="30px" height="30px" style="margin-top:-10px;" /></li>';
			}
			if((simData.signal_intensity > 13 || simData.signal_intensity == 13) && (simData.signal_intensity < 17 || simData.signal_intensity == 17)) {
				sensorStr += '<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao3.png" width="30px" height="30px" style="margin-top:-10px;" /></li>';
			}
			if((simData.signal_intensity > 18 || simData.signal_intensity == 18) && (simData.signal_intensity < 20 || simData.signal_intensity == 20)) {
				sensorStr += '<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao4.png" width="30px" height="30px" style="margin-top:-10px;" /></li>';
			}
			if((simData.signal_intensity > 21 || simData.signal_intensity == 21) && (simData.signal_intensity < 25 || simData.signal_intensity == 25)) {
				sensorStr += '<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao5.png" width="30px" height="30px" style="margin-top:-10px;" /></li>';
			}
			if((simData.signal_intensity > 26 || simData.signal_intensity == 26) && (simData.signal_intensity < 31 || simData.signal_intensity == 31)) {
				sensorStr += '<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao6.png" width="30px" height="30px" style="margin-top:-10px;" /></li>';
			}
		} else {
			sensorStr += '<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span><img src="img/xinhaoNO.png" width="30px" height="30px" style="margin-top:-10px;" /></li>';
		}
		if(typeof(simData.dump_percentage) != "undefined") {
			if(simData.dump_percentage > 84 || simData.dump_percentage == 84) {
				sensorStr += '<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;" src="img/dianchi84.jpg" height="20px"/></li>';
			}
			if((simData.dump_percentage > 67 || simData.dump_percentage == 67) && simData.dump_percentage < 84) {
				sensorStr += '<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;" src="img/dianchi80.jpg" height="20px"/></li>';
			}
			if((simData.dump_percentage > 50 || simData.dump_percentage == 50) && simData.dump_percentage < 67) {
				sensorStr += '<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;" src="img/dianchi50.jpg" height="20px"/></li>';
			}
			if((simData.dump_percentage > 34 || simData.dump_percentage == 34) && simData.dump_percentage < 50) {
				sensorStr += '<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;" src="img/dianchi34.jpg" height="20px"/></li>';
			}
			if((simData.dump_percentage > 16 || simData.dump_percentage == 16) && simData.dump_percentage < 34) {
				sensorStr += '<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;" src="img/dianchi16.jpg" height="20px"/></li>';
			}
			if((simData.dump_percentage > 0 || simData.dump_percentage == 0) && simData.dump_percentage < 16) {
				sensorStr += '<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;" src="img/dianchi00.jpg" height="20px"/></li>';
			}

		} else {

		}

		sensorStr += '<li class="mui-table-view-cell">数据流量：----</li>';
		sensorStr += '<li class="mui-table-view-cell">卡固件版本：' + isUndefined(simData, 'sim_verison_id') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">卡激活状态：' + strJiHuoStatus + '</li>';
		sensorStr += '<li class="mui-table-view-cell">激活时间：' + isUndefined(simData, 'active_time') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">最后一次连接服务器时间：' + isUndefined(simData.connectionVO, 'connection_time') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">工作状态：' + strWorkStuts + '</li>';
		sensorStr += '<li class="mui-table-view-cell">采样时间：</li>';

		sensorStr += '<li class="mui-table-view-cell" style="height:260px;margin-left:-20px;margin-top:-10px;width:110%;"><div class="checkBox_24">' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_0"  type="checkbox"><p>00:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_1"  type="checkbox"><p>01:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_2"  type="checkbox"><p>02:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_3"  type="checkbox"><p>03:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_4"  type="checkbox"><p>04:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_5"  type="checkbox"><p>05:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_6"  type="checkbox"><p>06:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_7"  type="checkbox"><p>07:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_8"  type="checkbox"><p>08:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_9"  type="checkbox"><p>09:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_10"  type="checkbox"><p>10:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_11"  type="checkbox"><p>11:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_12"  type="checkbox"><p>12:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_13"  type="checkbox"><p>13:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_14"  type="checkbox"><p>14:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_15"  type="checkbox"><p>15:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_16"  type="checkbox"><p>16:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_17"  type="checkbox"><p>17:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_18"  type="checkbox"><p>18:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_19"  type="checkbox"><p>19:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_20"  type="checkbox"><p>20:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_21"  type="checkbox"><p>21:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_22"  type="checkbox"><p>22:00:00</p></div>' +
			'<div><input disabled="disabled" name="item_' + i + '" id="chebox_23"  type="checkbox"><p>23:00:00</p></div>' +
			'</div> </li>';
		sensorStr += '<li class="mui-table-view-cell">数据上传时间：' + isUndefined(simData, 'upload_time_mode') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">数据上传周期：' + isUndefined(simData, 'update_duration') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">采集周期：' + isUndefined(simData, 'sampling_duration') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">休眠时间：' + isUndefined(simData, 'sleep_time') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">唤醒时间：' + isUndefined(simData, 'notify_time') + '</li>';

		sensorStr += '</ul></div>';
		///*
		if(typeof(simData.sensorList) != "undefined") {
			for(var j = 0; j < simData.sensorList.length; j++) {
				var sensorData = simData.sensorList[j];
				sensorStr += '<div class="tree-folder-content" style="display: block;">';
				sensorStr += '<div class="tree-folder"><div class="tree-folder-header"> <i></i><div class="tree-folder-name chuanNameNumber' + '">传感器:' + isUndefined(sensorData, 'sensor_no') + '</div></div></div>';
				sensorStr += '<div class="tree-folder-content" style="display: block;">';
				sensorStr += '<ul class="mui-table-view" style="margin-left:-10px;">';
				sensorStr += '<li class="mui-table-view-cell">传感器名称：' + isUndefined(sensorData, 'sensor_name') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">硬件版本：' + isUndefined(sensorData, 'version') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">固件版本：' + isUndefined(sensorData, 'fw_version') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">校准日期：' + isUndefined(sensorData, 'calibration_time') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">安装位置：' + isUndefined(sensorData, 'install_xy') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">拓扑位置：' + chuanganqiTuopu(sensorData.topology_xy) + '</li>';
				sensorStr += '<li class="mui-table-view-cell">传感器状态：' + chuanganqiStatus(sensorData.sensor_status) + '</li>';
				sensorStr += '<li class="mui-table-view-cell">温度传感器灵敏度：' + isUndefined(sensorData, 'sensitives') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">振动传感器灵敏度：' + isUndefined(sensorData, 'sensitivity') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">信号采样模式：' + isUndefined(sensorData, 'sampling_model') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">量程：' + isUndefined(sensorData, 'range_data') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">采样点数：' + isUndefined(sensorData, 'sampling_number') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">采样频率：' + isUndefined(sensorData, 'sampling_frequency') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">采样精度：' + isUndefined(sensorData, 'sampling_accuracy') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">传感器工作轴数：' + chuanganqiZhoushu(sensorData.working_axis) + '</li>';
				sensorStr += '<li class="mui-table-view-cell">传感器校准系数：' + isUndefined(sensorData, 'calibration_coefficient') + '</li>';

				sensorStr += '</ul></div></div>';

			}
		}
		//*/
		sensorStr += '</div></div>';

		$('#tree1').append(sensorStr);

		var itemKey = '[name=item_' + i + ']:checkbox';
		$(itemKey).each(function(index) {
			var arrTimeCount = JSON.parse(simData.work_point_json).sample_time_point;
			var idType = arrTimeCount[index];
			var bolCheck = false;
			if(idType == 1) {
				bolCheck = true;
			}
			$(this).prop("checked", bolCheck);
		})

	}

	//传感器拓扑位置
	function chuanganqiTuopu(strings) {
		if(strings != undefined) {
			if(strings == 1 || strings == 2 || strings == 3 || strings == 4) {
				return strings + "--第一链";
			}
			if(strings == 5 || strings == 6 || strings == 7 || strings == 8) {
				return strings + "--第二链";
			}
		} else {
			return "----";
		}

	}
	//传感器状态
	function chuanganqiStatus(strings) {
		if(strings != undefined) {
			if(strings == 0) {
				return "正常";
			}
			if(strings == 1) {
				return "损坏";
			}
		} else {
			return "----";
		}

	}

	//传感器工作轴数
	function chuanganqiZhoushu(strings) {
		if(strings != undefined) {
			var xaxis = strings.substring(0, 1);
			var yaxis = strings.substring(1, 2);
			var zaxis = strings.substring(2, 3);
			var newArray = new Array();
			if(xaxis == 1) {
				newArray.push("X轴");
			}
			if(yaxis == 1) {
				newArray.push("Y轴");
			}
			if(zaxis == 1) {
				newArray.push("Z轴");
			}
			return newArray;
		} else {
			return "----";
		}

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

	function devicesWaring(val) {
		switch(val) {
			case 0:
				return "故障";
				break;
			case 1:
				return "正常";
				break;

			default:
				return "";

		}
	}

	$('#content .swiper-container').on("click", ".swiper-slide", function() {
		swiper.slideTo($(this).index())
		$('#preview .swiper-container').css("z-index", 100)

	})

	$('#preview .swiper-container').on("click", ".swiper-slide", function() {
		$('#preview .swiper-container').css("z-index", -100)

	});

	$('#refreshDeviceDetail').on('tap', function() {

		$('#tree1 div').remove();
		plus.nativeUI.showWaiting('正在加载数据...');
		$.ajax({

			type: "GET",
			async: false,
			data: {
				str_devices_no: localStorage.DeveciId
			},
			url: commen_gain_device_detail_Interface,
			dataType: 'json',

			success: function(msg) {
				plus.nativeUI.closeWaiting();
				if(msg.status == "SUCCESS") {
					var sim = "";
					if(msg.data.hasOwnProperty("sim_list")) {
						sim = msg.data.sim_list;
						for(var i = 0; i < sim.length; i++) {
							var key = sim[i]['serial_no'];
							sensorData_whx(key, i);
						}
					}
				} else {
					plus.nativeUI.closeWaiting();
					mui.toast(msg.message);
				}

			},
			error: function(error) {
				plus.nativeUI.closeWaiting();
			}

		});

	})

	getDataFromSever();

	function getDataFromSever() {
		console.log("000000000===" + localStorage.DeveciId)
		plus.nativeUI.showWaiting('正在加载数据...');
		$.ajax({

			type: "GET",
			async: false,
			data: {
				str_devices_no: localStorage.DeveciId
			},
			url: commen_gain_device_detail_Interface,
			dataType: 'json',

			success: function(msg) {
				plus.nativeUI.closeWaiting();
				if(msg.status == "SUCCESS") {
					var length = 0;
					if(msg.data.photo_list != null) {
						length = msg.data.photo_list.length;
						for(var i = 0; i < length; i++) {
							str = '<div class="swiper-slide"><img src=' + msg.data.photo_list[i].photo_url + '></div>';
							var oli = $(str);
							$("#content .swiper-wrapper").append(oli)
						}
						swiper = $('#content .swiper-container').swiper({
							slidesPerView: 3,
							spaceBetween: 10
						});

						//对于原图的处理
						var max_length = msg.data.photo_list.length;
						for(var i = 0; i < max_length; i++) {
							str = '<div class="swiper-slide"><img src=' + msg.data.photo_list[i].photo_url + '></div>';
							var oli = $(str);
							$("#preview .swiper-wrapper").append(oli)
						}
						swiper = $('#preview .swiper-container').swiper({
							//				nextButton: '.swiper-button-next',
							//				prevButton: '.swiper-button-prev',
							pagination: '.swiper-pagination',
							paginationType: 'fraction'
						});
					}

					var info = msg.data;
					//设备编号
					$("#deviceId").html("设备编号: " + isUndefined(info, 'devices_no'));
					$("#device_no").val(isUndefined(info, 'devices_no'));
					//设备名称
					$("#idOFdeviceName").val(isUndefined(info, 'devices_name'));
					//设备编号
					$("#idOFdeviceNUM").val(isUndefined(info, 'devices_no'));
					//所属公司 
					$("#idOFCompany").val(isUndefined(info, 'company_name'));
					//所属厂区 
					$("#idOFRegin").val(isUndefined(info, 'region_name'));
					//设备型号
					$("#idOFdeviceType").val(isUndefined(info, 'devices_model'));
					//企业名称
					//			$("#idOFqiName").val(isUndefined(info, 'company'));
					//设备出厂时间
					$("#idOFdeviceTime").val(isUndefined(info, 'devices_out_time'));
					//额定功率
					$("#idOFGonglv").val(isUndefined(info, 'devices_power'));
					//安装方式
					$("#idOFAnzhuang").val(isUndefined(info, 'install_way'));
					//工作电压
					$("#idOFdianya").val(isUndefined(info, 'work_voltage'));

					//设备生产商
					$("#idOFshengchanshang").val(isUndefined(info, 'devices_produce'));
					var strWorkStatus = workStatus(isUndefined(info, 'work_status'));
					//工作状态
					$("#idOFWorkStatus").val(strWorkStatus);
					//设备预期寿命
					var age = 0;
					if(info['devices_age']) age = info['devices_age'];

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

					//设备故障类型
					if(info.devices_waring == undefined) {
						$("#idOFguzhangtype").val("----");
					} else {
						var strGuzhangTyep = devicesWaring(isUndefined(info, 'devices_waring'));
						$("#idOFguzhangtype").val(strGuzhangTyep);
					}

					//车间
					$("#idOFchejian").val(isUndefined(info, 'work_shop'));
					//生产线
					$("#idOFshengchanLine").val(isUndefined(info, 'pro_line'));
					//设备应用场景
					$("#idOFchangjing").val(isUndefined(info, 'use_scenes'));
					//点检人信息
					$("#idOFdianjianName").val(isUndefined(info, 'ck_name'));
					//点检时间
					$("#idOFdianjiaTime").val(isUndefined(info, 'ck_time'));
					//点检结果
					if(info.ck_result == undefined) {
						$("#idOFdianjieresult").val("----");
					} else {
						if(info.ck_result == 0) {
							$("#idOFdianjieresult").val("正常");
						}
						if(info.ck_result == 1) {
							$("#idOFdianjieresult").val("故障");
						}
					}

					var sim = "";
					if(msg.data.hasOwnProperty("sim_list")) {
						sim = msg.data.sim_list;
						for(var i = 0; i < sim.length; i++) {
							var key = sim[i]['serial_no'];
							sensorData_whx(key, i);
						}
					}

				} else {
					plus.nativeUI.closeWaiting();
					mui.toast(msg.message);
				}

			},
			error: function(error) {
				plus.nativeUI.closeWaiting();
			}

		});

	}
})