console.log("-=-=-=-=-=-====="+localStorage.getItem("deviceName"))
$("#nameForDevice").html(localStorage.getItem("deviceName"));
$("#nameForUser").html(localStorage.getItem("strUserName"));
$("#phoneForUser").html(localStorage.getItem("strUserPhone"));
$("#timeForCheck").html(getNowFormatDate());

//获取当前时间 YYYY-MM-DD hh:mm:ss
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
}

$("#checkIdea").on('tap', function() {
	var userPicker = new mui.PopPicker();
	var setdataArray = new Array();

	userPicker.setData([{
		text: "正常"
	}, {
		text: "更换(通知采购)"
	}, {
		text: "立即维修"
	}, {
		text: "加入计划维修"
	}, {
		text: "急需维护保养"
	}, {
		text: "继续关注"
	}]);
	var strid = "checkIdeaText";
	var userResult = document.getElementById(strid);
	userPicker.show(function(items) {
		userResult.innerHTML = items[0].text;
	});
})
