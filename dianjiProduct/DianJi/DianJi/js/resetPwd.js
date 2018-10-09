
function resetPwd() {

	mui.plusReady(function() {
		$("#phone2").val(localStorage.getItem("userName"));
		//提交数据点击事件
		$("#submit_btn").on('tap', function() {
			var tel = $("#phone2").val();
			var code = $("#code2").val();

			var pwd1 = $("#new_pwd").val();
			var pwd2 = $("#reset_pwd").val();

			var telTest = /^1[34578]\d{9}$/;
			var testPwd = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;

			if(code == "") {
				mui.toast("验证码不能为空")
			} else if(pwd1 == "") {
				mui.toast("密码不能为空")
			} else if(pwd2 == "") {
				mui.toast("请再次确认密码")
			} else if(pwd1 != pwd2) {
				mui.toast("两次密码输入不一致")
			} else if(!(testPwd.test(pwd1))) {
				mui.toast("密码由6-16位字母加数字组成")
			} else {
				saveAndPostNewPassward(tel, code, pwd1);
			}

		})

		function saveAndPostNewPassward(phone, codes, newPwd) {
			$.ajax({
				type: "get",
				url: new_commen_modify_password_Interface,
				async: true,
				data: {
//					strLoginId: localStorage.getItem("strLoginId"),
//					strLoginToken: localStorage.getItem("strLoginToken"),
//					id: localStorage.getItem("strLoginId"),
					phone: phone,
					password: newPwd,
					code: codes
				},
				dataType: 'json',
				success: function(postNewPwdResp) {
					console.log("-=-=-"+JSON.stringify(postNewPwdResp))
					if(postNewPwdResp.status == "SUCCESS") {
						mui.toast("密码修改成功，请重新登录")
						window.location.replace("../login.html");
					} else {
						mui.alert("修改密码失败，请重试...");
					}
				},
				error: function() {
					mui.alert("修改密码失败，请重试...");
				}
			});
		}

	})
	$("#getCode2").on('tap', function() {
		var that = this;
		var timer;
		var tel = $("#phone2").val();
		var telTest = /^1[34578]\d{9}$/;
		if(($(this).html() == "获取验证码") || ($(this).html() == "重新获取")) {
			getCodeFromSever(tel);
		} else {
			$(this).off("click");
		}

	})
	//获取验证码
	function getCodeFromSever(numPhone) {
		$.ajax({
			type: "get",
			url: new_commen_gain_verification_code_Interface,
			async: true,
			data: {
				phone: numPhone
			},
			dataType: 'json',
			success: function(restResp) {
				if(restResp.status == "SUCCESS") {
					mui.toast("验证码发送成功，请注意查收");
					var str = '<b id="number">60</b><b>s后重新获取</b>';
					$("#getCode2").html("");
					$("#getCode2").append(str);
					var num = $("#number").html();
					$("#getCode2").find("b").css("color", "#808080");
					var timer;
					clearInterval(timer);
					timer = setInterval(function() {
						num--;
						if(num == 0) {
							clearInterval(timer);
							$("#getCode2").html("");
							$("#getCode2").html("重新获取");
						}
						$("#number").html(num);
					}, 1000)
				} else {
					mui.alert(restResp.mssage);
				}
			},
			error: function() {
				mui.alert("获取验证码失败，请重试...");
			}
		});
	}
}

/*	
	//获取验证码
	$("#getCode2").on("click",function(){
	
		var that=this;
		var timer;
		var tel=$("#phone2").val();
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
	                        $("#getCode2").html("");
	                        $("#getCode2").html("重新获取");
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

						}
					})
	            }
				else{
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
	//提交数据点击事件
	$("#submit_btn").click(function() {
		var tel = $("#phone2").val();
		var code = $("#code2").val();
		var pwd1 = $("#new_pwd").val();
		var pwd2 = $("#reset_pwd").val();
		var telTest = /^1[34578]\d{9}$/;
		var testPwd = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;

		if(tel == "") {
			mui.toast("手机号不能为空")
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
		} else if(!(testPwd.test(pwd1))) {
			mui.toast("密码由6-16位字母加数字组成")
		} else {
			$.ajax({
				//				url:"http://47.94.166.103:1111/APP/appForget",
				url: resetpwd_Interface,
				async: true,
				data: {
					phone: tel,
					verifyCode: code,
					password: pwd1
				},
				success: function(data) {
					mui.toast(data.code)
					if(data.code == true) {
						mui.toast(data.info);
						plus.storage.removeItem("isLogin");
						window.location.replace('../login.html')
					} else if(data.code == false) {
						mui.toast("修改失败，请重试");
					}
				}
			});
		}

	})
}
//*/
$(function() {
	var restTypes = localStorage.getItem("resetType");
	if (restTypes == "unknowpwd") {
		$('#phone2').attr("disabled",false);
	} else if(restTypes == "restpwd"){
		$('#phone2').attr("disabled",true);
	}
	resetPwd();
})