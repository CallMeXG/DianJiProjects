function hiddenOrDisplay(obj) {
	console.log('aaaaaa====', obj)
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

let pwChangeId = ''


var app = new Vue({
	el: '#app-power',
	data() {
		return {

			powerType: {
				text: '点此选择',
				battery_type: '--',
				battery_total: '--',
				battery_company: '--'
			}, //电池型号选择
			powerRemarks: '', //备注
			listDru: [{ //电池方向
					text: '电源平放',
					value: '0.85',
				},
				{ //电池方向
					text: '电源正向上',
					value: '1',
				},
				{ //电池方向
					text: '电源正向下',
					value: '0.75',
				}
			],
			currenindex: null,
			powerTypeArray: [], //电池型号列表
		}
	},
	methods: {
		//选择电源型号
		changePowerType() {

			var picker = new mui.PopPicker();
			picker.setData(this.powerTypeArray);
			const that = this;
			picker.show(function(selectItems) {
				that.powerType = selectItems[0]
			})

		},
		//选择电源安装方向
		changePowerdirection(index) {
			this.currenindex = index
		},
		//提交
		submitPowerChange() {

			if (this.powerType.id == undefined) {
				mui.alert("请选择电源型号")
				return;
			}
			if (this.currenindex == null) {
				mui.alert("请选择电源安装方向")
				return;
			}

			plus.nativeUI.showWaiting('正在提交')

			let powerParam = {
				serial_no: pwChangeId,
				devices_no: localStorage.getItem('DeveciId'),
				action_type: '1',
				content: this.powerRemarks,
				userId: localStorage.getItem('strLoginId'),
				battery_direction: this.listDru[this.currenindex].value,
				battery_id: this.powerType.id.toString()
			}

			$.ajax({
				url: commen_replace_battery_Interface,
				methods: 'get',
				dataType: 'json',
				data: powerParam,
				success: function(res) {
					plus.nativeUI.closeWaiting()
					if (res.status == 'SUCCESS') {
						mui.toast("电源更换成功！")
					} else {
						mui.toast(res.message)
					}
					$('#app-power').hide()
				},
				error: function(e) {
					plus.nativeUI.closeWaiting()
					mui.toast("电源更换失败，请重试！")
					$('#app-power').hide()
				}
			})

		}
	}
})






function changePower(value) {
	console.log('aaaa')
	$('#app-power').show()
	$('#app-pw-cpx').html(value)
	pwChangeId = value;

	app.$data.currenindex = null;
	app.$data.powerType = {
		text: '点此选择'
	}
	app.$data.powerRemarks = ''


	$.ajax({
		url: gainBatteryInfoList_Interface,
		methods: 'get',
		dataType: 'json',
		success: function(res) {
			if (res.status == 'SUCCESS') {
				let tempList = res.data;
				let tempArray = []
				for (var i = 0; i < tempList.length; i++) {
					let tempObj = tempList[i];
					tempObj.text = tempList[i].battery_type;
					tempArray.push(tempObj)
				}
				app.$data.powerTypeArray = tempArray
			}
			console.log(JSON.stringify(app.$data.powerTypeArray))
		}
	})

}



mui.plusReady(function() {


	var deMainVue = new Vue({
		el: "#deviceMainPoper",
		data() {
			return {
				cpxList: [],
				deviceNumber: localStorage.DeveciId,
				devNameCus: '',
				selCpx: {
					text: '请选择'
				},
				mainType: [],
				typeValue: {
					text: '请选择'
				},
				inputValue: '',
				segType: 'D', //被测设备 D ；  采集设备 C
			}
		},
		watch: {
			inputValue: function(n) {
				if (n.length > 20) {
					this.inputValue = n.substring(0, 20)
					mui.alert('最多输入20个字')
				}

			}
		},
		methods: {
			changeCpx() {
				var picker = new mui.PopPicker();
				picker.setData(this.cpxList);
				const that = this;
				picker.show(function(selectItems) {
					that.selCpx = selectItems[0]
				})
			},
			selectedMainType() {
				var picker = new mui.PopPicker();
				picker.setData(this.mainType);
				const that = this;
				picker.show(function(selectItems) {
					that.typeValue = selectItems[0]
				})
			},
			segControl(type) {
				this.segType = type;
				this.inputValue = '';
			},
			submitMainData() {

				let postParams = {}
				if (this.segType == 'D') {
					postParams = {
						devices_no: localStorage.getItem('DeveciId'),
						action_type: '2',
						content: this.inputValue,
						userId: localStorage.getItem('strLoginId'),
					}
				}
				if (this.segType == 'C') {
					if (this.selCpx.serial_no == undefined) {
						mui.alert('请选择维保设备')
						return;
					}
					if (this.typeValue.id == undefined) {
						mui.alert('请选择维保类型')
						return;
					}
					postParams = {
						devices_no: localStorage.getItem('DeveciId'),
						serial_no: this.selCpx.serial_no,
						action_type: '2',
						content: this.inputValue,
						userId: localStorage.getItem('strLoginId'),
						change_type_id: this.typeValue.id.toString()
					}
				}

				$.ajax({
					url: commonDevicesChange_Interface,
					methods: 'get',
					dataType: 'json',
					data: postParams,
					// {
					// 	devices_no: localStorage.getItem('DeveciId'),
					// 	serial_no: this.selCpx.serial_no,
					// 	action_type: '2',
					// 	content: this.inputValue,
					// 	userId: localStorage.getItem('strLoginId'),
					// 	change_type_id: this.typeValue.id.toString()
					// },
					success: function(res) {

						if (res.status == 'SUCCESS') {
							mui.alert('设备维保提交成功!')
							setTimeout(function(e) {
								$('#deviceMainPoper').hide()
							}, 500)
						} else {
							mui.alert(res.message)
						}
					},
					error: function(err) {
						console.log('err===', JSON.stringify(err))
					}
				})
			}
		}
	})

	//超限告警--------
	var strCJGXAlarm = 'N';

	var dataArraySim = new Array()
	document.addEventListener('activeBack', function() {
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
				
				console.log('刷新===')

				plus.nativeUI.closeWaiting();
				if (msg.status == "SUCCESS") {
					let info = msg.data;
					deMainVue.$data.devNameCus = isUndefined(info, 'devices_name') + ' ( ' + isUndefined(info, 'devices_no') +
						' ) ';
					deMainVue.$data.cpxList = []
					var sim = "";
					if (msg.data.hasOwnProperty("sim_list")) {
						sim = msg.data.sim_list;
						for (var i = 0; i < sim.length; i++) {
							var key = sim[i]['serial_no'];
							sensorData_whx(key, i);
							let objTemp = sim[i];
							objTemp.text = '采集器编号:' + sim[i]['serial_no'];
							deMainVue.$data.cpxList.push(objTemp)
						}
					}
				}
				if (msg.status == 'ILLEGAL') {
					plus.nativeUI.closeWaiting();
					mui.alert('您的账户登录过期，请退出重新登录！')
				}
			},
			error: function(error) {
				plus.nativeUI.closeWaiting();
			}

		});

	});

	var strUserType = localStorage.getItem("userType");
	if (strUserType < 10) {
		$("#xiugai").hide();
		$("#deviceMaintenance").css('color', '#d9d9da')
		if (localStorage.getItem('is_manage') == '1') {
			$("#xiugai").show();
			$("#deviceMaintenance").css('color', '#8f8f94')
		}
	}
	if (strUserType > 10) {
		$("#xiugai").show();
		$("#deviceMaintenance").css('color', '#8f8f94')
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
	$("#updateSetting").on('tap', function() {

		//判断权限，是否显示修改信息
		var strUserType = localStorage.getItem("userType");

		if (strUserType < 10 && localStorage.getItem('is_manage') != '1') {
			mui.alert('您没有权限进行设备信息修改，请先去申请相关权限！', '无访问权限', '我知道了');
		}

		if (strUserType > 10 || localStorage.getItem('is_manage') == '1') {
			var strthreshold_on_off = false;
			if (strCJGXAlarm == 'N') {
				strthreshold_on_off = false;
			} else if (strCJGXAlarm == 'Y') {
				strthreshold_on_off = true;
			}


			var webDetail = plus.webview.create('updateCpxAlarm.html', 'updateCpxAlarm.html', {}, {
				strDeviceName: $("#idOFdeviceName").val(),
				strDeviceID: $("#idOFdeviceNUM").val(),
				arrPushData: dataArraySim,
				threshold_on_off: strthreshold_on_off
			});
			webDetail.show();
			mui('.mui-popover').popover("hide");
		}

	})

	$("#changeDeviceID").on('tap', function() {
		//判断权限，是否显示修改信息
		var strUserType = localStorage.getItem("userType");
		if (strUserType < 10 && localStorage.getItem('is_manage') != '1') {
			mui.alert('您没有权限进行设备信息修改，请先去申请相关权限！', '无访问权限', '我知道了');
		}

		if (strUserType > 10 || localStorage.getItem('is_manage') == '1') {

			var webDetail = plus.webview.create('ModifyInformation.html', 'ModifyInformation.html');
			webDetail.show();
			mui('.mui-popover').popover("hide");
		}

	})
	$("#changeCEDianName").on('tap', function() {
		//判断权限，是否显示修改信息
		var strUserType = localStorage.getItem("userType");
		if (strUserType < 10 && localStorage.getItem('is_manage') != '1') {
			mui.alert('您没有权限进行设备信息修改，请先去申请相关权限！', '无访问权限', '我知道了');
		}
		if (strUserType > 10 || localStorage.getItem('is_manage') == '1') {
			mui('.mui-popover').popover("hide");
			mui.openWindow({
				url: 'updateCeDianName.html',
				id: 'updateCeDianName.html'
			})
		}

	})
	//激活cpx
	$('#addCPXNew').on('tap', function() {
		//判断权限，是否显示修改信息
		var strUserType = localStorage.getItem("userType");
		if (strUserType < 10 && localStorage.getItem('is_manage') != '1') {
			mui.alert('您没有权限进行设备信息修改，请先去申请相关权限！', '无访问权限', '我知道了');
		}
		if (strUserType > 10 || localStorage.getItem('is_manage') == '1') {
			localStorage.setItem('fatherID', 'DeviceDetail');
			mui('.mui-popover').popover("hide");
			mui.openWindow({
				url: 'barcodescanupdate.html',
				id: 'barcodescanupdate.html'
			})
		}
	})

	//设备维保
	$('#deviceMaintenance').on('tap', function() {
		console.log('11111')
		//判断权限，是否显示修改信息
		var strUserType = localStorage.getItem("userType");
		if (strUserType < 10 && localStorage.getItem('is_manage') != '1') {
			mui.alert('您没有权限进行设备信息修改，请先去申请相关权限！', '无访问权限', '我知道了');
		}
		if (strUserType > 10 || localStorage.getItem('is_manage') == '1') {
			mui('.mui-popover').popover("hide");
			$('#deviceMainPoper').show()

			deMainVue.$data.mainType = []
			$.ajax({
				url: gainChangeTypeList_Interface,
				methods: 'get',
				dataType: 'json',
				success: function(res) {
					console.log('aaa===', JSON.stringify(res))
					if (res.status == 'SUCCESS') {
						for (var i = 0; i < res.data.length; i++) {
							let tempObj = res.data[i]
							tempObj.text = res.data[i]['change_type']
							deMainVue.$data.mainType.push(tempObj)
						}


					}
				}
			})

		}
	})

	function isUndefined(list, key) {
		if (list == undefined || list == null || list[key] == null || list[key] == undefined) {
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
			async: true,
			data: {
				serial_no: emeId
			},
			dataType: 'json',
			success: function(msg) {
				if (msg.status == "SUCCESS") {
					if (typeof(msg.data) != "undefined") {

						setUIForCPX(msg.data, index);
					}
				}
				if (msg.status == 'ILLEGAL') {
					plus.nativeUI.closeWaiting();
					mui.alert('您的账户登录过期，请退出重新登录！')
				}

			}
		})
		return children;
	}

	function setUIForCPX(simData, i) {

		dataArraySim.push(simData)
		//卡工作状态
		var workStute = simData.work_status;
		//卡激活状态
		var cardJihuostute = simData.state;

		var strWorkStuts = "----";
		var strJiHuoStatus = "----";

		if (cardJihuostute == 5) {
			strJiHuoStatus = "已激活";
		}
		if (cardJihuostute == 6) {
			strJiHuoStatus = "未激活";
		}
		if (cardJihuostute == 7) {
			strJiHuoStatus = "待激活";
		}
		if (cardJihuostute == 8) {
			strJiHuoStatus = "待解绑";
		}
		if (cardJihuostute == 9) {
			strJiHuoStatus = "配置待同步";
		}

		if (workStute == undefined) {
			strWorkStuts = "----";
		}
		if (workStute == 0) {
			strWorkStuts = "工作";
		}
		if (workStute == 1) {
			strWorkStuts = "失联";
		}
		if (workStute == 2) {
			strWorkStuts = "关机";
		}
		if (workStute == 3) {
			strWorkStuts = "休眠";
		}
		if (workStute == 4) {
			strWorkStuts = "故障";
		}

		//供电模式
		var strPowerType = '----'
		if (simData.supply_type == '0') {
			strPowerType = '电池供电'
		}
		if (simData.supply_type == '1') {
			strPowerType = '外接电源'
		}

		//CPX工作模式
		var strCPXWorkType = '----'
		if (simData.connect_model == '0') {
			strCPXWorkType = '省电模式'
		}
		if (simData.connect_model == '1') {
			strCPXWorkType = '长连接模式'
		}

		var sensorStr = '<div class="tree-folder">';
		sensorStr += '<div class="tree-folder-header">';
		sensorStr += '<i style="hidden:display" onclick="hiddenOrDisplay(this)" class="icon-minus"></i>';
		sensorStr += '<div class="tree-folder-name">' + isUndefined(simData, 'sim_name') + '传感器卡： ' + simData.serial_no +
			'<div style="height:20px;margin-left:10px;line-height:20px;border:1px solid #524598;width:70px;float: right;text-align:center;border-radius:3px;color: #524598;" onclick="changePower(\'' +
			simData.serial_no + '\')">更换电池</div></div></div>';
		sensorStr += '<div class="tree-folder-content" style="display: block;">';
		sensorStr += '<ul class="mui-table-view" style="margin-left:-20px;">';
		sensorStr += '<li class="mui-table-view-cell">Imie：' + isUndefined(simData, 'imei') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">物联网卡号：' + isUndefined(simData, 'internet_things_no') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">生产厂商：' + isUndefined(simData, 'produce') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">生产批次：' + isUndefined(simData, 'pro_bitch') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">硬件版本：' + isUndefined(simData, 'version') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">本地时间：' + isUndefined(simData, 'local_time') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">日志：----</li>';
		if (typeof(simData.mcc) == "undefined") {
			sensorStr += '<li class="mui-table-view-cell">小区信息：---- </li>';
		} else {
			sensorStr += '<li class="mui-table-view-cell">小区信息：' + simData.mcc + simData.mnc + '-' + simData.lac + '-' +
				simData.cell_no + '-' + simData.bsic + '</li>';
		}
		//	sensorStr += '<li class="mui-table-view-cell">小区信息：' + isUndefined(simData, 'cell_no') + '</li>';
		if (typeof(simData.signal_intensity) != 'undefined') {
			if (simData.signal_intensity == 0) {
				sensorStr +=
					'<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhaonull.png" width="30px" height="20px" style="margin-top:-10px;" /></li>';
			}
			if ((simData.signal_intensity > 1 || simData.signal_intensity == 1) && (simData.signal_intensity < 8 || simData.signal_intensity ==
					8)) {
				sensorStr +=
					'<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao1.png" width="30px" height="20px" style="margin-top:-10px;" /></li>';
			}
			if ((simData.signal_intensity > 9 || simData.signal_intensity == 9) && (simData.signal_intensity < 12 || simData.signal_intensity ==
					12)) {
				sensorStr +=
					'<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao2.png" width="30px" height="20px" style="margin-top:-10px;" /></li>';
			}
			if ((simData.signal_intensity > 13 || simData.signal_intensity == 13) && (simData.signal_intensity < 17 || simData
					.signal_intensity == 17)) {
				sensorStr +=
					'<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao3.png" width="30px" height="20px" style="margin-top:-10px;" /></li>';
			}
			if ((simData.signal_intensity > 18 || simData.signal_intensity == 18) && (simData.signal_intensity < 20 || simData
					.signal_intensity == 20)) {
				sensorStr +=
					'<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao4.png" width="30px" height="20px" style="margin-top:-10px;" /></li>';
			}
			if ((simData.signal_intensity > 21 || simData.signal_intensity == 21) && (simData.signal_intensity < 25 || simData
					.signal_intensity == 25)) {
				sensorStr +=
					'<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao5.png" width="30px" height="20px" style="margin-top:-10px;" /></li>';
			}
			if ((simData.signal_intensity > 26 || simData.signal_intensity == 26) && (simData.signal_intensity < 31 || simData
					.signal_intensity == 31)) {
				sensorStr +=
					'<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span>    <img src="img/xinhao6.png" width="30px" height="20px" style="margin-top:-10px;" /></li>';
			}
		} else {
			sensorStr +=
				'<li class="mui-table-view-cell" style="height:40px;margin-top:5px"><span style="float:left;"> 信号强度：&nbsp &nbsp</span><img src="img/xinhaoNO.png" width="30px" height="20px" style="margin-top:-10px;" /></li>';
		}

		if (simData.supply_type == 0 || simData.supply_type == undefined) {
			if (typeof(simData.dump_percentage) != "undefined") {

				if (simData.dump_percentage > 84 || simData.dump_percentage == 84) {

					sensorStr +=
						'<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;margin-left:8px;" src="img/dianchi100.jpg" height="15px"/></li>';
				}
				if ((simData.dump_percentage > 67 || simData.dump_percentage == 67) && simData.dump_percentage < 84) {
					console.log("dianchidianliang=-=======" + simData.dump_percentage)
					sensorStr +=
						'<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;margin-left:8px;" src="img/dianchi84.jpg" height="15px"/></li>';
				}
				if ((simData.dump_percentage > 50 || simData.dump_percentage == 50) && simData.dump_percentage < 67) {
					sensorStr +=
						'<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;margin-left:8px;" src="img/dianchi50.jpg" height="15px"/></li>';
				}
				if ((simData.dump_percentage > 34 || simData.dump_percentage == 34) && simData.dump_percentage < 50) {
					sensorStr +=
						'<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;margin-left:8px;" src="img/dianchi34.jpg" height="15px"/></li>';
				}
				if ((simData.dump_percentage > 16 || simData.dump_percentage == 16) && simData.dump_percentage < 34) {
					sensorStr +=
						'<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;margin-left:8px;" src="img/dianchi16.jpg" height="15px"/></li>';
				}
				if ((simData.dump_percentage > 0 || simData.dump_percentage == 0) && simData.dump_percentage < 16) {
					sensorStr +=
						'<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：</span><img style="float:left;margin-left:8px;" src="img/dianchi00.jpg" height="15px"/></li>';
				}

			} else {
				sensorStr +=
					'<li class="mui-table-view-cell" style="heigth:30px;margin-top:-10px;"><span style="float:left;">电池电量：----</span></li>';
			}

		}


		sensorStr += '<li class="mui-table-view-cell">数据流量：----</li>';
		sensorStr += '<li class="mui-table-view-cell">固件版本：' + isUndefined(simData, 'software_version') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">激活状态：' + strJiHuoStatus + '</li>';
		sensorStr += '<li class="mui-table-view-cell">激活时间：' + isUndefined(simData, 'active_time') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">最后一次连接服务器时间：' + isUndefined(simData.connectionVO, 'connection_time') +
			'</li>';
		sensorStr += '<li class="mui-table-view-cell">工作状态：' + strWorkStuts + '</li>';

		sensorStr += '<li class="mui-table-view-cell">供电模式：' + strPowerType + '</li>';
		if (simData.alarm_on_off == '1') {
			sensorStr +=
				'<li class="mui-table-view-cell" style="height:30px"><span style="float:left">就地告警：</span><input style="float:left;margin-top: -1px;zoom:130%" type="checkbox" disabled checked/></li>';
		} else {
			sensorStr +=
				'<li class="mui-table-view-cell" style="height:30px"><span style="float:left">就地告警：</span><input style="float:left;margin-top: -1px;zoom:130%" type="checkbox" disabled/></li>';
		}

		sensorStr += '<li class="mui-table-view-cell">CPX工作模式：' + strCPXWorkType + '</li>';

		if (simData.connect_model == '0') {
			sensorStr += '<li class="mui-table-view-cell">采样时间：</li>';

			sensorStr +=
				'<li class="mui-table-view-cell" style="height:260px;margin-left:-20px;margin-top:-10px;width:110%;"><div class="checkBox_24">' +
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
		}

		if (simData.connect_model == '1') {
			sensorStr += '<li class="mui-table-view-cell">采样间隔时间：' + isUndefined(simData, 'sampling_interval') + '  s</li>';
			sensorStr += '<li class="mui-table-view-cell">上传间隔时间：' + isUndefined(simData, 'upload_duration') + ' s</li>';
			sensorStr += '<li class="mui-table-view-cell">心跳间隔时间：' + isUndefined(simData, 'heart_duration') + '  s</li>';
		}

		sensorStr += '<li class="mui-table-view-cell">休眠时间：' + isUndefined(simData, 'sleep_time') + '</li>';
		sensorStr += '<li class="mui-table-view-cell">唤醒时间：' + isUndefined(simData, 'notify_time') + '</li>';

		sensorStr += '</ul></div>';
		///*
		if (typeof(simData.sensorList) != "undefined") {
			for (var j = 0; j < simData.sensorList.length; j++) {
				var sensorData = simData.sensorList[j];
				sensorStr += '<div class="tree-folder-content" style="display: block;">';
				sensorStr +=
					'<div class="tree-folder"><div class="tree-folder-header"> <i></i><div class="tree-folder-name chuanNameNumber' +
					'">传感器:' + isUndefined(sensorData, 'sensor_no') + '</div></div></div>';
				sensorStr += '<div class="tree-folder-content" style="display: block;">';
				sensorStr += '<ul class="mui-table-view" style="margin-left:-10px;">';
				sensorStr += '<li class="mui-table-view-cell">传感器名称：' + isUndefined(sensorData, 'sensor_name') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">硬件版本：' + isUndefined(sensorData, 'version') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">固件版本：' + isUndefined(sensorData, 'fw_version') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">校准日期：' + isUndefined(sensorData, 'calibration_time') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">安装位置：' + isUndefined(sensorData, 'install_xy') + '</li>';
				sensorStr += '<li class="mui-table-view-cell">MODBUS地址：' + sensorData.topology_xy + '</li>';
				sensorStr += '<li class="mui-table-view-cell">传感器状态：' + chuanganqiStatus(sensorData.sensor_status) + '</li>';
				if (sensorData.sensorType != undefined && sensorData.sensorType == 'V') {
					sensorStr += '<li class="mui-table-view-cell">振动传感器灵敏度：' + isUndefined(sensorData, 'sensitivity') + '</li>';
				}
				sensorStr += '<li class="mui-table-view-cell">温度传感器灵敏度：' + isUndefined(sensorData, 'sensitives') + '</li>';

				if (sensorData.alarm_judge == '1') {
					sensorStr +=
						'<li class="mui-table-view-cell" style="height:30px"><span style="float:left">告警输出：</span><input style="float:left;margin-top: -1px;zoom:130%" type="checkbox" disabled checked/></li>';
				} else {
					sensorStr +=
						'<li class="mui-table-view-cell" style="height:30px"><span style="float:left">告警输出：</span><input style="float:left;margin-top: -1px;zoom:130%" type="checkbox" disabled/></li>';
				}
				if (sensorData.control_notice == '1') {
					sensorStr +=
						'<li class="mui-table-view-cell" style="height:30px"><span style="float:left">控制输出：</span><input style="float:left;margin-top: -1px;zoom:130%" type="checkbox" disabled checked/></li>';
				} else {
					sensorStr +=
						'<li class="mui-table-view-cell" style="height:30px"><span style="float:left">控制输出：</span><input style="float:left;margin-top: -1px;zoom:130%" type="checkbox" disabled/></li>';
				}

				if (simData.alarm_on_off == '1') {
					if (sensorData.sensorType != undefined && sensorData.sensorType == 'V') {
						sensorStr += '<li class="mui-table-view-cell">X轴预警值：' + isUndefined(sensorData, 'threshold_early_x') +
							'  mm/s</li>';
						sensorStr += '<li class="mui-table-view-cell">X轴告警值：' + isUndefined(sensorData, 'threshold_alarm_x') +
							'  mm/s</li>';
						sensorStr += '<li class="mui-table-view-cell">X轴危险值：' + isUndefined(sensorData, 'threshold_danger_x') +
							'  mm/s</li>';
						sensorStr += '<li class="mui-table-view-cell">Y轴预警值：' + isUndefined(sensorData, 'threshold_early_y') +
							'  mm/s</li>';
						sensorStr += '<li class="mui-table-view-cell">Y轴告警值：' + isUndefined(sensorData, 'threshold_alarm_y') +
							'  mm/s</li>';
						sensorStr += '<li class="mui-table-view-cell">Y轴危险值：' + isUndefined(sensorData, 'threshold_danger_y') +
							'  mm/s</li>';
						sensorStr += '<li class="mui-table-view-cell">Z轴预警值：' + isUndefined(sensorData, 'threshold_early_z') +
							'  mm/s</li>';
						sensorStr += '<li class="mui-table-view-cell">Z轴告警值：' + isUndefined(sensorData, 'threshold_alarm_z') +
							'  mm/s</li>';
						sensorStr += '<li class="mui-table-view-cell">Z轴危险值：' + isUndefined(sensorData, 'threshold_danger_z') +
							'  mm/s</li>';
					}

					sensorStr += '<li class="mui-table-view-cell">温度预警值：' + isUndefined(sensorData, 'threshold_temperature_early') +
						'  ℃</li>';
					sensorStr += '<li class="mui-table-view-cell">温度告警值：' + isUndefined(sensorData, 'threshold_temperature') +
						'  ℃</li>';
					sensorStr += '<li class="mui-table-view-cell">温度危险值：' + isUndefined(sensorData, 'threshold_temperature_danger') +
						'  ℃</li>';

				}

				if (sensorData.sensorType != undefined && sensorData.sensorType == 'V') {
					sensorStr += '<li class="mui-table-view-cell">信号采样模式：' + isUndefined(sensorData, 'sampling_model') + '</li>';
					sensorStr += '<li class="mui-table-view-cell">量程：' + isUndefined(sensorData, 'range_data') + '</li>';
					sensorStr += '<li class="mui-table-view-cell">采样点数：' + isUndefined(sensorData, 'sampling_number') + '</li>';
					sensorStr += '<li class="mui-table-view-cell">采样频率：' + isUndefined(sensorData, 'sampling_frequency') + '</li>';
					sensorStr += '<li class="mui-table-view-cell">采样精度：' + isUndefined(sensorData, 'sampling_accuracy') + '</li>';
					sensorStr += '<li class="mui-table-view-cell">传感器工作轴数：' + chuanganqiZhoushu(sensorData.working_axis) + '</li>';
					sensorStr += '<li class="mui-table-view-cell">传感器校准系数：' + isUndefined(sensorData, 'calibration_coefficient') +
						'</li>';
				}

				sensorStr += '</ul></div></div>';

			}
		}
		sensorStr += '</div></div>';
		$('#tree1').append(sensorStr);
		var itemKey = '[name=item_' + i + ']:checkbox';
		$(itemKey).each(function(index) {
			var arrTimeCount = JSON.parse(simData.work_point_json).sample_time_point;
			var idType = arrTimeCount[index];
			var bolCheck = false;
			if (idType == 1) {
				bolCheck = true;
			}
			$(this).prop("checked", bolCheck);
		})
	}
	//传感器状态
	function chuanganqiStatus(strings) {
		if (strings != undefined) {
			if (strings == 0) {
				return "正常";
			}
			if (strings == 1) {
				return "损坏";
			}
		} else {
			return "----";
		}

	}

	//传感器工作轴数
	function chuanganqiZhoushu(strings) {
		if (strings != undefined) {
			var xaxis = strings.substring(0, 1);
			var yaxis = strings.substring(1, 2);
			var zaxis = strings.substring(2, 3);
			var newArray = new Array();
			if (xaxis == 1) {
				newArray.push("X轴");
			}
			if (yaxis == 1) {
				newArray.push("Y轴");
			}
			if (zaxis == 1) {
				newArray.push("Z轴");
			}
			return newArray;
		} else {
			return "----";
		}

	}

	function workStatus(val) {
		switch (val) {
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
		switch (val) {
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

		dataArraySim = []

		$('#tree1 div').remove();
		plus.nativeUI.showWaiting('正在加载数据...');
		$.ajax({
			type: "get",
			async: true,
			data: {
				str_devices_no: localStorage.DeveciId
			},
			url: commen_gain_device_detail_Interface,
			dataType: 'json',
			success: function(msg) {
				plus.nativeUI.closeWaiting();
				if (msg.status == "SUCCESS") {
					let info = msg.data;
					deMainVue.$data.devNameCus = isUndefined(info, 'devices_name') + ' ( ' + isUndefined(info, 'devices_no') +
						' ) ';
					deMainVue.$data.cpxList = []
					var sim = "";
					if (msg.data.hasOwnProperty("sim_list")) {
						sim = msg.data.sim_list;
						for (var i = 0; i < sim.length; i++) {
							var key = sim[i]['serial_no'];
							sensorData_whx(key, i);
							let objTemp = sim[i];
							objTemp.text = '采集器编号:' + sim[i]['serial_no'];
							deMainVue.$data.cpxList.push(objTemp)
						}
					}
				}
				if (msg.status == 'ILLEGAL') {
					plus.nativeUI.closeWaiting();
					mui.alert('您的账户登录过期，请退出重新登录！')
				}

			},
			error: function(error) {
				plus.nativeUI.closeWaiting();
				console.log('===')
			}

		});

	})

	getDataFromSever();

	function getDataFromSever() {
		plus.nativeUI.showWaiting('正在加载数据...');

		$.ajax({
			type: "get",
			async: true,
			data: {
				str_devices_no: localStorage.DeveciId
			},
			url: commen_gain_device_detail_Interface,
			dataType: 'json',
			success: function(msg) {
				plus.nativeUI.closeWaiting();
				if (msg.status == "SUCCESS") {
					var length = 0;
					if (msg.data.photo_list != null) {
						length = msg.data.photo_list.length;
						for (var i = 0; i < length; i++) {
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
						for (var i = 0; i < max_length; i++) {
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

					if (info != undefined) {
						if (info.threshold_on_off != undefined) {
							strCJGXAlarm = info.threshold_on_off;
						}
					}
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
					//设备出厂时间
					$("#idOFdeviceTime").val(isUndefined(info, 'devices_out_time'));

					//判断设备类型 E电机类型，L电动机车类型
					if (info.devices_type != undefined && info.devices_type == 'L') {

						$("#idDeviceTypes").val('电动机车');

						$('#idDeviceKM').val(isUndefined(info, 'allocate_power'))
						$('#idDeviceCount').val(isUndefined(info, 'electric_num'))
						var objDianji = document.getElementsByClassName('typeJC')
						for (var i = 0; i < objDianji.length; i++) {
							objDianji[i].style.display = 'block'
						}
					}

					if (info.devices_type != undefined && info.devices_type == 'E') {

						$("#idDeviceTypes").val('电机');

						var objDianji = document.getElementsByClassName('typeDJ')
						for (var i = 0; i < objDianji.length; i++) {
							objDianji[i].style.display = 'block'
						}

						//设备型号
						$("#idOFdeviceType").val(isUndefined(info, 'devices_model'));
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
						//生产线
						$("#idOFshengchanLine").val(isUndefined(info, 'pro_line'));
						//设备应用场景
						$("#idOFchangjing").val(isUndefined(info, 'use_scenes'));

					}
					deMainVue.$data.devNameCus = isUndefined(info, 'devices_name') + ' ( ' + isUndefined(info, 'devices_no') +
						' ) '
					deMainVue.$data.cpxList = []
					var sim = "";
					if (msg.data.hasOwnProperty("sim_list")) {
						sim = msg.data.sim_list;
						for (var i = 0; i < sim.length; i++) {
							var key = sim[i]['serial_no'];
							sensorData_whx(key, i);

							let objTemp = sim[i];
							objTemp.text = '采集器编号:' + sim[i]['serial_no'];
							deMainVue.$data.cpxList.push(objTemp)
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
