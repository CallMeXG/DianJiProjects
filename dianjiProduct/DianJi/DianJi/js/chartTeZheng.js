var Tezheng_cedian = new Array();
var tezheng_caijiTime = new Array();
//获取测点位置和采集时间
function getDataFromInitWithCaiyang(cedianArray, caijiTimeArray, strCedain, strTime) {
	Tezheng_cedian = cedianArray;
	console.log("cedan=="+Tezheng_cedian)
	tezheng_caijiTime = caijiTimeArray;
	$('#tezheng_place').val(strCedain);
	$('#tezheng_timeCount').val(strTime.text);
}
//下面表中数据，根据newDataChart.js获取
function getDataFromInit(respData) {
	if (respData.probeDrawVO != undefined) {
		dealWithData_tezheng(respData.probeDrawVO,respData.installList);
	}
	
}

function dealWithData_tezheng(respData,installList) {
	//X------------------------------------------------------------------
	//x -1
	
	if(respData.alias_x != undefined){
		document.getElementById('XTZText').innerHTML = 'X轴（' + respData.alias_x + '）特征值'
	}
	if(respData.alias_y != undefined){
		document.getElementById('YTZText').innerHTML = 'Y轴（' + respData.alias_y + '）特征值'
	}
	if(respData.alias_z != undefined){
		document.getElementById('ZTZText').innerHTML = 'Z轴（' + respData.alias_z + '）特征值'
	}
		

	if(typeof(respData.install_xy) != "undefined") {
		$('#tezheng_place').val(respData.install_xy);

	}
	if(typeof(installList) != "undefined") {
		Tezheng_cedian = installList;
	}
	

	if(typeof(respData.temperature) != "undefined") {
		$('#tezhengzhi_temperNum').html(respData.temperature + ' ℃');
		$('#tezhengzhi_tem_result').html("正常");
	} else {
		$('#tezhengzhi_temperNum').html("--");
		$('#tezhengzhi_tem_result').html("--");

	}
	//X轴速度有效值
	if(respData.result_speed_x != undefined) {
		$("#X_zhisudu").show();
		$("#X_zhisudu .spanCenter").html(respData.result_speed_x + ' ( mm/s )');
		$("#X_zhisudu .spanRight").html(respData.result_speed_x_warn);
	} else {
		$("#X_zhisudu").hide();
	}
	//X轴加速度有效值
	if(respData.result_rms != undefined) {
		$("#X_zhijiasudu").show();
		$("#X_zhijiasudu .spanCenter").html(respData.result_rms + ' ( m/s² )');
		$("#X_zhijiasudu .spanRight").html(respData.result_rms_warn);
	} else {
		$("#X_zhijiasudu").hide();
	}
	
	if(respData.result_kurt_x != undefined) {
		$("#X_zhi1").show();
		$("#X_zhi1 .spanCenter").html(respData.result_kurt_x);
		$("#X_zhi1 .spanRight").html(respData.result_kurt_x_warn);
	} else {
		$("#X_zhi1").hide();
	}

	//x -2
	if(respData.result_peak2peak_x != undefined) {
		$("#X_zhi2").show();
		$("#X_zhi2 .spanCenter").html(respData.result_peak2peak_x + " ( m/s² )");
		$("#X_zhi2 .spanRight").html(respData.result_peak2peak_x_warn);
	} else {
		$("#X_zhi2").hide();
	}

	//x -3
	if(respData.result_peak_x != undefined) {
		$("#X_zhi3").show();
		$("#X_zhi3 .spanCenter").html(respData.result_peak_x + " ( m/s² )");
		$("#X_zhi3 .spanRight").html(respData.result_peak_x_warn);
	} else {
		$("#X_zhi3").hide();
	}
	//x -4
	if(respData.result_formindex_x != undefined) {
		$("#X_zhi4").show();
		$("#X_zhi4 .spanCenter").html(respData.result_formindex_x);
		$("#X_zhi4 .spanRight").html(respData.result_formindex_x_warn);
	} else {
		$("#X_zhi4").hide();
	}
	//x -5
	if(respData.result_absolutemean_x != undefined) {
		$("#X_zhi5").show();
		$("#X_zhi5 .spanCenter").html(respData.result_absolutemean_x);
		$("#X_zhi5 .spanRight").html(respData.result_absolutemean_x_warn);
	} else {
		$("#X_zhi5").hide();
	}
	//x -6
	if(respData.result_peakindex_x != undefined) {
		$("#X_zhi6").show();
		$("#X_zhi6 .spanCenter").html(respData.result_peakindex_x);
		$("#X_zhi6 .spanRight").html(respData.result_peakindex_x_warn);
	} else {
		$("#X_zhi6").hide();
	}
	//x -7
	if(respData.result_pulseindex_x != undefined) {
		$("#X_zhi7").show();
		$("#X_zhi7 .spanCenter").html(respData.result_pulseindex_x);
		$("#X_zhi7 .spanRight").html(respData.result_pulseindex_x_warn);
	} else {
		$("#X_zhi7").hide();
	}
	//x -8
	if(respData.result_marginindex_x != undefined) {
		$("#X_zhi8").show();
		$("#X_zhi8 .spanCenter").html(respData.result_marginindex_x);
		$("#X_zhi8 .spanRight").html(respData.result_marginindex_x_warn);
	} else {
		$("#X_zhi8").hide();
	}

	//Y----------------------------------------------------------
	//y轴速度有效值
	if(respData.result_speed_y != undefined) {
		$("#Y_zhisudu").show();
		$("#Y_zhisudu .spanCenter").html(respData.result_speed_y + ' ( mm/s )');
		$("#Y_zhisudu .spanRight").html(respData.result_speed_y_warn);
	} else {
		$("#Y_zhisudu").hide();
	}
	//y轴加速度有效值
	if(respData.result_rms2 != undefined) {
		$("#Y_zhijiasudu").show();
		$("#Y_zhijiasudu .spanCenter").html(respData.result_rms2 + ' ( m/s² )');
		$("#Y_zhijiasudu .spanRight").html(respData.result_rms2_warn);
	} else {
		$("#Y_zhijiasudu").hide();
	}
	//Y -1 
	if(respData.result_kurt_y != undefined) {
		$("#Y_zhi1").show();
		$("#Y_zhi1 .spanCenter").html(respData.result_kurt_y);
		$("#Y_zhi1 .spanRight").html(respData.result_kurt_y_warn);
	} else {
		$("#Y_zhi1").hide();
	}

	//Y -2
	if(respData.result_peak2peak_y != undefined) {
		$("#Y_zhi2").show();
		$("#Y_zhi2 .spanCenter").html(respData.result_peak2peak_y + " ( m/s² )");
		$("#Y_zhi2 .spanRight").html(respData.result_peak2peak_y_warn);
	} else {
		$("#Y_zhi2").hide();
	}

	//Y -3
	if(respData.result_peak_y != undefined) {
		$("#Y_zhi3").show();
		$("#Y_zhi3 .spanCenter").html(respData.result_peak_y + " ( m/s² )");
		$("#Y_zhi3 .spanRight").html(respData.result_peak_y_warn);
	} else {
		$("#Y_zhi3").hide();
	}
	//Y -4
	if(respData.result_formindex_y != undefined) {
		$("#Y_zhi4").show();
		$("#Y_zhi4 .spanCenter").html(respData.result_formindex_y);
		$("#Y_zhi4 .spanRight").html(respData.result_formindex_y_warn);
	} else {
		$("#Y_zhi4").hide();
	}
	//Y -5
	if(respData.result_absolutemean_y != undefined) {
		$("#Y_zhi5").show();
		$("#Y_zhi5 .spanCenter").html(respData.result_absolutemean_y);
		$("#Y_zhi5 .spanRight").html(respData.result_absolutemean_y_warn);
	} else {
		$("#Y_zhi5").hide();
	}
	//vY -6
	if(respData.result_peakindex_y != undefined) {
		$("#Y_zhi6").show();
		$("#Y_zhi6 .spanCenter").html(respData.result_peakindex_y);
		$("#Y_zhi6 .spanRight").html(respData.result_peakindex_y_warn);
	} else {
		$("#Y_zhi6").hide();
	}
	//Y -7
	if(respData.result_pulseindex_y != undefined) {
		$("#Y_zhi7").show();
		$("#Y_zhi7 .spanCenter").html(respData.result_pulseindex_y);
		$("#Y_zhi7 .spanRight").html(respData.result_pulseindex_y_warn);
	} else {
		$("#Y_zhi7").hide();
	}
	//Y -8
	if(respData.result_marginindex_y != undefined) {
		$("#Y_zhi8").show();
		$("#Y_zhi8 .spanCenter").html(respData.result_marginindex_y);
		$("#Y_zhi8 .spanRight").html(respData.result_marginindex_y_warn);
	} else {
		$("#Y_zhi8").hide();
	}

	//Z----------------------------------------------------------
	//Z轴速度有效值
	if(respData.result_speed_z != undefined) {
		$("#Z_zhisudu").show();
		$("#Z_zhisudu .spanCenter").html(respData.result_speed_z + ' ( mm/s )');
		$("#Z_zhisudu .spanRight").html(respData.result_speed_z_warn);
	} else {
		$("#Z_zhisudu").hide();
	}
	//Z轴加速度有效值
	if(respData.result_rms3 != undefined) {
		$("#Z_zhijiasudu").show();
		$("#Z_zhijiasudu .spanCenter").html(respData.result_rms3 + ' ( m/s² )');
		$("#Z_zhijiasudu .spanRight").html(respData.result_rms3_warn);
	} else {
		$("#Z_zhijiasudu").hide();
	}
	//Z -1 
	if(respData.result_kurt_z != undefined) {
		$("#Z_zhi1").show();
		$("#Z_zhi1 .spanCenter").html(respData.result_kurt_z);
		$("#Z_zhi1 .spanRight").html(respData.result_kurt_z_warn);
	} else {
		$("#Z_zhi1").hide();
	}

	//Z -2
	if(respData.result_peak2peak_z != undefined) {
		$("#Z_zhi2").show();
		$("#Z_zhi2 .spanCenter").html(respData.result_peak2peak_z + " ( m/s² )");
		$("#Z_zhi2 .spanRight").html(respData.result_peak2peak_z_warn);
	} else {
		$("#Z_zhi2").hide();
	}

	//Z -3
	if(respData.result_peak_z != undefined) {
		$("#Z_zhi3").show();
		$("#Z_zhi3 .spanCenter").html(respData.result_peak_z + " ( m/s² )");
		$("#Z_zhi3 .spanRight").html(respData.result_peak_z_warn);
	} else {
		$("#Z_zhi3").hide();
	}
	//Z -4
	if(respData.result_formindex_z != undefined) {
		$("#Z_zhi4").show();
		$("#Z_zhi4 .spanCenter").html(respData.result_formindex_z);
		$("#Z_zhi4 .spanRight").html(respData.result_formindex_z_warn);
	} else {
		$("#Z_zhi4").hide();
	}
	//Z -5
	if(respData.result_absolutemean_z != undefined) {
		$("#Z_zhi5").show();
		$("#Z_zhi5 .spanCenter").html(respData.result_absolutemean_z);
		$("#Z_zhi5 .spanRight").html(respData.result_absolutemean_z_warn);
	} else {
		$("#Z_zhi5").hide();
	}
	//Z -6
	if(respData.result_peakindex_z != undefined) {
		$("#Z_zhi6").show();
		$("#Z_zhi6 .spanCenter").html(respData.result_peakindex_z);
		$("#Z_zhi6 .spanRight").html(respData.result_peakindex_z_warn);
	} else {
		$("#Z_zhi6").hide();
	}
	//Z -7
	if(respData.result_pulseindex_z != undefined) {
		$("#Z_zhi7").show();
		$("#Z_zhi7 .spanCenter").html(respData.result_pulseindex_z);
		$("#Z_zhi7 .spanRight").html(respData.result_pulseindex_z_warn);
	} else {
		$("#Z_zhi7").hide();
	}
	//Z -8
	if(respData.result_marginindex_z != undefined) {
		$("#Z_zhi8").show();
		$("#Z_zhi8 .spanCenter").html(respData.result_marginindex_z);
		$("#Z_zhi8 .spanRight").html(respData.result_marginindex_z_warn);
	} else {
		$("#Z_zhi8").hide();
	}
}

//选择测点位置
$("#tezheng_place").on('tap', function() {
	var userPicker = new mui.PopPicker();
	userPicker.setData(Tezheng_cedian);
	userPicker.show(function(items) {
		$("#tezheng_place").val(items[0].text);
		var startTime_tezheng = localStorage.getItem("StartTime");
		var endTime_tezheng = localStorage.getItem("EndTime");
		getCaiYangDianData(startTime_tezheng, endTime_tezheng, items[0].text, "choose", "");
	});
})
//选择采样时间
$("#tezheng_timeCount").on('tap', function() {
	var userPicker = new mui.PopPicker();
	userPicker.setData(tezheng_caijiTime);
	userPicker.show(function(items) {
		$("#tezheng_timeCount").val(items[0].text);
		$("#boxing_weizhi").val(items[0].text);
		getDataFromSeverWithParam(items[0].id, "");
	});
})