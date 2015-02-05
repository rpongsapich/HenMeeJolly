var SITEBASEURL = 'http://henmee.dll.in.th/';
var hmjID = null;
$(document).on('click', 'textarea', function(){
	if($(this).parent().hasClass('hmj-container')) { return true; }
	hmjID = 'hmj'+parseInt(Math.random()*1000000).toString();
	hmjTarget = 'hmjt'+parseInt(Math.random()*1000000).toString();
	$(this).addClass(hmjTarget).wrap('<div class="hmj-container" id="'+hmjID+'"></div>');
	var wid = $(this).width();
	$('#'+hmjID).width(wid).append('<div class="hmj-stickers-container"><ul class="hmj-tab" data-parent="'+hmjID+'"></ul><div class="hmj-lower-container"><div class="hmj-preview"></div><ul class="hmj-stickers" data-target="'+hmjTarget+'" data-parent="'+hmjID+'"></ul></div></div>');
	$('#'+hmjID+' .hmj-stickers-container').width(wid);
	createTab(hmjID);
	this.focus();
});

$.fn.extend({
	insertAtCaret: function(myValue){
		var obj;
		if( typeof this[0].name !='undefined' ) obj = this[0];
		else obj = this;
		var startPos = obj.selectionStart;
		var endPos = obj.selectionEnd;
		var scrollTop = obj.scrollTop;
		obj.value = obj.value.substring(0, startPos)+myValue+obj.value.substring(endPos,obj.value.length);
		obj.focus();
		obj.selectionStart = startPos + myValue.length;
		obj.selectionEnd = startPos + myValue.length;
		obj.scrollTop = scrollTop;
	}
});

function hURL() {
	var results = [SITEBASEURL+'s'];
	for(var i=0; i<arguments.length; i++) {
		results.push(arguments[i].toString());
	}
	return results.join('/');
};


function createTab(ID) {
	ID = '#'+ID;
	chrome.runtime.sendMessage({'action':'queryEnabledStickers'}, function(list) {
		//console.log(list);
		$(ID+' .hmj-tab').empty();
		list.forEach(function(i) {
			$(ID+' .hmj-tab').append('<li style="background-image:url(\''+hURL(i[0], 'icon.png')+'\');" data-name="'+i[0]+'"></li>');
		});
	});
	
};

$(document).on('click', '.hmj-stickers-container .hmj-tab li', function(){
	var ID = '#'+$(this).parent().data('parent');
	if($(this).hasClass('selected')) { return true; } else {
		$(ID+' .hmj-tab li.selected').removeClass('selected');
		$(this).addClass('selected');
		$(ID+' .hmj-stickers').empty();
		var Name = $(this).data('name');
		chrome.runtime.sendMessage({'action':'queryStickers', 'name':Name}, function(list){
			list.forEach(function(i){
				$(ID+' .hmj-stickers').append('<li style="background-image:url(\''+hURL(Name, i)+'\');" data-url="'+hURL(Name, i)+'"></li>');
			});
		});
	}
});

$(document).on('click', '.hmj-stickers-container .hmj-stickers li', function(){
	var target = '.'+$(this).parent().data('target');
	var tag = '[img]'+$(this).data('url')+'[/img]';
	$(target).insertAtCaret(tag);
	//$(target).val(function(i,v){ return v+tag; });
});

$(document).on('mouseenter', '.hmj-stickers-container .hmj-stickers li', function(){
	var ID = '#'+$(this).parent().data('parent');
	var url = $(this).data('url');
	$(ID+' .hmj-preview').css('background-image', 'url('+url+')');
}).on('mouseleave', '.hmj-stickers-container .hmj-stickers li', function(){
	var ID = '#'+$(this).parent().data('parent');
	$(ID+' .hmj-preview').css('background-image', '');
});
