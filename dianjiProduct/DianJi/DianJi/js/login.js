//function tip() {
//点击登录事件



$("#login_btn").click(function() {
	
	// $.ajax({
	// 	type: "get",
	// 	url: commen_search_device_Interface + '?strLoginId=10000018&strLoginToken=ff9ab5a22ac1ed152372f948f2b36ca4',
	// 	// url: 'http://47.94.166.103:1111/device/commen_search_device_new?strLoginId=10000018&strLoginToken=ff9ab5a22ac1ed152372f948f2b36ca4'
	// 	async: true,
	// 	// data: params,
	// 	dataType: 'json',
	// 	success: function(respData) {
	
	// 		console.log("====== success");
	
	// 	},
	// 	error: function(error) {
	// 		console.log('error' + JSON.stringify(error))
	
	// 	}
	// });
	
	///*
	
	var phone = $("#login_phone").val();
	var pwd = $("#login_pwd").val();
	var phoneTest = /^1[34578]\d{9}$/;
	if(phone == "") {
		mui.toast("手机号不能为空");
	} else if(pwd == "") {
		mui.toast("密码不能为空");
	} 
// 	else if(!(phoneTest.test(phone))) {
// 		mui.toast("手机号码格式不正确");
// 	} 
	else {

		console.log(login_Interface);

		$.ajax({
			type: "get",
			url: login_Interface,
			async: true,
			data: {
				phone: phone,
				password: pwd,
				// company_id: ''
			},
			dataType: 'json',
			success: function(respData) {

				console.log("======" + JSON.stringify(respData));

				if(respData.status == "SUCCESS") {

					var dataTemp = respData.data;

					localStorage.setItem("userName", phone);
					localStorage.setItem("userPwd", pwd);
					localStorage.setItem("isLogin", "true");
					localStorage.setItem('is_manage',dataTemp.is_manage);
					localStorage.setItem("strLoginId", dataTemp.strLoginId);
					localStorage.setItem("strLoginToken", dataTemp.strLoginToken);
					localStorage.setItem("strUserName", dataTemp.username);
					localStorage.setItem("strUserPhone", dataTemp.phone);
					localStorage.setItem("sms_notice",dataTemp.sms_notice);
					if(dataTemp.c_id == undefined) {
						localStorage.setItem("company_id", "");
						localStorage.setItem('c_id',"");
					} else {
						localStorage.setItem("company_id", dataTemp.c_id);
						localStorage.setItem('c_id',dataTemp.c_id);
					}
					
					var regionidArray = new Array();
					var regionArray = new Array();
					if(dataTemp.company_list !== undefined){
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
					}
					

					console.log("-=-=-=-=" + JSON.stringify(regionArray));
					var strRegionId = regionidArray.toString();
					localStorage.setItem("region_id_list", strRegionId);
					localStorage.setItem("reginArray", JSON.stringify(regionArray));

					mui.toast(respData.message);
					mui.openWindow({
						url: 'headerindex.html',
						id: 'headerindex.html'
					})
	
					//保存用户类型
					localStorage.setItem("userType", respData.data.types);

				} else {
					mui.toast("账号或密码有误，请重新输入");
				}
			}
		});
	}
	//*/
})
//新用户注册点击事件
$("#newUser").on("tap", function() {
	mui.openWindow("register.html");
})
//忘记密码
$("#forgetPwd").on("tap", function() {
	localStorage.setItem("resetType", "unknowpwd");
	mui.openWindow("view/resetPwd.html");
})

//}
mui.plusReady(function() {
	
	
	if(localStorage.getItem("userName") != undefined) {
		plus.nativeUI.showWaiting('正在登录...');
		$("#login_phone").val(localStorage.getItem("userName"));
		$("#login_pwd").val(localStorage.getItem("userPwd"));
		setTimeout(function(){
			autoLogin();
		},1000)
		
	}

	function autoLogin() {

		$.ajax({
			url: login_Interface,
			async: true,
			data: {
				phone: localStorage.getItem("userName"),
				password: localStorage.getItem("userPwd")
			},
			dataType: 'json',
			success: function(respData) {
				plus.nativeUI.closeWaiting();
				if(respData.status == "SUCCESS") {

					var dataTemp = respData.data;

					localStorage.setItem("userName", localStorage.getItem("userName"));
					localStorage.setItem("userPwd", localStorage.getItem("userPwd"));
					localStorage.setItem("isLogin", "true");
                    localStorage.setItem('is_manage',dataTemp.is_manage);
					localStorage.setItem("strLoginId", dataTemp.strLoginId);
					localStorage.setItem("strLoginToken", dataTemp.strLoginToken);
					localStorage.setItem("strUserName", dataTemp.username);
					localStorage.setItem("strUserPhone", dataTemp.phone);
					localStorage.setItem("sms_notice",dataTemp.sms_notice);
					if(dataTemp.c_id == undefined) {
						localStorage.setItem("company_id", "");
						localStorage.setItem('c_id',"");
					} else {
						localStorage.setItem("company_id", dataTemp.c_id);
						localStorage.setItem('c_id',dataTemp.c_id);
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

					console.log("-=-=-=-=" + JSON.stringify(regionArray));
					var strRegionId = regionidArray.toString();
					localStorage.setItem("region_id_list", strRegionId);
					localStorage.setItem("reginArray", JSON.stringify(regionArray));

					mui.toast('登录成功');
					mui.openWindow({
						url: 'headerindex.html',
						id: 'headerindex.html'
					})

					//保存用户类型
					localStorage.setItem("userType", respData.data.types);
				} else {
					plus.nativeUI.closeWaiting();
					mui.toast("账号或密码有误，请重新输入");
				}
			},
			error: function(error) {
				plus.nativeUI.closeWaiting();
				mui.toast("登录失败，请检查网络连接");
			}

		});

	} //自动登录结束

});