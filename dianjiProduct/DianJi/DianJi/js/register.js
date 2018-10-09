function register() {

	$("#getCode").on('tap', function() {
		var that = this;

		var tel = $("#tel").val();
		var telTest = /^1[34578]\d{9}$/;
		if(tel != "") {
			if(telTest.test(tel)) {
				if(($(this).html() == "获取验证码") || ($(this).html() == "重新获取")) {

					PhoneNumberCanBeUsed(tel);
				} else {
					$(this).off("click");
				}
			} else {
				mui.toast("手机号格式不正确！")
			}
		} else {
			mui.toast("请先输入手机号！")
		}
	})

	function PhoneNumberCanBeUsed(phoneNumber) {
		$.ajax({
			type: "get",
			url: new_verification_phone_number_Interface,
			async: true,
			data: {
				phone: phoneNumber
			},
			dataType: 'json',
			success: function(respData) {
				if(respData.status == "SUCCESS") {
					getCodeWithNewInterface(phoneNumber);
				} else {
					mui.alert(respData.message);
				}
			},
			error: function(error) {
				mui.alert("手机号验证失败，请重试...");
			}
		});
	}

	function getCodeWithNewInterface(phoneNumbers) {
		$.ajax({
			type: "get",
			url: new_commen_gain_verification_code_Interface,
			async: true,
			data: {
				phone: phoneNumbers
			},
			dataType: 'json',
			success: function(respData) {
				if(respData.status == "SUCCESS") {
					mui.toast("验证码发送成功，请注意查收")
					var timer;
					var str = '<b id="number">60</b><b>s后重新获取</b>';
					$("#getCode").html("");
					$("#getCode").append(str);
					var num = $("#number").html();
					$("#getCode").find("b").css("color", "#808080");

					clearInterval(timer);
					timer = setInterval(function() {
						num--;
						if(num == 0) {
							clearInterval(timer);
							$("#getCode").html("");
							$("#getCode").html("重新获取");
						}
						$("#number").html(num);
					}, 1000)
				} else {
					mui.alert(respData.message);
				}
			},
			error: function(error) {
				mui.alert("获取验证码失败，请重试...");
			}
		});
	}

	$("#register_btn").on('tap', function() {
		var agreement = $('#agreement');
		var username = $("#username").val();
		var tel = $("#tel").val();
		var bussnicename = $("#bussniceName").val();
		var code = $("#code").val();
		var pwd1 = $("#pwd1").val();
		var pwd2 = $("#pwd2").val();
		var telTest = /^1[34578]\d{9}$/;
		if(username == "") {
			mui.toast("用户名不能为空")
		} else if(tel == "") {
			mui.toast("手机号不能为空")
		} else if(bussnicename == "") {
			mui.toast("企业名称不能为空")
		} else if(code == "") {
			mui.toast("验证码不能为空")
		} else if(pwd1 == "") {
			mui.toast("密码不能为空")
		} else if(pwd2 == "") {
			mui.toast("请再次确认密码")
		} else if(pwd1 != pwd2) {
			mui.toast("两次密码输入不一致")
		} else if(!(telTest.test(tel))) {
			mui.toast("手机号格式不正确")
		} else if(!$('#agreement').is(':checked')) {
			mui.toast("请选择条款协议")
		} else {
			var paramData = {
				username:username,
				password:pwd1,
				phone:tel,
				code:code
			}
			newRegister(paramData);
		}
	})

	function newRegister(paramData) {
		$.ajax({
			type: "get",
			url: new_commen_register_Interface,
			async: true,
			data: paramData,
			dataType:'json',
			success: function(respData) {
				if (respData.status == "SUCCESS") {
					mui.toast("用户注册成功！")
					window.location.replace('login.html');
				} else{
					mui.alert(respData.message);
				}
			},
			error:function(error)
			{
				mui.alert("注册失败，请重试...")
			}
		});
	}

	/*
	//获取验证码
	$("#getCode").on("click",function(){
		var that=this;
		var timer;
		var tel=$("#tel").val();
		var telTest=/^1[34578]\d{9}$/;
		if(tel != "" ){
			if(telTest.test(tel)){
				if(($(this).html()=="获取验证码") || ($(this).html()=="重新获取")){
				 	
	                var str='<b id="number">30</b><b>s后重新获取</b>';
	                $(this).html("");
	                $(this).append(str);
	                var num=$("#number").html();
	                 $(this).find("b").css("color","#808080");
	                clearInterval(timer);
	                timer=setInterval(function(){
	                    num--;
	                    if(num==0){
	                        clearInterval(timer);
	                        $(that).html("");
	                        $(that).html("重新获取");
	                    }
	                    $("#number").html(num);
	                },1000)
	                //获取数据
	                $.ajax({
//						url:"http://47.94.166.103:1111/APP/appGetVerifyCode",
						url:getCode_Interface,
						data:{
							userName:tel,
							type:1
						},
						success:function(data){
							console.log(JSON.stringify(data));
						}
					})
	            }else{
	            	$(this).off("click");
	            }
			}else{
				mui.toast("手机号格式不正确！")
			}
		}else{
			mui.toast("请先输入手机号！")
		}
	})
	//*/
	/*
	//注册按钮点击事件
	$("#register_btn").click(function() {
		var agreement = $('#agreement');
		var username = $("#username").val();
		var tel = $("#tel").val();
		var bussnicename = $("#bussniceName").val();
		var code = $("#code").val();
		var pwd1 = $("#pwd1").val();
		var pwd2 = $("#pwd2").val();
		var telTest = /^1[34578]\d{9}$/;
		if(username == "") {
			mui.toast("用户名不能为空")
		} else if(tel == "") {
			mui.toast("手机号不能为空")
		} else if(bussnicename == "") {
			mui.toast("企业名称不能为空")
		} else if(code == "") {
			mui.toast("验证码不能为空")
		} else if(pwd1 == "") {
			mui.toast("密码不能为空")
		} else if(pwd2 == "") {
			mui.toast("请再次确认密码")
		} else if(pwd1 != pwd2) {
			mui.toast("两次密码输入不一致")
		} else if(!(telTest.test(tel))) {
			mui.toast("手机号格式不正确")
		} else if(!$('#agreement').is(':checked')) {
			mui.toast("请选择条款协议")
		} else {
			//			data:{
			//					userName:tel,
			//					userPwd:pwd1,
			//					verifyCode:code,
			//					appType:1,
			//					uuid:"uuid",
			//					name:username,
			//					company:bussnicename
			//				},
			$.ajax({
				url: register_Interface,
				async: true,
				data: {
					username: username,
					password: pwd1,
					phone: tel,
					company: bussnicename,
				},
				success: function(data) {

					if(data.code == true) {
						mui.toast("注册成功")
						setTimeout(function() {
							window.location.href = 'login.html';
						}, 1000);

					} else if(data.code == false) {
						mui.toast(data.data)
					}
				}
			});
		}
	})
	//*/
	//跳转相关条款点击事件
	$("#toTiaokuan").on("tap", function() {
		mui.openWindow("view/tiaokuan.html");
	})

}
$(function() {
	register();
})