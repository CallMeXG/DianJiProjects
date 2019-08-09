$('#content .swiper-container').on("click", ".swiper-slide", function() {
	swiper.slideTo($(this).index())
	$('#preview .swiper-container').css("z-index", 100)

})

$('#preview .swiper-container').on("click", ".swiper-slide", function() {
	$('#preview .swiper-container').css("z-index", -100)

})

//初始化设备详情
$.ajax({
	type: "get",
	url: commen_gain_device_detail_Interface,
	async: true,
	data: {
		str_devices_no: localStorage.DeveciId
	},
	dataType: 'json',
	success: function(res) {
		console.log("7777777777")
		if(res.status == "SUCCESS") { //有正确的返回
			//对于缩略图的处理
			var length = 0;
			if(res.data.photo_list != null) {
				length = res.data.photo_list.length;
				for(var i = 0; i < length; i++) {
					str = '<div class="swiper-slide"><img src=' + res.data.photo_list[i].min_photo_url + '></div>';
					var oli = $(str);
					$("#content .swiper-wrapper").append(oli)
				}
				swiper = $('#content .swiper-container').swiper({
					slidesPerView: 3,
					spaceBetween: 10
				});

				//对于原图的处理
				var max_length = res.data.photo_list.length;
				for(var i = 0; i < max_length; i++) {
					str = '<div class="swiper-slide"><img src=' + res.data.photo_list[i].photo_url + '></div>';
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

			dealDeviceData(res);

		} 
		if (res.status == 'ILLEGAL') {
			mui.alert('您的账户登录过期，请退出重新登录！')
		}
	},
	error: function() {

	}
});

function dealDeviceData(msg) {
	var info = msg.data;
	//设备编号
	$("#deviceId").html("设备编号: " + isUndefined(info, 'devices_no'));
	$("#device_no").val(isUndefined(info, 'devices_no'));
	//设备名称
	$("#idOFdeviceName").val(isUndefined(info, 'devices_name'));
	//设备编号
	$("#idOFdeviceNUM").val(isUndefined(info, 'devices_no'));
	//设备型号
	$("#idOFdeviceType").val(isUndefined(info, 'devices_model'));
	//企业名称
	$("#idOFqiName").val(isUndefined(info, 'company'));
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
	
}

function isUndefined(list, key) {
	if(list == undefined || list == null || list[key] == null || list[key] == undefined) {
		val = '----';
		return val;
	} else {

		return list[key];
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
