var companyArray = new Array();
var reginArray = new Array();
var companyID = null;
var regionID = null;

mui.plusReady(function() {
	plus.nativeUI.showWaiting('正在获取厂区...');
	//先获取厂区数据
	getInitCompany();
	function getInitCompany() {
		$.ajax({
			type: "get",
			url: commen_gain_company_map_Interface,
			async: true,
			dataType: "json",
			success: function(respData) {
				plus.nativeUI.closeWaiting();
				console.log(JSON.stringify(respData))
				var dataArray = respData.data;
				for(var i = 0; i < dataArray.length; i++) {
					var subRegionArray = dataArray[i].region_list;
					var company_region = new Array();
					for(var j = 0; j < subRegionArray.length; j++) {
						var obj_subRegion = {
							value: subRegionArray[j].id,
							text: subRegionArray[j].region_name
						}
						company_region.push(obj_subRegion);
					}

					var obj_company = {
						value: dataArray[i].id,
						text: dataArray[i].company_name,
						children: company_region
					};
					companyArray.push(obj_company);
				}
			},
			error:function(error){
				plus.nativeUI.closeWaiting();
				mui.alert('获取企业名称失败，请重新进入本页面！');
			}
		});
	}

})

//选择企业名称
$("#id_companyName").click(function() {
	if(companyArray.length > 0) {
		var userPicker = new mui.PopPicker();
		var setdataArray = new Array();
		console.log(JSON.stringify(companyArray));
		userPicker.setData(companyArray);
		userPicker.show(function(items) {
			document.getElementById('selCompanyName').innerHTML = items[0].text;
			companyID = items[0].value;
			regionID = null;
			reginArray = items[0].children;
		});
	} else {
		mui.alert('获取企业名称失败，请重新进入本页面！');
	}

})
//选择分厂
$("#id_changName").click(function() {

	var strCompany = $('#selCompanyName').html();
	if(strCompany == '点此选择') {
		mui.alert('请先选择企业名称！')
	} else {
		var userPicker = new mui.PopPicker();
		userPicker.setData(reginArray);
		userPicker.show(function(items) {
			document.getElementById('selCompanyNameSub').innerHTML = items[0].text;
			regionID = items[0].value;
		});
	}

})

//电机基座刚度
$("#deviceTypeSel").click(function() {
	var userPicker = new mui.PopPicker();
	userPicker.setData([{
		text: "电机"
	}, {
		text: "泵"
	}, {
		text: "齿轮箱"
	}, {
		text: "振动筛"
	}]);
	var userResult = document.getElementById('deviceTypeText');
	userPicker.show(function(items) {
		userResult.innerHTML = items[0].text;
		console.log('==='+items[0].text)
		if (items[0].text =='电机') {
			$('#cardDianJi').show();
			$('#cardBeng').hide();
			$('#cardChiLunXiang').hide();
			$('#cardZhenDongShai').hide();
		}
		if (items[0].text =='泵') {
			$('#cardDianJi').hide();
			$('#cardBeng').show();
			$('#cardChiLunXiang').hide();
			$('#cardZhenDongShai').hide();
		}
		if (items[0].text =='齿轮箱') {
			$('#cardDianJi').hide();
			$('#cardBeng').hide();
			$('#cardChiLunXiang').show();
			$('#cardZhenDongShai').hide();
		}
		if (items[0].text =='振动筛') {
			$('#cardDianJi').hide();
			$('#cardBeng').hide();
			$('#cardChiLunXiang').hide();
			$('#cardZhenDongShai').show();
		}
		
	});
})