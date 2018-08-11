static function OnBeforeResponse(oSession: Session) {
	if (m_Hide304s && oSession.responseCode == 304) {
		oSession["ui-hide"] = "true";
	}
	
	if (oSession.fullUrl.Contains("ac.php")) {
		if(oSession.GetRequestBodyAsString().Contains("battlesetup") || oSession.GetRequestBodyAsString().Contains("battleresume")){			
			var responseStr: String = oSession.GetResponseBodyAsString();
			responseStr = responseStr.Replace("%3D", "=");
			var jsonStr: String = System.Text.Encoding.ASCII.GetString(System.Convert.FromBase64String(responseStr));
			var json = Fiddler.WebFormats.JSON.JsonDecode(jsonStr);
		
			// 删除sign
			delete json.JSONObject['sign'];
			
			// 获取 己方英灵数+礼装数+敌方数量
			var Num=getArrayLength(json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt']);

			// 获取 己方英灵数量
			var friendNum=getArrayLength(json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['myDeck']['svts']);

			// 获取战斗回合数
			var battleNum=getArrayLength(json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['enemyDeck']);
			var i=0;
			var enemyNum=0;

			// 计算敌方数量
			while(i<battleNum){
				enemyNum=enemyNum+getArrayLength(json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['enemyDeck'][i]['svts']);
				++i;
			}
			
			// 修改敌方数据
			i=Num-enemyNum;
			while(i<Num){
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['hp']='1000';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['atk']='1';
				++i;
			}
		
			// 修改己方数据
			i=0;
			while(i<friendNum){
				//json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['hp']='200000';
				//json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['atk']='50000';
				//json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['treasureDeviceLv']='5';
				//json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['skillLv1']='10';
				//json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['skillLv2']='10';
				//json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['skillLv3']='10';
				// skillId=89550为高速神言(Lv.10 时 +150% NP)
				//json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['skillId1']=89550;
				//json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['skillId2']=89550;
				//json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][i]['skillId3']=89550;
				++i;
			}

			// 助战改为盖提亚
			if(true){
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['svtId']='9935510';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['lv']='100';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['hp']=1500000;
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['atk']=50000;
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['skillId1']=960510;
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['skillId2']=960511;
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['skillId3']=0;
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['skillLv1']='1';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['skillLv2']='1';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['skillLv3']='1';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['treasureDeviceId']=9935511;
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['treasureDeviceLv']='1';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['individuality'][0]='5000';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['individuality'][1]='113';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['individuality'][2]='204';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['individuality'][3]='2113';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['limitCount']='0';
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['dispLimitCount']=0;
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['commandCardLimitCount']=0;
				json.JSONObject['cache']['replaced']['battle'][0]['battleInfo']['userSvt'][0]['iconLimitCount']=0;
			}

			var newJsonStr = Fiddler.WebFormats.JSON.JsonEncode(json.JSONObject);
			var newResponseBody = System.Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes(newJsonStr));
			newResponseBody = newResponseBody.Replace("=", "%3D");
			oSession.utilSetResponseBody(newResponseBody);

		}
	}
	
}
	
// 获取数组长度的方法
static function getArrayLength(array){
	var arrayLength=0;
	
	for(var i in array){
		++arrayLength;
	}
	
	return arrayLength;
}