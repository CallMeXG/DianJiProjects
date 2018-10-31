//、、--------- 测试GitHub master

//立鹏服务器地址
//var url = 'http://192.168.1.126:1111/';
//本地测试服务器地址
var url = 'http://192.168.3.228:8080/server_appapi/';
//测试服务器地址
// var url = 'http://39.106.180.14:1111/';
//生产服务器地址
//var url = 'http://47.94.166.103:1111/';


//var fileUrlHeader = "http://47.94.166.103:3000/group1/";
             
//登录接口
var login_Interface= url + 'user/commen_login';

//获取验证码接口
var getCode_Interface= url + 'Login/commen_get_Verify_Code';//过期
//注册接口
var register_Interface= url + 'APP/commen_register';//过期

//修改密码、忘记密码接口
var resetpwd_Interface= url + 'APP/appForget';//过期

//搜索接口
var commen_search_device_Interface= url + 'device/commen_search_device_new';


//设备详情
var commen_gain_device_detail_Interface= url + 'device/special_gain_device_detail';
//appAdvise接口
var appAdvise_Interface= url + 'app/commen_user_Advise';

//图片上传
var appPhotoUpload_Interface= url + 'Photo/Commen_uploadPhotos';



//appGetSim接口
var appGetSim_Interface= url + 'Sensor/commen_appGetSim';

//commen_update_sim接口
var commen_update_sim_Interface= url + 'Sensor/commen_update_sim';
//appUpdateDevices接口
var appUpdateDevices_Interface= url + 'APP/appUpdateDevices';//未使用

//绑定接口
var commen_appAddSim_Interface= url + 'Sensor/commen_appAddSim';

//commen_add_device接口
var commen_add_device_Interface= url + 'device/commen_add_device';

//commen_gain_sim接口c
var commen_gain_sim_Interface= url + 'Sensor/commen_gain_sim';
//commen_cancel_relation接口
var commen_cancel_relation_Interface= url + 'Sensor/commen_cancel_relation';
//commen_update_device接口
var commen_update_device_Interface= url + 'device/commen_update_device';
//commen_gain_detect_data接口
var commen_gain_detect_data_Interface= url + 'APP/commen_gain_detect_data';//未使用
//appReadAgreement接口
var appReadAgreement_Interface= url + 'APP/appReadAgreement';//未使用


//commen_gain_model_list接口
var commen_gain_model_list_Interface= url + 'model/commen_gain_model_list';

//确认取消激活模式
var commen_confirm_unactive_Interface= url + 'active/commen_confirm_unactive';
//确认进入激活状态
var commen_confirm_active_Interface= url + 'active/commen_confirm_active';
//激活等待页接口
var commen_active_wait_Interface= url + 'active/commen_active_wait';

//最新点检接口
var commen_check_device_Interface = url + 'check/commen_check_device';

//获取采样模式列表
var commen_gain_sampling_model_list_Interface = url +'model/commen_gain_sampling_model_list';

//获取最新版本号，判断是否需要更新APP
var commen_gain_last_version_Interface = url + 'app/commen_gain_last_version';
//获取公司、厂区map
var commen_gain_company_map_Interface = url + 'company/commen_gain_company_map';
//获取设备监测数据【首页】
var new_commen_gain_detect_data_Interface = url + 'draw/commen_gain_detect_data';
//搜索设备历史数据列表【根据设备编号、开始时间、结束时间】
var new_commen_search_detect_data_Interface = url + 'draw/commen_search_detect_data';

//获取设备监测数据【根据probe ID】
var new_commen_gain_single_data_Interface = url + 'draw/commen_gain_single_data';
//绘图中,趋势图
var new_commen_gain_trend_chart_Interface = url + 'draw/commen_gain_trend_chart';
//绘图中,趋势图，多个测点
var new_commen_gain_trend_chart_fix_Interface = url + 'draw/commen_gain_trend_chart_fix';

//用户注册【新版本】
var new_commen_register_Interface = url + 'user/commen_register';
//验证手机号是否注册过
var new_verification_phone_number_Interface = url + 'user/verification_phone_number';
//获取验证码
var new_commen_gain_verification_code_Interface = url + 'user/commen_gain_verification_code';
//修改密码new
var new_commen_modify_password_Interface = url + 'legal_user/commen_modify_password';

//点检 2018-8-27
var new_commen_spot_check_device_Interface = url + 'check/commen_spot_check_device';
//最新一条点检信息
var new_commen_gain_check_device_Interface = url + 'check/commen_gain_check_device';
//申请人工诊断
var new_commen_apply_check_device_Interface = url + 'check/commen_apply_check_device';
//手机用户手机信息
var new_commen_user_collect_Interface = url + 'user/commen_user_collect';
//远程诊断历史列表
var new_commen_gain_manual_list_Interface = url + 'check/commen_gain_manual_list';
//点检历史列表
var new_commen_gain_check_device_list_Interface = url + 'check/commen_gain_check_device_list';
//点检详情
var new_commen_gain_check_device_detail_Interface = url + 'check/commen_gain_check_device_detail';
//设备运行状态统计
var new_commen_statis_device_Interface = url +'device/commen_statis_device';





