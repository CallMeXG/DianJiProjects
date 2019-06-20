$('#minePageClicked').on('tap', function() {
	$('#mineHeader').css('display', 'block');
	$('#head').css('display', 'none');
})
$('#defaultTab').on('tap', function() {
	$('#mineHeader').css('display', 'none');
	$('#head').css('display', 'block');
})
$("#addDeviceNew").on("tap", function() {
//	mui.openWindow({
//		url: "AddDevice.html"
//	})
	window.location.replace('AddDevice.html');
})
$("#feedback").on("tap", function() {
	mui.openWindow({
		url: "FeedBack.html"
	})
})
$("#aboutUs").on("tap", function() {
	mui.openWindow({
		url: "aboutUs.html"
	})
})

$("#reset_pwd").on("tap", function() {
	localStorage.setItem("resetType", "restpwd");
	mui.openWindow({
		url: "view/resetPwd.html"
	})
})

function ConfirmCallBack(e) {
	if(e.index == 1) {
		localStorage.removeItem("isLogin");
		localStorage.removeItem("userName");
		localStorage.removeItem("userPwd");
		window.location.replace('login.html');
	}
}

$("#logoutButton").on('tap', function() {
	mui.confirm("退出登录？", "", ["否", "是"], ConfirmCallBack)
})

$("#username").html(localStorage.getItem("userName"))

var searchList = new Array();

var strKeyWord = "";
var strKeyType = 2;
var reginSelList;
//分页，起始搜索index
var startRecodes = 0;
//分页，每页条数
var eachPage = 10;
//分页，总页数
var fenyeTotalCount = 10;

var searchePageCount = 0;

if(localStorage.getItem("userName") != undefined) {
	autoLogin();
} else {
	window.location.replace("login.html");
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

			console.log(JSON.stringify(respData))
			if(respData.status == "SUCCESS") {
				var dataTemp = respData.data;
				localStorage.setItem("strLoginId", dataTemp.strLoginId);
				localStorage.setItem("strLoginToken", dataTemp.strLoginToken);
				localStorage.setItem("strUserName", dataTemp.username);
				localStorage.setItem("strUserPhone", dataTemp.phone);
				localStorage.setItem('is_manage',dataTemp.is_manage);
				localStorage.setItem("sms_notice",dataTemp.sms_notice);

				//				if(dataTemp.c_id == undefined) {
				//					localStorage.setItem("company_id", "");
				//				} else {
				//					localStorage.setItem("company_id", dataTemp.c_id);
				//				}
				//2018-8-15
				var companyArray_id = new Array();
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
						//2018-8-15
						companyArray_id.push(temparray.region_list[j].company_id);
					}
				}
				//2018-8-15
				localStorage.setItem("company_id", companyArray_id.toString());
				console.log("----------------------" + JSON.stringify(companyArray_id.toString()));
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

var strregion_wang = localStorage.getItem("region_id_list");
if(strregion_wang != null) {
	reginSelList = strregion_wang.split(",");

}

$("#regionButton").on("tap", function() {
	reginSelList.splice(0, reginSelList.length);
	var regionList = JSON.parse(localStorage.getItem("reginArray"));

	for(var i = 0; i < regionList.length; i++) {
		var objID = "#selectid_" + i;
		if($(objID).is(":checked") == true) {
			reginSelList.push(regionList[i].reginID);
		}
	}
	mui("#tanchucaidan").popover('hide');
	searchDevice(strKeyWord, 0, strKeyType, reginSelList.toString(), 1);
	console.log("reginlist === " + strregion_wang)
	//	if (reginSelList.length > 0 ) {
	//		searchDevice(strKeyWord, 0, strKeyType, reginSelList.toString(), 1);
	//	} else{
	//		searchDevice(strKeyWord, 0, strKeyType, strregion_wang, 1);
	//	}

})

//筛选点击事件
//$(".se").change(function() {
//	strKeyType = $('.se').val();
//	searchDevice(strKeyWord, 0, strKeyType, reginSelList.toString(), 1);
//})
document.getElementById('headerSelected').addEventListener('tap', function() {
	var btnArray = [{
		title: "设备编号",
		values: '2'
	}, {
		title: "设备名称",
		values: '1'
	}, {
		title: "工作状态",
		values: '3'
	}, {
		title: "故障类型",
		values: '4'
	}];
	plus.nativeUI.actionSheet({
		title: "",
		cancel: "取消",
		buttons: btnArray
	}, function(e) {
		var index = e.index;
		if(index > 0) {

			strKeyType = btnArray[index - 1].values;

			$("#headerSelected").html(btnArray[index - 1].title + " ▼")

			console.log("-=-=-=-=-=-=-=-=" + btnArray[index - 1].values)
			searchDevice(strKeyWord, 0, strKeyType, reginSelList.toString(), 1);

		}
	});

})

//首页列表点击事件
//$("#content").on("tap", "ul li", function(e) {
//	localStorage.DeveciId = e.currentTarget.id;
//	var indexRow = $(this).index();
//	console.log("===============" + indexRow)
//	var strname = searchList[indexRow].devices_name;
//	localStorage.setItem("deviceName", strname);
////	mui.openWindow({
////		url: 'newDataChart.html'
////	})
//})

