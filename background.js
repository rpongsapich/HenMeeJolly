var SITEBASEURL = 'http://henmee.dll.in.th/';
// UPDATE STICKER LIST ONCE EVERY RESTART BROWSER
function refreshStickerList() {
	if(localStorage['ENABLEDSTICKERS']==undefined) { localStorage['ENABLEDSTICKERS'] = '[]'; }
	var xhr = new XMLHttpRequest();
	xhr.open("GET", SITEBASEURL+'s/list.php', true);
	//console.log('b', arguments);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4) {
			//console.log(xhr.responseText);
			var allList = JSON.parse(xhr.responseText);
			localStorage['ALLSTICKERS'] = JSON.stringify(allList);
		}
	};
	xhr.send();
}

refreshStickerList();

chrome.management.onInstalled.addListener(function(info){
	refreshStickerList();
});

chrome.runtime.onMessage.addListener(
  function(request, sender, callback) {
	//console.log('a', arguments);
    switch(request.action) {
		case "refreshStickers":
			//refreshStickerList(callback);
		break;
		case "queryEnabledStickers":
			var enList = JSON.parse(localStorage['ENABLEDSTICKERS']);
			enList = enList.map(function(i) { return [i, JSON.parse(localStorage[i])[0]]; });
			callback(enList);
		break;
		case "queryStickers":
			callback(JSON.parse(localStorage[request.name]));
		break;
	}
});
