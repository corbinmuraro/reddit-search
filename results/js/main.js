var resultTemplate = Handlebars.compile($("#resultTemplate").html());
var summaryTemplate = Handlebars.compile($("#summaryTemplate").html());

var qs = window.location.search.slice(1);
var q = "";
var p = "";

deparam(qs);

$('#search-field').val(q);

$.ajax({url:'http://ec2-52-41-3-172.us-west-2.compute.amazonaws.com:8900/solr/core1/select/',
	dataType: 'jsonp',
	data: buildSearchParams(q, p), 
	traditional: true,
	jsonp: 'json.wrf',
	success: function(result) {
		$('.summary').append(summaryTemplate({totalresults: result.response.numFound, query: q}));
    console.log(result.response.docs.length);
		for (var i = 0; i < result.response.docs.length; i++) {
          // var fixed_text = result.response.docs[i].text.replace(/\[(.*?)\]\s?\((.*?)\)/g,'<a href="$2">$1</a>');
    		  $(".results").append(resultTemplate({url: result.response.docs[i].url, title: result.response.docs[i].user, text: result.response.docs[i].text}));
  		}
	}
});

function buildSearchParams(q, p) {
  var ret = { 
    'start': p,
    'rows': 50,
    'wt': 'json',
    'q': q,
    'hl': 'true',
    'hl.fl': 'text',
    'hl.simple.pre': '<strong>',
    'hl.simple.post': '</strong>',
    'hl.snippets': 10
  };
  return ret;
}

// return key = search button click
$("#search-field").keyup(function(event){
    if(event.keyCode == 13){
        $(".search-button").click();
    }
});

$(".search-button").click(function(){

  var q = $('#search-field').val();
  q = normalize_ws(q);

  if (q.length > 0) 
  {
    var params = {q:q, p:0};
    var queryString = jQuery.param( params );
    window.location = "http://sqs.corbinmuraro.com/results/?" + queryString;
  }
});


$(".next-button").click(function() {
    var params = {q:q, p:p+50};
    var queryString = jQuery.param( params );
    window.location = "http://sqs.corbinmuraro.com/results/?" + queryString;
});

$(".prev-button").click(function(){
    var params = {q:q, p:p-50};
    var queryString = jQuery.param( params );
    window.location = "http://sqs.corbinmuraro.com/results/?" + queryString;
});



// takes the page's query string as a parameter
// stores q and p values into the q and p global variables
function deparam(queryString) {
    var obj = {}; 
    queryString.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
    }); 


    q = obj.q;
    q = q.replace(/\+/g,' ');
    p = obj.p;
}


//normalize a string with respect to whitespace:
//1) Remove all leadsing and trailing whitespace
//2) Replace all runs of tab, space and &nbsp; with a single space
function normalize_ws(string) 
{
  return string.replace(/^\s+/, '')
    .replace(/\s+$/, '')
    .replace(/(?: |\t|&nbsp;|&#xa0;|\xa0)+/g, ' '); 
}
