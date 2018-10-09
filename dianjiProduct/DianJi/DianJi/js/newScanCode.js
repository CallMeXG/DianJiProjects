
function getScanCode(){
	
}

//function startScancode() {
	console.log("[][][][][][][]")
	$('#search').on('search', function() {

		$.ajax({
			type: "post",
			//						url: "http://47.94.166.103:1111/APP/appGetSim",
			url: appGetSim_Interface,
			async: true,
			data: {
				emeId: $('#search').val(),
				//								emeId: 'SA1023403', //目前能查到数据的一个卡编号
			},
			success: function(res) {

				//														console.log(JSON.stringify(res));

				if(res.data.sim.length == 1) {
					//					当前状态；0：工作，1：失联，2：关机，3：休眠，4：故障 5：已激活 6：未激活 7:待激活
					if(res.data.sim[0].state == 6) { //未激活
						simID = $('#search').val();
						mui.confirm("此卡未激活，是否激活？", "", ["否", "是"], writeConfirmeBack)
					} else { //已经激活
						if(plus.storage.getItem("beforeScanPage") == 1) { //已经激活，从home页跳转过来的。
							//								alert("home页过来的")
							//卡已经激活，找到该卡属于哪个设备res.data.sim[0].devices_no
							localStorage.DeveciId = res.data.sim[0].devices_no;
							scan.close()
							window.location.href = "DeviceDetail.html";
						} else if(plus.storage.getItem("beforeScanPage") == 2) { //已经激活，从点检完成p6.2跳过来
							localStorage.DeveciId = res.data.sim[0].devices_no;
							scan.close()
							window.location.href = "view/check.html";
						}

					} //已经激活条件结束
				} else {
					mui.toast("请输入正确的传感器卡号")
				}

			},
			error: function() {

			}
		}); //ajax结束

	}); //点击搜索框结束

	function writeConfirmeBack(e) {
		//					console.log(e)
		//

		//									alert(e.index) //根据e.index  来判断是点击了是还是否
		if(e.index == 1) {
			//						alert('2');
			//调转到激活页，并把卡的编号传递过去simID
			localStorage.simID = simID;
			enterJihuo();
			//						document.activeElement.blur();
			//						mui.openWindow({
			//							url:'aboutUs.html',
			//							id:'aboutUs.html'
			//						});
			//						alert(simID);
			//						window.open('view/carInfo_activate.html');alert("=====");	

			//												window.location.href = 'view/carInfo_activate.html';

			//						window.location.href = 'newActivation.html';

			//							

		} else {

			//							history.go(0)
		}
	}

	mui.init({
		beforeback: function() {
			//获得列表界面的webview
			scan.close();

			//返回true，继续页面关闭逻辑
			return true;
		}
	})
	var simID;
	var scan = null;
//	startRecognize();

	//条码识别成功事件
	function onmarked(type, result) {

		console.log(type + result)

		var text = '未知: ';
		switch(type) {
			case plus.barcode.QR:
				text = 'QR: ';
				break;
			case plus.barcode.EAN13:
				text = 'EAN13: ';
				break;
			case plus.barcode.EAN8:
				text = 'EAN8: ';
				break;
		}

		//					alert(result) //扫码扫出来的结果
		result = result.split("p/")
		console.log(result);

		function ConfirmCallBack(e) {
			console.log(e)

			//				alert(e.index) //根据e.index  来判断是点击了是还是否
			if(e.index == 1) {
				//调转到激活页，并把卡的编号传递过去simID
				localStorage.simID = simID;
				scan.close();
				enterJihuo();
				//							window.location.href = 'view/carInfo_activate.html';

			} else {
				scan.close();
				history.go(0)
			}
		}

		if(result[0] == "http://www.aiimoto.com/") {
			//						alert("本地校验通过，去进行扫码")
			$.ajax({
				type: "post",
				//							url: "http://47.94.166.103:1111/APP/appGetSim",
				url: appGetSim_Interface,
				async: true,
				data: {
					emeId: result[1],
					//								emeId: 'SA1023403', //目前能查到数据的一个卡编号
				},
				success: function(res) {
					console.log(JSON.stringify(res))
					if(res.data.sim.length == 1) {
						//					当前状态；0：工作，1：失联，2：关机，3：休眠，4：故障 5：已激活 6：未激活
						if(res.data.sim[0].state == 6) { //未激活
							simID = result[1];
							mui.confirm("此卡未激活，是否激活？", "", ["否", "是"], ConfirmCallBack)
						} else { //已经激活
							if(plus.storage.getItem("beforeScanPage") == 1) { //已经激活，从home页跳转过来的。
								//										alert("home页过来的")
								//卡已经激活，找到该卡属于哪个设备res.data.sim[0].devices_no
								localStorage.DeveciId = res.data.sim[0].devices_no;
								scan.close()
								window.location.href = "DeviceDetail.html";
							} else if(plus.storage.getItem("beforeScanPage") == 2) { //已经激活，从点检完成p6.2跳过来
								localStorage.DeveciId = res.data.sim[0].devices_no;
								scan.close()
								window.location.href = "view/check.html";
							}
						} //已经激活条件结束
					} else {
						mui.toast("请输入正确的传感器卡号")
						scan.start();

					}
				},
				error: function() {

				}
			}); //ajax结束
		} else {
			alert("不符合本地校验规则");
			mui.toast("请扫描正确的二维码")
			scan.start();

		}
		console.log(result[1]) //卡的编号
	} //onmarked  结束

	function startRecognize() {
		console.log("[[[[[[[")
		scan = new plus.barcode.Barcode('Recognize', [0]);
		scan.start();
		scan.onmarked = onmarked;
		console.log("======]]]]]]")
	}

	//进入激活页面
	function enterJihuo() {
		$.ajax({
			type: "get",
			url: commen_confirm_active_Interface,
			async: true,
			data: {
				serial_no: localStorage.simID
			},
			dataType: 'json',
			success: function(resqMsg) {
				if(resqMsg.status == "SUCCESS") {
					scan.close();
					window.location.href = 'newActivation.html';
				} else {

				}
			},
			error: function() {

			}
		});
	}

	$("#search").focus(function() {
		scan.close()
		//					console.count("fdf")

	})
	$("#search").blur(function() {
		history.go(0)

	})
//}