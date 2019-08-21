

mui.plusReady(function() {
	getVersionCode();
	function getVersionCode() {
		
		
		//先见 Android
		var strAPPType = "AndroidPrefoco";
		//先见 iOS
		// var strAPPType = "iOSPrefoco";
		//嘉轩Android
		// var strAPPType = "AndroidJiaXuan";
		//嘉轩iOS
		// var strAPPType = "iOSJiaXuan";
		//Android 中材高新
		// var strAPPType = "AndroidZhongCai";
		//Android 无logo版本
		var strAPPType = "AndroidNOLogo";
		
		var strVersionCodeLocal = strLocalVersionCode;
		
		$.ajax({
			type: "get",
			url: commen_gain_last_version_Interface,
			async: true,
			data: {
				version_type: strAPPType
			},
			dataType: "json",
			success: function(respData) {
				if(respData.status == "SUCCESS") {
					if(typeof(respData.data) != "undefined") {
						//返回的版本号
						var strCode = respData.data.version_code;
						if(strCode > strVersionCodeLocal) {
							mui.alert('APP有新版本发布，请去“我的--软件更新”中进行下载更新', '新版本更新提示', '我知道了', function(e) {});
						}
					}

				} else {
					mui.toast(respData.message);
				}
			}
		});
	}


})