//左上角扫描点击事件
$("#scanCodeClicked").on('tap', function() {
	mui.openWindow({
		//		url: 'demo.html'
		url: 'ScanCode.html'
		//		url: 'newScanCode.html'
	})
})

//右上角筛选厂区列表
function createPopverList() {

	var regionList = JSON.parse(localStorage.getItem("reginArray"));
	var strInsert = "";
	$('#tanchuForm li').remove();
	for(var i = 0; i < regionList.length; i++) {
		var reingObj = regionList[i];
		strInsert += '<li class="mui-table-view-cell mui-checkbox mui-left"><input id="selectid_' + i + '" name="checkbox" type="checkbox"  value="' + reingObj.reginID + '">' + reingObj.reginName + '</li>';
	}
	$("#tanchuForm").append(strInsert);
}
//当没有搜索到数据时的页面显示内容
function UIForNullData(nullType) {
	if(nullType == "net") {
		mui.alert("搜索失败，请检查网络");
	} else if(nullType == "nullData") {
		mui.toast("没有符合搜索条件的数据");
	}
	$("#content ul li").remove();

	var strings = '<li style="width:100%;height:600px;text-align:center;padding-top:200px;color:darkgray;background-color:white;">## 没有符合搜索条件的数据... ##</li>';
	$("#content ul").append(strings);
}
//首页，设备列表获取接口
function showHome(startnum, thisIndex) {
	//	var w = plus.nativeUI.showWaiting("处理中，请等待...\n5", {
	//		loading: {
	//			icon: "../img/waiting.png"
	//		}
	//	});
	searchList.splice(0, searchList.length);
	createPopverList();
	$.ajax({
		type: "get",
		url: commen_search_device_Interface,
		async: true,
		data: {
			strLoginId: localStorage.getItem("strLoginId"),
			strLoginToken: localStorage.getItem("strLoginToken"),
			int_sort_type: 2,
			company_id: localStorage.getItem("company_id"),
			region_id_list: localStorage.getItem("region_id_list"),
			startRecords: startnum,
			pageSize: 10
		},
		dataType: 'json',
		success: function(res) {
			//			w.close();
			if(res.status == "SUCCESS") {

				appendLi(res.data);
				searchList = res.data.search_list;

				var pagecount = res.data.total_records / 10;
				searchePageCount = Math.ceil(pagecount);
				setFenyefunction(Math.ceil(pagecount), "init", thisIndex);
			} else {
				UIForNullData("nullData");
				setFenyefunction(0, "init", thisIndex);
			}
		},
		error: function(error) {
			UIForNullData("net");
			setFenyefunction(0, "init", thisIndex);
		}
	})

}; //页面初始化10条数据结束
//搜索点击事件
$('#search').on('search', function() {
	$('#search').blur();
	strKeyWord = $('#search').val();
	searchDevice(strKeyWord, 0, strKeyType, reginSelList.toString(), 1);
});

//搜索设备接口
function searchDevice(keyWord, pageNum, keyType, strPostRegion, thisIndex) {
	console.log("------searche")
	searchList.splice(0, searchList.length);
	$.ajax({
		type: "get",
		url: commen_search_device_Interface,
		async: true,
		data: {
			strLoginId: localStorage.getItem("strLoginId"),
			strLoginToken: localStorage.getItem("strLoginToken"),
			devices_name: keyWord,
			int_sort_type: keyType,
			company_id: localStorage.getItem("company_id"),
			region_id_list: strPostRegion,
			startRecords: pageNum,
			pageSize: 10
		},
		dataType: 'json',
		success: function(res) {
			if(res.status == "SUCCESS") {
				if(res.data.search_list.length > 0) {
					appendLi(res.data);
					searchList = res.data.search_list;
					var pagecount = res.data.total_records / 10;
					setFenyefunction(Math.ceil(pagecount), "search", thisIndex);
				} else {
					setFenyefunction(0, "search", thisIndex);
					UIForNullData("nullData");
				}
			} else {
				UIForNullData("nullData");
				setFenyefunction(0, "search", thisIndex);
			}
		},
		error: function(error) {
			UIForNullData("net");
			setFenyefunction(0, "init", thisIndex);
		}
	});
}

