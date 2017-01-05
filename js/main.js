$('#search-field').focus();

$("#search-field").keyup(function(event) {
	if(event.keyCode == 13) {
		$(".search-button").click();
	}
});

$(".search-button").click(function() {
	var q = $('#search-field').val();
	q = normalize_ws(q);

	if (q.length > 0) {
		var params = {q:q, p:0};
		var queryString = jQuery.param( params );
		window.location = "http://sqs.corbinmuraro.com/results/?" + queryString;
	}
});

$('.winter-boots').click(function() {
	event.preventDefault();
	$('#search-field').val("durable winter boots");
	$('#search-field').focus();
});

$('.tailor-recommendations').click(function() {
	event.preventDefault();
	$('#search-field').val("tailor in DC");
	$('#search-field').focus();
});

$('.cp-meme').click(function() {
	event.preventDefault();
	$('#search-field').val("common projects alternatives");
	$('#search-field').focus();
});


//normalize a string with respect to whitespace:
//1) Remove all leadsing and trailing whitespace
//2) Replace all runs of tab, space and &nbsp; with a single space
function normalize_ws(string) {
	return string.replace(/^\s+/, '')
	.replace(/\s+$/, '')
	.replace(/(?: |\t|&nbsp;|&#xa0;|\xa0)+/g, ' ');
}
