var resultTemplate = Handlebars.compile($("#resultTemplate").html());
var summaryTemplate = Handlebars.compile($("#summaryTemplate").html());

var q = window.location.search.slice(1);
q = q.replace(/\+/g,' ');

$('#search-field').val(q);


$.ajax({url:'http://ec2-52-41-3-172.us-west-2.compute.amazonaws.com:8900/solr/core1/select/',
	dataType: 'jsonp',
	data: buildSearchParams(q), 
	traditional: true,
	jsonp: 'json.wrf',
	success: function(result) {
		$('.summary').append(summaryTemplate({totalresults: result.response.numFound, query: q}));

		for (var i = 0; i < result.response.docs.length; i++) {
    		  $(".results").append(resultTemplate({url: result.response.docs[i].url, title: result.response.docs[i].user, text: result.response.docs[i].text}));
  		}
	}
});

function buildSearchParams(q) {
  var ret = { 
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
    q = q.replace(/\s/g, "+");
    window.location = "http://sqs.corbinmuraro.com/results/?" + q;
  }
});


//normalize a string with respect to whitespace:
//1) Remove all leadsing and trailing whitespace
//2) Replace all runs of tab, space and &nbsp; with a single space
function normalize_ws(string) 
{
  return string.replace(/^\s+/, '')
    .replace(/\s+$/, '')
    .replace(/(?: |\t|&nbsp;|&#xa0;|\xa0)+/g, ' '); 
}
