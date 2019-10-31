$(function() {
	///*
	mui.plusReady(function() {

		document.addEventListener('activeBack', function() {
			console.log('8888888888888888888888888888=== ')
		});

		///*
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
		});

		$("#nullDataPage").hide();

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
		//厂区筛选ID
		var newReginListID = [];

		var content = new Vue({
			el: '#content',
			data: {
				message: []
			},
			methods: {
				openDeviceCharts(items) {
					e = window.event || e;
					if (e.stopPropagation) {
						e.stopPropagation(); //阻止事件 冒泡传播
					} else {
						e.cancelBubble = true; //ie兼容
					}
					localStorage.setItem('DeveciId', items.devices_no);
					localStorage.setItem('DeveciName', items.devices_name);
					mui.openWindow({
						url: 'newDataChart.html',
						id: 'newDataChart.html'
					});
				},
				open_detail(items) {
					e = window.event || e;
					if (e.stopPropagation) {
						e.stopPropagation(); //阻止事件 冒泡传播
					} else {
						e.cancelBubble = true; //ie兼容
					}
					localStorage.setItem('DeveciId', items.devices_no);
					localStorage.enterPage = "Enter";
					mui.openWindow({
						url: 'DeviceDetail.html',
						id: 'DeviceDetail.html'
					})
					//获取父节点的父节点 li
					var elem = event.target.parentNode.parentNode;
					//隐藏右滑显示
					mui.swipeoutClose(elem);
				},
				sliderBtnClicked: function(event, selType, CellItems) {

					if (selType == "CK") {
						localStorage.DeveciId = CellItems.devices_no;
						localStorage.DeveciName = CellItems.devices_name;
						localStorage.DeveciModel = CellItems.devices_model;
						console.log("==" + localStorage.getItem('userName'))
						mui.openWindow({
							url: 'checkHistory.html',
							id: 'checkHistoryID'
						})
					}
					if (selType == "ZD") {
						localStorage.DeveciId = CellItems.devices_no;
						localStorage.DeveciName = CellItems.devices_name;
						mui.openWindow('artificialcheckList.html');
					}
					//获取父节点的父节点 li
					var elem = event.target.parentNode.parentNode;
					//隐藏右滑显示
					mui.swipeoutClose(elem);

				}
			}
		});

		if (localStorage.getItem("userName") != undefined) {
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

					if (respData.status == "SUCCESS") {
						var dataTemp = respData.data;

						localStorage.setItem("strLoginToken", dataTemp.strLoginToken);
						localStorage.setItem("strUserName", dataTemp.username);
						localStorage.setItem("strUserPhone", dataTemp.phone);
						localStorage.setItem('is_manage', dataTemp.is_manage);
						localStorage.setItem("sms_notice", dataTemp.sms_notice);
						var tanchuForm = new Vue({
							el: '#tanchuForm',
							data: {
								tanMessage: dataTemp.company_list
							},
							methods: {
								inputChange: function(strid, mseItem) {

									var ids = "#" + strid;
									var value = $(ids).is(':checked');
									if (value == true) {
										newReginListID.push(mseItem.id);
									}
									if (value == false) {
										var indexPa = newReginListID.indexOf(mseItem.id);
										newReginListID.splice(indexPa, 1);
									}

								}
							}
						})

						//2018-8-15
						var companyArray_id = new Array();
						var regionidArray = new Array();
						var regionArray = new Array();
						for (var i = 0; i < dataTemp.company_list.length; i++) {
							var temparray = dataTemp.company_list[i];
							for (var j = 0; j < temparray.region_list.length; j++) {
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
						var strRegionId = regionidArray.toString();
						localStorage.setItem("region_id_list", strRegionId);
						localStorage.setItem("reginArray", JSON.stringify(regionArray));

						var strLoginIDS = localStorage.getItem('strLoginId');
						if (strLoginIDS == null || strLoginIDS != dataTemp.strLoginId) {
							localStorage.removeItem('strRegion');
						}
						localStorage.setItem("strLoginId", dataTemp.strLoginId);

						//登录成功，
						//				showHome(0, 1);
						//根据保存的筛选厂区，进行显示 、、、筛选数据，请求接口
						var strRegion_new = localStorage.getItem('strRegion');
						if (typeof(strRegion_new) != "undefined" && strRegion_new != null) {
							if (strRegion_new.length > 0) {
								var RegionArray_new = strRegion_new.split(',');
								for (var i = 0; i < RegionArray_new.length; i++) {
									var strIDS = RegionArray_new[i];
									document.getElementById(strIDS).checked = true;
									newReginListID.push(parseInt(strIDS));
									console.log('111111111')
									searchDevice(strKeyWord, 0, 2, newReginListID.toString(), 1);

								}
							} else {
								searchDevice(strKeyWord, 0, 2, strRegionId, 1);
							}
						} else {
							searchDevice(strKeyWord, 0, 2, strRegionId, 1);
						}

						//设置用户账户权限类型
						localStorage.setItem("userType", respData.data.types);
						hiddenUIWithUserType();
					} else {
						window.location.replace("login.html");
					}
				},
				error: function(error) {
					mui.toast("登录失败，请检查网络连接");
				}

			});

		} //自动登录结束

		var strregion_wang = localStorage.getItem("region_id_list");
		if (strregion_wang != null) {
			reginSelList = strregion_wang.split(",");
		}
		//厂区筛选事件
		$("#regionButton").on("tap", function() {
			//保存选择的厂区
			var strRegionID = newReginListID.toString();
			localStorage.setItem('strRegion', strRegionID);
			//隐藏弹出框
			mui("#tanchucaidan").popover('hide');
			//搜索，
			searchDevice(strKeyWord, 0, strKeyType, strRegionID, 1);

		})
		//根据设备编号等 筛选
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
				}
				//			, {
				//				title: "故障类型",
				//				values: '4'
				//			}
			];
			plus.nativeUI.actionSheet({
				title: "按照以下规则进行排序",
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var index = e.index;
				if (index > 0) {
					strKeyType = btnArray[index - 1].values;
					$("#headerSelected").html(btnArray[index - 1].title + " ▼");
					var strRegionID = newReginListID.toString();
					searchDevice(strKeyWord, 0, strKeyType, strRegionID, 1);
				}
			});

		})

		//左上角扫描点击事件
		$("#scanCodeClicked").on('tap', function() {
			console.log("扫码扫码扫码扫码扫码扫码扫码扫码扫码扫码")
			localStorage.removeItem('DeveciId');
			localStorage.setItem('fatherID', 'deviceList');
			mui.openWindow({
				url: 'barcodeScan.html',
				id: 'barcodeScan.html'
				//				url: 'ScanCode.html'
			})
			//			var webViewScan = plus.webview.create('devicelisttoscancode.html', 'devicelisttoscancode.html');
			//			webViewScan.show();
			// 			mui.openWindow({
			// 				url: 'devicelisttoscancode.html',
			// 				id: 'devicelisttoscancode.html'
			// 				//				url: 'ScanCode.html'
			// 			})
		})

		//当没有搜索到数据时的页面显示内容
		function UIForNullData(nullType) {
			if (nullType == "net") {
				mui.alert("搜索失败，请检查网络");
			} else if (nullType == "nullData") {
				mui.toast("没有符合搜索条件的数据");
			}
			$("#nullDataPage").show();
			$("#content").hide();

		}

		//搜索点击事件
		$('#search').on('search', function() {
			$('#search').blur();
			strKeyWord = $('#search').val();
			var strRegionID = newReginListID.toString();
			searchDevice(strKeyWord, 0, strKeyType, strRegionID, 1);
		});

		//搜索设备接口
		function searchDevice(keyWord, pageNum, keyType, strPostRegion, thisIndex, strDeviceStatus) {
			var wa = plus.nativeUI.showWaiting('数据加载中...');
			console.log('start tese interface==' + commen_search_device_Interface)
			
			// $.ajax({
			// 	url: login_Interface,
			// 	async: true,
			// 	data: {
			// 		phone: localStorage.getItem("userName"),
			// 		password: localStorage.getItem("userPwd")
			// 	},
			// 	dataType: 'json',
			// 	success: function(respData) {
			// 		console.log('测试登录成功====')
			// 	},
			// 	error: function(error) {
			// 		mui.toast("测试登录====登录失败，请检查网络连接");
			// 	}
			
			// });
			
			///*

			$.ajax({
				type: 'get',
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
					pageSize: 10,
					device_status: strDeviceStatus
				},
				dataType: 'json',
				success: function(res) {
					console.log('IOS  测试，成功')
					alert('IOS  测试，成功')
				},
				error: function(error) {
					console.log('IOS  测试，失败')
					alert('IOS  测试，失败')
				}
			})


