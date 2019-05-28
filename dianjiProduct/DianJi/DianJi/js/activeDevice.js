var companyArray = new Array();
var reginArray = new Array();
var companyID = null;
var regionID = null;

getInitCompany();

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
function changeCompany(){	
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
}



//选择所属厂区
function changeRegion(){
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
}


function dianjigangduclick() {
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();

	userPicker.setData([{
		text: "刚性"
	}, {
		text: "弹性"
	}]);
	var strid = "newDJgangdu";
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.value = items[0].text;
	});
}

$(function() {
	var postArray = new Array();
	var getPostParam = new Array();
	getPostParam = JSON.parse(localStorage.getItem("postParam"));

	mui.plusReady(function() {

		var self = plus.webview.currentWebview();
		postArray = self.postParam;

		$('#photo').click(function() {

			var deviceId = $('#devices_no').val();

			plus.storage.setItem("imgDeviceID", deviceId)
			window.location.href = "../UploadImage.html";
		})
	})

	$('#finishBtn').click(function() {

		if(localStorage.DeveciId == undefined || localStorage.DeveciId == "undefined") {
			mui.alert("请先选择设备...");
		} else {
			updateDevices();
		}

	})

	function updateDevices() {
		var deviceId = $('#devices_no').val();

		var devices_name = $('#devices_name').val();
		var devices_model = $('#devices_model').val();
//		var company = $('#company').val();
		var devices_out_time = $('#devices_out_time').val();
		var devices_power = $('#devices_power').val();
		var install_way = $('#install_way').val();
		var work_voltage = $('#work_voltage').val();
		var devices_produce = $('#equipment_company').val();

		var power_factor = $('#gonglvyinshu').val();
		var protection = $('#fanghudengji').val();
		var insulation = $('#jueyuandengji').val();
		var bearing_model = $('#equipment_zhoucheng').val();
//		var work_shop = $('#chejian').val();
		var pro_line = $('#shengchanxian').val();
		var use_scenes = $('#equipment_yingyong').val();
		var install_xy = $('#diliweizhi').val();

		var dainjizhuansu = $("#newDJzhuansu").val();
		var dainjiduishu = $("#newDJcijiduishu").val();
		var dainjigangdu = $("#newDJgangdu").val();
		var dainjitype = $("#newDJlzqtype").val();
		var cllunshu = $("#newCLlunshu").val();
		var clchuandongbi = $("#newCLchuandongbi").val();

		if(deviceId == '' || deviceId == undefined) {
			mui.toast('设备编号不能为空');
			return false;
		}
		if(devices_name == '' || devices_name == undefined) {
			mui.toast('设备名称不能为空');
			return false;
		}
		//		if(devices_model == '' || devices_model == undefined) {
		//			mui.toast('设备类型不能为空');
		//			return false;
		//		}
//		if(company == '' || company == undefined) {
//			mui.toast('企业名称不能为空');
//			return false;
//		}
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
		//		if(devices_out_time == '' || devices_out_time == undefined) {
		//			mui.toast('出厂时间不能为空');
		//			return false;
		//		}
		//		if(devices_power == '' || devices_power == undefined) {
		//			mui.toast('额定功率不能为空');
		//			return false;
		//		}

		//		if(install_way == '' || install_way == undefined) {
		//			mui.toast('安装方式不能为空');
		//			return false;
		//		}
		//		if(work_voltage == '' || work_voltage == undefined) {
		//			mui.toast('工作电压不能为空');
		//			return false;
		//		}
		//		if(devices_produce == '' || devices_produce == undefined) {
		//			mui.toast('生产厂商不能为空');
		//			return false;
		//		}
		//		if(power_factor == '' || power_factor == undefined) {
		//			mui.toast('功率因数不能为空');
		//			return false;
		//		}
		//		if(protection == '' || protection == undefined) {
		//			mui.toast('防护等级不能为空');
		//			return false;
		//		}
		//		if(insulation == '' || insulation == undefined) {
		//			mui.toast('绝缘等级不能为空');
		//			return false;
		//		}
		//		if(bearing_model == '' || bearing_model == undefined) {
		//			mui.toast('轴承型号不能为空');
		//			return false;
		//		}
//		if(work_shop == '' || work_shop == undefined) {
//			mui.toast('分厂不能为空');
//			return false;
//		}
		if(pro_line == '' || pro_line == undefined) {
			mui.toast('生产产线不能为空');
			return false;
		}
		if(use_scenes == '' || use_scenes == undefined) {
			mui.toast('应用场景不能为空');
			return false;
		}
		//		if(install_xy == '' || install_xy == undefined) {
		//			mui.toast('地理位置不能为空');
		//			return false;
		//		}
		//		if(dainjizhuansu == '' || deviceId == undefined) {
		//			mui.toast('点击额定转速不能为空');
		//			return false;
		//		}
		//		if(dainjiduishu == '' || dainjiduishu == undefined) {
		//			mui.toast('电机磁极对数不能为空');
		//			return false;
		//		}
		//		if(dainjigangdu == '' || dainjigangdu == undefined) {
		//			mui.toast('电机基座刚度不能为空');
		//			return false;
		//		}
		//		if(dainjitype == '' || dainjitype == undefined) {
		//			mui.toast('电机联轴器类型不能为空');
		//			return false;
		//		}
		//		if(cllunshu == '' || cllunshu == undefined) {
		//			mui.toast('齿轮箱齿轮数不能为空');
		//			return false;
		//		}
		//		if(clchuandongbi == '' || clchuandongbi == undefined) {
		//			mui.toast('齿轮箱传动比不能为空');
		//			return false;
		//		}

		var json_post = JSON.stringify(postArray);

		///*
		var paramData = new Object();
		paramData.strLoginId = localStorage.getItem("strLoginId");
		paramData.strLoginToken = localStorage.getItem("strLoginToken");

//		paramData.company = company;
		paramData.devices_no = deviceId;
		if (companyID != undefined) {
			paramData.company_id = companyID;
		}
		if (regionID != undefined) {
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
		paramData.rated_speed = dainjizhuansu;
		paramData.magnetism_pair = dainjiduishu;
		paramData.base_rigidity = dainjigangdu;
		paramData.coupling_type = dainjitype;
		paramData.gearbox_gear_pair = cllunshu;
		paramData.gearbox_transmission_ratio = clchuandongbi;

//		paramData.work_shop = work_shop;
		paramData.pro_line = pro_line;
		paramData.use_scenes = use_scenes;

		paramData.commen_json = JSON.stringify(getPostParam);

		$.ajax({
			type: 'post',
			async: false,
			data: paramData,
			url: commen_update_device_Interface,
			dataType: 'json',
			success: function(msg) {

				if(msg.status == "SUCCESS") {
					mui.toast(msg.message);
					addSim(localStorage.simID);
				} 
				if (msg.status == 'ILLEGAL') {
					mui.alert('您的账户登录过期，请退出重新登录！')
				}
			}

		})

	}

	function addSim(newImei) {
		//		alert("success");
		var data = {
			devices_no: $('#devices_no').val(),
			serial_no: newImei
		};
		console.log(JSON.stringify(data));
		$.ajax({
			type: "get",
			//		url:"http://47.94.166.103:1111/APP/appAddOrDeleteSim",
			url: commen_appAddSim_Interface,
			async: true,
			data: data,
			dataType: 'json',
			success: function(msg) {
				console.log("-------" + JSON.stringify(msg));
				if(msg.status == "SUCCESS") {
					localStorage.DeveciId = $('#devices_no').val();
					//					localStorage.setItem("detailBack","back");
					window.location.replace("../DeviceDetail.html");
				}
				if (msg.status == 'ILLEGAL') {
					mui.alert('您的账户登录过期，请退出重新登录！')
				}

			}
		});

	}

	function isUndefined(list, key) {

		if(list == undefined || list == null) {
			val = '';
			return val;
		} else {

			return list[key];
		}

	}

	function buildDeviceInfo(list) {

		$('#devices_no').val(isUndefined(list, 'devices_no'));
		$('#devices_name').val(isUndefined(list, 'devices_name'));
		//企业名称
		$('#devices_company').val(isUndefined(list, 'company_name'));
		//分厂
		$('#devices_region').val(isUndefined(list, 'region_name'));
		
		$('#devices_model').val(isUndefined(list, 'devices_model'));
//		$('#company').val(isUndefined(list, 'company'));
		$('#devices_out_time').val(isUndefined(list, 'devices_out_time'));
		$('#devices_power').val(isUndefined(list, 'devices_power'));
		$('#install_way').val(isUndefined(list, 'install_way'));
		$('#work_voltage').val(isUndefined(list, 'work_voltage'));
		$('#equipment_company').val(isUndefined(list, 'devices_produce'));

		$('#gonglvyinshu').val(isUndefined(list, 'power_factor'));
		$('#fanghudengji').val(isUndefined(list, 'protection'));
		$('#jueyuandengji').val(isUndefined(list, 'insulation'));
		$('#equipment_zhoucheng').val(isUndefined(list, 'bearing_model'));
		//
		$('#newDJzhuansu').val(isUndefined(list, 'rated_speed'));
		$('#newDJcijiduishu').val(isUndefined(list, 'magnetism_pair'));
		$('#newDJgangdu').val(isUndefined(list, 'base_rigidity'));
		$('#newDJlzqtype').val(isUndefined(list, 'coupling_type'));
		$('#newCLlunshu').val(isUndefined(list, 'gearbox_gear_pair'));
		$('#newCLchuandongbi').val(isUndefined(list, 'gearbox_transmission_ratio'));
		//

//		$('#chejian').val(isUndefined(list, 'work_shop'));
		$('#shengchanxian').val(isUndefined(list, 'pro_line'));
		$('#equipment_yingyong').val(isUndefined(list, 'use_scenes'));
		$('#diliweizhi').val(isUndefined(list, 'install_xy'));

	}

	function activeDevice(val) {
		//	console.log(val);

		deviceId = val;

		$.ajax({
			type: "get",
			async: false,
			data: {
				str_devices_no: deviceId,
			},
			//			url: "http://47.94.166.103:1111/APP/commen_gain_device_detail",
			url: commen_gain_device_detail_Interface,
			dataType: 'json',
			success: function(msg) {

				if(msg.status == "SUCCESS") {
					var list = msg.data;
					buildDeviceInfo(list);
				} 
				if (msg.status == 'ILLEGAL') {
					mui.alert('您的账户登录过期，请退出重新登录！')
				}
			},
			error: function(error) {
				mui.toast("获取信息失败...")
			}
		});
	}

	$('#get').click(function() {
		var deviceId = $('#searchInput').val();
		localStorage.DeveciId = deviceId;
		activeDevice(localStorage.DeveciId);
	})

	activeDevice(localStorage.DeveciId);

})