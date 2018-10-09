//自动登录
mui.plusReady(function() {

	function ConfirmCallBack(e) {
		if(e.index == 1) {
			console.log("====== logout")
			plus.storage.removeItem("isLogin");
			plus.storage.removeItem("userName");
			plus.storage.removeItem("userPwd");
			window.location.replace('login.html');
		}
	}

	$("#logoutButton").on('tap', function() {
		mui.confirm("退出登录？", "", ["否", "是"], ConfirmCallBack)
	})

	$("#username").html(plus.storage.getItem("userName"))
	$("#version").html(plus.runtime.version);

	//		console.log(plus.storage.getItem("userName"))
	if(plus.storage.getItem("userName") != undefined) {
		autoLogin();
	} else {
//		mui.openWindow({
//			url: 'login.html'
//		})
		window.location.replace("login.html");
	}

	function autoLogin() {
		$.ajax({
			url: login_Interface,
			async: true,
			data: {
				phone: plus.storage.getItem("userName"),
				password: plus.storage.getItem("userPwd")
			},
			dataType: 'json',
			success: function(respData) {

				console.log(JSON.stringify(respData))
				if(respData.status == "SUCCESS") {
					var dataTemp = respData.data;
					localStorage.setItem("strLoginId", dataTemp.strLoginId);
					localStorage.setItem("strLoginToken", dataTemp.strLoginToken);
					localStorage.setItem("strUserName", dataTemp.username);
					localStorage.setItem("strUserPhone", dataTemp.phone);

					if(dataTemp.c_id == undefined) {
						localStorage.setItem("company_id", "");
					} else {
						localStorage.setItem("company_id", dataTemp.c_id);
					}

					var regionidArray = new Array();
					var regionArray = new Array();
					for(var i = 0; i < dataTemp.company_list.length; i++) {
						var temparray = dataTemp.company_list[i];
						for(var j = 0; j < temparray.region_list.length; j++) {
							var strRegionid = temparray.region_list[j].id;
							regionidArray.push(strRegionid);
							var strName = temparray.region_list[j].region_name;
							var obj_region = {
								reginID: strRegionid,
								reginName: strName
							};
							regionArray.push(obj_region);
						}
					}
					console.log("----------------------" + JSON.stringify(regionArray));
					var strRegionId = regionidArray.toString();
					localStorage.setItem("region_id_list", strRegionId);
					localStorage.setItem("reginArray", JSON.stringify(regionArray));

					//登录成功，
					showHome(0, 1);
					//设置用户账户权限类型
					localStorage.setItem("userType", respData.data.types);
					hiddenUIWithUserType();
				} else {
					window.location.replace("login.html");
//					mui.openWindow('login.html')
				}
			}
		});

	} //自动登录结束

})