//*/


			/*
			$.ajax({
				type: "GET",
				url: commen_search_device_Interface,
				async: false,
				data: {
					strLoginId: localStorage.getItem("strLoginId"),
					strLoginToken: localStorage.getItem("strLoginToken"),
					// devices_name: keyWord,
					int_sort_type: keyType,
					company_id: localStorage.getItem("company_id"),
					// region_id_list: strPostRegion,
					startRecords: pageNum,
					pageSize: 10,
					// device_status: strDeviceStatus
				},
				dataType: 'json',
				success: function(res) {
					wa.close();
					if (res.status == "SUCCESS") {
						if (res.data.search_list.length > 0) {
							content.message = res.data.search_list;
							$('#content').css('display', 'block');
							$("#nullDataPage").hide();
							$("#content").show();
							var pagecount = res.data.total_records / 10;
							setFenyefunction(Math.ceil(pagecount), thisIndex);
						} else {
							setFenyefunction(0, thisIndex);
							UIForNullData("nullData");
							$("#content").hide();
						}
					}
					if (res.status == 'ILLEGAL') {
						UIForNullData("nullData");
						$("#content").hide();
						setFenyefunction(0, thisIndex);
						mui.alert('您的账户登录过期，请退出重新登录！')
					}

				},
				error: function(error) {
					console.log("===1111")
					wa.close();
					// UIForNullData("net");
					$("#content").hide();
					setFenyefunction(0, thisIndex);
				}
			});
//*/
		}



		function setFenyefunction(totalCount, thisIndex) {

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
					var strRegionID = newReginListID.toString();
					if (indexPage == 1) {
						searchDevice(strKeyWord, 0, strKeyType, strRegionID, indexPage);
					} else {

						var startIndex = (indexPage - 1) * 10;
						searchDevice(strKeyWord, startIndex, strKeyType, strRegionID, indexPage);
					}
				}
			});

			$("#pagination_9").whjPaging("setPage", {
				currPage: thisIndex,
				totalPage: totalCount,
				totalSize: 90
			});
		};

		document.addEventListener('enterPage_deviceList_refresh', function() {

			newReginListID.push(parseInt(localStorage.getItem('tongji_regionId')));
			localStorage.removeItem('strRegion');
			newReginListID.splice(0, newReginListID.length - 1);
			var arrRegion = JSON.parse(localStorage.getItem("reginArray"));
			for (var i = 0; i < arrRegion.length; i++) {
				var strregion = arrRegion[i].reginID;
				document.getElementById(strregion).checked = false;
			}
			localStorage.setItem('strRegion', localStorage.getItem('tongji_regionId'));
			document.getElementById(localStorage.getItem('tongji_regionId')).checked = true;


			// searchDevice('', 0, 2, localStorage.getItem('tongji_regionId'), 0, localStorage.getItem('tongji_type'));

			var wa = plus.nativeUI.showWaiting('数据加载中...');

			$.ajax({
				type: "get",
				url: commen_search_device_Interface,
				async: true,
				data: {
					strLoginId: localStorage.getItem("strLoginId"),
					strLoginToken: localStorage.getItem("strLoginToken"),
					devices_name: "",
					int_sort_type: 2,
					company_id: localStorage.getItem("company_id"),
					region_id_list: localStorage.getItem('tongji_regionId'),
					startRecords: 0,
					pageSize: 1000,
					device_status: localStorage.getItem('tongji_type')
				},
				dataType: 'json',
				success: function(res) {
					wa.close();
					if (res.status == "SUCCESS") {
						if (res.data.search_list.length > 0) {
							content.message = res.data.search_list;
							$('#content').css('display', 'block');
							$("#nullDataPage").hide();
							$("#content").show();
							var pagecount = res.data.total_records / 1000;
							setFenyefunction(Math.ceil(pagecount), 0);
						} else {
							setFenyefunction(0, 0);
							UIForNullData("nullData");
							$("#content").hide();
						}
					}
					if (res.status == 'ILLEGAL') {
						UIForNullData("nullData");
						$("#content").hide();
						setFenyefunction(0, 0);
						mui.alert('您的账户登录过期，请退出重新登录！')
					}
				},
				error: function(error) {
					console.log("===1111")
					wa.close();
					UIForNullData("net");
					$("#content").hide();
					setFenyefunction(0, 0);
				}
			});


			//			var strRegion_new = localStorage.getItem('tongji_regionId');
			//			if(typeof(strRegion_new) != "undefined" && strRegion_new != null) {
			//				if(strRegion_new.length > 0) {
			//					var RegionArray_new = strRegion_new.split(',');
			//					for(var i = 0; i < RegionArray_new.length; i++) {
			//						var strIDS = RegionArray_new[i];
			//						console.log('00000000=='+strIDS)
			//						document.getElementById(strIDS).checked = true;
			//						newReginListID.push(parseInt(strIDS));
			//					}
			//				}
			//			}

		});

		//获取用户类型，根据权限隐藏某些显示内容
		function hiddenUIWithUserType() {
			var strUserType = localStorage.getItem("userType");
			//		console.log(strUserType);
			if (strUserType < 10) {
				$("#newAddDevice").hide();
				if (localStorage.getItem('is_manage') == '1') {
					$("#newAddDevice").show();
				}
			}
			if (strUserType > 10) {
				$("#newAddDevice").show();
			}
		}

		//设备型号 iPhone 8 、iPhone X，等
		var strModel = plus.device.model;
		//系统类型 Android 、 iOS
		var strOSName = plus.os.name;
		//系统版本 iOS 11.4.1、Android 6.0 等
		var strOSVersion = plus.os.version;

		if (localStorage.getItem("userName") != undefined) {
			$.ajax({
				type: "get",
				url: new_commen_user_collect_Interface,
				async: true,
				data: {
					user_id: localStorage.getItem("strLoginId"),
					phone: localStorage.getItem("userName"),
					mobile_model: strModel,
					system_model: strOSName,
					system_version: strOSVersion
				},
				dataType: 'json',
				success: function(respData) {},
				error: function(error) {

				}

			});
		}
		//*/
	})

});