//设备列表数据更新
function appendLi(res) {
	$("#content ul li").remove()
	length = res.search_list.length;
	for(var i = 0; i < length; i++) {
		var tempList = res.search_list[i];

		var str = '<li class="mui-table-view-cell mui-media"><div class="mui-slider-right mui-disabled"><a id="personID" class="mui-btn mui-btn-grey mui-icon mui-icon-person"></a><a id="phoneID" class="mui-btn mui-btn-yellow mui-icon mui-icon-phone"></a><a id="deleteID" class="mui-btn mui-btn-red mui-icon mui-icon-email"></a></div><div class="mui-slider-handle"><div class="mui-table-cell">';

		///*
		//var str = '<li class="mui-table-view-cell mui-media"';

		if(typeof(tempList.min_photo_url) == "undefined" || tempList.min_photo_url.length == 0) {
			str += '<a ><img class="mui-media-object mui-pull-left" src="img/default.png"></a>';
		} else {
			str += '<a ><img class="mui-media-object mui-pull-left" src=' + tempList.min_photo_url + '></a>';
		}
		str += '<div class="mui-media-body">';
		str += "<p class='mui-ellipsis'>";
		if(tempList.devices_no != undefined) {
			if(typeof(tempList.serial_no) != "undefined") {
				str += '<span class="items">' + tempList.devices_name + ' : ' + tempList.devices_no + '</span>' + '<a class="mui-icon iconfont icon-dunpai-s" style="color:green;"></a>';
			} else {
				str += '<span class="items" >' + tempList.devices_name + " : " + tempList.devices_no + '</span>';
			}

		}
		//		if(tempList.devices_no == undefined) {
		//			str += '<span class="items">' + '设备编号：' + '----' + '</span>';
		//		}
		if(tempList.work_status != undefined) {
			if(tempList.work_status == 0) {
				str += '<span class="items">' + "工作状态：正常" + '</span>';
			} else if(tempList.work_status == 1) {
				str += '<span class="items">' + "工作状态：待维护" + '</span>';

			} else { //2 待维修
				str += '<span class="items">' + "工作状态：待维护" + '</span>';

			}

		}
		str += '<span class="items">' + "疑似故障：无" + '</span>';
		if(tempList.work_status == undefined) {
			str += '<span class="items">' + "工作状态：----" + '</span>';
		}
		if(tempList.ck_result == 0) {
			str += '<span class="items">' + '点检结果：' + '<span style="font-weight:bold;color:blue">' + "正常" + '</span></span>';
		}
		if(tempList.ck_result == 1) {
			str += '<span class="items">' + '点检结果：' + '<span style="font-weight:bold;color:red">' + "故障" + '</span></span>';
		}

		//		if(tempList.devices_age != undefined) {
		//			str += '<span style="width:60%;float:left" >' + '预期寿命：' + '<span style="height:5px;background-color:red" id="demo' + i + '"' + 'class="mui-progressbar pro"  ><span></span></span>' + '</span>';
		//		}
		//		if(tempList.devices_age == undefined) {
		//			str += '<span class="items">' + '预期寿命：' + '----' + '</span>';
		//		}
		str += '</div></div></li>';
		//*/
		var oli = $(str);
		//		if(tempList.devices_age != undefined) { //有设备年龄那个字段
		//			var num = tempList.devices_age;
		//			num = num - 100;
		//			oli.find("#demo" + i).find("span").css("transform", "translate(" + num + "%)")
		//		} else { //没有设备年龄字段，直接按默认100 全满显示
		//			oli.find("#demo" + i).find("span").css("transform", "translate(0)")
		//		}

		oli.attr("id", tempList.devices_no)

		$("#content ul").append(oli);

//		var ids = document.getElementById('content');
//		var liList = ids.getElementsByTagName('li');
//
//		for(var j = 0; j < liList.length; j++) {
//			liList[j].index = j;
//
//			liList[j].onclick = function() {
//				console.log("[][][][][]===" + this.index);
//			}
//		}

	}

}

$("#personID").on('tap', function() {
	console.log("222")
	var elem = this;
	var li = elem.parentNode.parentNode;
	mui.swipeoutClose(li);
	
})

function setFenyefunction(totalCount, type, thisIndex) {

	searchePageCount = totalCount;

	$('#pagination_9').whjPaging({
		css: 'css-user',
		totalPage: totalCount,
		isShowTotalSize: false,
		isShowTotalPage: true,
		isShowRefresh: false,
		isShowSkip: false,
		isShowPageSizeOpt: false,
		isShowFL: false,
		callBack: function(currPage, pageSize) {
			console.log('currPage:' + currPage + '     pageSize:' + pageSize);
			var indexPage = currPage;
			if(type == "init") {
				if(indexPage == 1) {
					showHome(0, indexPage);
				} else {
					var startIndex = (indexPage - 1) * 10;
					showHome(startIndex, indexPage);
				}
			} else if(type == "search") {
				if(indexPage == 1) {
					searchDevice(strKeyWord, 0, strKeyType, reginSelList.toString(), indexPage);
				} else {
					var startIndex = (indexPage - 1) * 10;
					searchDevice(strKeyWord, startIndex, strKeyType, reginSelList.toString(), indexPage);
				}
			}
		}
	});

	$("#pagination_9").whjPaging("setPage", {
		currPage: thisIndex,
		totalPage: totalCount,
		totalSize: 90
	});
}

//获取用户类型，根据权限隐藏某些显示内容
function hiddenUIWithUserType() {
	var strUserType = localStorage.getItem("userType");
	//		console.log(strUserType);
	if(strUserType < 10) {
		$("#newAddDevice").hide();
		if(localStorage.getItem('is_manage') == '1'){
			$("#newAddDevice").show();
		}
	}
	if(strUserType > 10) {
		$("#newAddDevice").show();
	}
}