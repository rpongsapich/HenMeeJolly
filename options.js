var SITEBASEURL = 'http://henmee.dll.in.th/';
function hURL() {
	var results = [SITEBASEURL+'s'];
	for(var i=0; i<arguments.length; i++) {
		results.push(arguments[i].toString());
	}
	//console.log(results.join('/'));
	return results.join('/');
};

function extractStickerName(U) {
	return U.split('/').pop();
};

function reloadStickerList() {
	$.ajax(hURL('list.php'), {
		dataType: 'json',
		statusCode: {
			404: function() { alert('ไม่สามารถติดต่อกับ server ได้ในขณะนี้'); }
		},
		success: function(data, status, jqxhr) {
			localStorage['ALLSTICKERS'] = JSON.stringify(data);
			listStickers();
		}
	});
}

reloadStickerList();

function listStickers() {
	var allStickers = JSON.parse(localStorage['ALLSTICKERS']);
	$('div.block').remove();
	for(i in allStickers) {
		if(localStorage[i] == undefined || typeof(JSON.parse(localStorage[i]))!='object') {
			$.get(hURL('list.php',i), function(L) { 
				var s = extractStickerName(this.url);
				localStorage[s] = JSON.stringify(L); 
				appendStickerBlock(s, L);
			});
		} else {
			var L = JSON.parse(localStorage[i]);
			appendStickerBlock(i, L);
		}
	}
};

function appendStickerBlock(name, list) {
	var N = '#'+name;
	//console.log(list);
	$('body').append('<div class="block" id="'+name+'"><div>'+name+'</div><p>Count: '+list.length+'</p></div>');
	$(N).css('background-image', 'url('+hURL(name, 'preview.png')+')');
	var enList = JSON.parse(localStorage['ENABLEDSTICKERS'] || '[]');
	if(enList.indexOf(name)>-1) { $(N).addClass('enable'); }
};

$(document).on('click', 'div.block', function(){
	$(this).toggleClass('enable');
	var enList = JSON.parse(localStorage['ENABLEDSTICKERS'] || '[]');
	if($(this).hasClass('enable')) {
		if(enList.indexOf(this.id) < 0) {
			enList.push(this.id);
		}
	} else {
		if(enList.indexOf(this.id) > -1) {
			enList.splice(enList.indexOf(this.id), 1);
		}
	}
	localStorage['ENABLEDSTICKERS'] = JSON.stringify(enList);
});

$("#btnRefresh").on('click', function() { reloadStickerList(); });
$('#btnSelectAll').on('click', function() { 
	var allList = JSON.parse(localStorage['ALLSTICKERS']);
	var enList = [];
	for(i in allList) { enList.push(i); }
	localStorage['ENABLEDSTICKERS'] = JSON.stringify(enList);
	delete allList; delete enList;
	$('div.block:not(.enable)').addClass('enable'); 
});
$('#btnSelectNone').on('click', function() { localStorage['ENABLEDSTICKERS'] = '[]'; $('div.block').removeClass('enable'); });
