
getVersionCode();

function getVersionCode() {
	localStorage.setItem("localVersionCode", 113);

	$.ajax({
		type: "get",
		url: commen_gain_last_version_Interface,
		async: true,
		dataType: "json",
		success: function(respData) {
			if(respData.status == "SUCCESS") {
				var strCode = respData.data.version_code;
				var strLoadURL = respData.data.version_url;
				var localCode = localStorage.getItem("localVersionCode");
				if(strCode > localCode) {
					var btnArray = ['立即更新', '下次再说'];
					mui.alert('有新版本发布，当前版本是测试版本，必须要升级才能继续使用', '版本更新提示', "立即更新", function(e) {
						var encodeUrl = encodeURI(strLoadURL); //文件的具体地址，具体到文件名称
						var dtask = plus.downloader.createDownload(encodeUrl); //新建下载任务
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
					})
				}

			} else {
				mui.toast(respData.message);
			}
		}
	});
}
