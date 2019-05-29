mui.plusReady(function() {
	getVersionCode();
	function getVersionCode() {
		var strProject = "机电卫士";
//		var strProject = "嘉轩卫士";
		localStorage.setItem("localVersionCode", 1980);
		var strPhoneOSType;
		if(mui.os.ios) {
			strPhoneOSType = "iOS";
		}
		if(mui.os.android) {
			strPhoneOSType = "Android";
		}
		$.ajax({
			type: "get",
			url: commen_gain_last_version_Interface,
			async: true,
			data: {
				envelope_store_z: strProject,
				mobile_type: strPhoneOSType
			},
			dataType: "json",
			success: function(respData) {
				if(respData.status == "SUCCESS") {
					if(typeof(respData.data) != "undefined") {
						//返回的版本号
						var strCode = respData.data.version_code;
						//本地的版本号
						var localCode = localStorage.getItem("localVersionCode");
						//判断系统类型
						var strOSType = respData.data.mobile_type;
						//1、先判断版本号，查看是否有新版本发布
						//2、判断是否需要强制更新
						//3、先判断系统类型

						if(strCode > localCode) {
							if(respData.data.is_must_upgrade == "0") {
								mui.alert('APP有新版本发布，请更新版本，否则会影响功能使用', '新版本更新提示', '立即更新', function(e) {
									if(mui.os.android) {
										dealWithAndroid(respData.data.version_url);
									}
									if(mui.os.ios) {
										dealWithiOS(strProject);
									}
								});

							}

						}
					}

				} else {
					mui.toast(respData.message);
				}
			}
		});
	}

	function dealWithAndroid(strdownLoadUrl) {

		var strLoadURL = strdownLoadUrl;
		var encodeUrl = encodeURI(strLoadURL); //文件的具体地址，具体到文件名称
		var dtask = plus.downloader.createDownload(encodeUrl,{filename:'_downloads/mz101000/dianji.apk'}); //新建下载任务
		var w = plus.nativeUI.showWaiting("开始下载...");
		dtask.addEventListener("statechanged", function(task, status) {
			switch(task.state) {
				case 3: // 已接收到数据
					if(w) {
						w.setTitle("数据下载中,请稍后...");
					}
					break;
				case 4: // 下载完成
					if(status == 200) {
						if(w) {
							console.log("文件路径 ==== "+task.filename)
							w.close();
						}
						plus.runtime.openFile(task.filename, {}, function(e) {
							QxMobile.Alert("无法打开此文件：" + e.emssage);
						});
					} else {
						Alert("下载失败：" + status);
						plus.nativeUI.closeWaiting();
					}
					break;
			}
		});
		dtask.start();
	}

	function dealWithiOS(strProName) {
		if(strProName == "嘉轩卫士") {
			location.href = 'https://itunes.apple.com/cn/app/%E5%98%89%E8%BD%A9%E5%8D%AB%E5%A3%AB/id1434036782?mt=8';
		}
		if(strProName == "机电卫士") {
			location.href = 'https://itunes.apple.com/cn/app/%E6%9C%BA%E7%94%B5%E5%8D%AB%E5%A3%AB/id1404806698?mt=8';
		}
	}
})