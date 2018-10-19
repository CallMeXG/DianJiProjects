//function tip() {
//点击登录事件



$("#login_btn").click(function() {
	var phone = $("#login_phone").val();
	var pwd = $("#login_pwd").val();
	var phoneTest = /^1[34578]\d{9}$/;
	if(phone == "") {
		mui.toast("手机号不能为空");
	} else if(pwd == "") {
		mui.toast("密码不能为空");
	} else if(!(phoneTest.test(phone))) {
		mui.toast("手机号码格式不正确");
	} else {

		console.log(login_Interface);

		$.ajax({
			type: "get",
			url: login_Interface,
			async: true,
			data: {
				phone: phone,
				password: pwd
			},
			dataType: 'json',
			success: function(respData) {

				console.log("======" + JSON.stringify(respData));

				if(respData.status == "SUCCESS") {

					var dataTemp = respData.data;

					localStorage.setItem("userName", phone);
					localStorage.setItem("userPwd", pwd);
					localStorage.setItem("isLogin", "true");

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

					console.log("-=-=-=-=" + JSON.stringify(regionArray));
					var strRegionId = regionidArray.toString();
					localStorage.setItem("region_id_list", strRegionId);
					localStorage.setItem("reginArray", JSON.stringify(regionArray));

					mui.toast(respData.message);
					mui.openWindow({
						url: 'headerindex.html',
						id: 'headerindex.html'
					})
					//					mui.openWindow('mainIndex.html')

					//					mui.preload({
					//						url:'mainIndex.html'});
					//					window.location.replace('firstIndex.html');
					//					window.location.replace('newIndex.html');
					//					showHome(0, 1);
					//					window.location.replace('headerindex.html');
					//					window.location.replace('newIndex.html');
					//保存用户类型
					localStorage.setItem("userType", respData.data.types);
					//					mui.preload({url:'newMainMy.html'});
					//					window.parent.frames[1].location.reload();
					//					console.log("refucesfdsafs ==== "+ window.parent.frames[1])

					//					mui.back();
					//mui.back()

				} else {
					mui.toast("账号或密码有误，请重新输入");
				}
			}
		});
	}
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
	//关闭等待框
	plus.nativeUI.closeWaiting();
	//显示当前页面
	mui.currentWebview.show();
});