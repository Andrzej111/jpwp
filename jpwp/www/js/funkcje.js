function sort_ul(selector) {
    $(selector).children("li").sort(function(a, b) {
        var upA = $(a).text().toUpperCase();
        var upB = $(b).text().toUpperCase();
        return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
    }).appendTo(selector);


	    $(selector+":visible").listview('refresh');
}

function grid2_maker(left,right){
	var grid=$('<div class=ui-grid-a></div>');
	if (typeof(left)=="object"){
		for (var i=0; i<left.length;i++){
			$(grid).append('<div class=ui-block-a>'+left[i]+'</div>');
			$(grid).append('<div class=ui-block-b>'+right[i]+'</div>');
		}
		return grid;
	} 
	else {
		$(grid).append('<div class=ui-block-a>'+left+'</div>');
		$(grid).append('<div class=ui-block-b>'+right+'</div>');
		return grid;
	}
	
}

//tak samo tylko 3-kolumnowe
function grid3_maker(left,mid,right){
	var grid=$('<div class=ui-grid-b></div>');
	if (typeof(left)=="object"){
		for (var i=0; i<left.length;i++){
			$(grid).append('<div class=ui-block-a>'+left[i]+'</div>');
			$(grid).append('<div class=ui-block-b>'+mid[i]+'</div>');
			$(grid).append('<div class=ui-block-c>'+right[i]+'</div>');
		}
		return grid;
	} 
	else {
		$(grid).append('<div class=ui-block-a>'+left+'</div>');
		$(grid).append('<div class=ui-block-b>'+mid+'</div>');
		$(grid).append('<div class=ui-block-c>'+right+'</div>');
		return grid;
	}
}