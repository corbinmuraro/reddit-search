var RESULTS_PER_PAGE = 50;

var resultTemplate = Handlebars.compile($("#resultTemplate").html());
var summaryTemplate = Handlebars.compile($("#summaryTemplate").html());

var qs = window.location.search.slice(1);
var q;
var p;

$(function() {
    deparam(qs);

    $('#search-field').val(q);

    $.ajax({url:'http://ec2-52-41-3-172.us-west-2.compute.amazonaws.com:8900/solr/core1/select/',
    	dataType: 'jsonp',
    	data: buildSearchParams(q, p), 
    	traditional: true,
    	jsonp: 'json.wrf',
        // statusCode: {
        //     403: function (xhr) {
        //         console.log('403 response');
        //         $('.results-container').hide();
        //         $('.nav').hide();
        //     }
        // },
    	success: function(result) {
            var numResults = result.response.numFound;
            $('.summary').append(summaryTemplate({totalresults: numResults, query: q}));
            for (var i = 0; i < result.response.docs.length; i++) {
                // var fixed_text = result.response.docs[i].text.replace(/\[(.*?)\]\s?\((.*?)\)/g,'<a href="$2">$1</a>');
                $(".results").append(resultTemplate({url: result.response.docs[i].url, title: result.response.docs[i].user, text: result.response.docs[i].text}));
            }

            if (numResults < RESULTS_PER_PAGE) {
                $('.nav').hide();
            }
            else if (p < RESULTS_PER_PAGE) {
                $('.first-nav').show();
            }
            else if ((numResults - p ) <= 50) {
                $('.last-nav').show();
            }
            else {
                $('.middle-nav').show();
                var pagNum_number = Math.floor(p / RESULTS_PER_PAGE) + 1;
                var pagNum_string = '' + pagNum_number;
                $('.page-number .number').text(pagNum_string);
                if (pagNum_number === 2)
                    $('.prev-prev-page').hide();
            }
    	},
        error: function(jq,status,message) {
            console.log('A jQuery error has occurred. Status: ' + status + ' - Message: ' + message);

            $('.search-container').hide();
            $('.results-container').hide();
            $('.nav').hide();
            $('.error-message').show();
        }
    });
});


// return key = search button click
$("#search-field").keyup(function(event){
    if(event.keyCode == 13){
        $(".search-button").click();
    }
});

// new search = load page with new query string
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

$(".next-page").click(function() {
    var params = {q:q, p:p+RESULTS_PER_PAGE};
    var queryString = jQuery.param( params );
    window.location = "http://sqs.corbinmuraro.com/results/?" + queryString;
});

$(".prev-page").click(function(){
    var params = {q:q, p:p-RESULTS_PER_PAGE};
    var queryString = jQuery.param( params );
    window.location = "http://sqs.corbinmuraro.com/results/?" + queryString;
});

$(".prev-prev-page").click(function(){
    var params = {q:q, p:0};
    var queryString = jQuery.param( params );
    window.location = "http://sqs.corbinmuraro.com/results/?" + queryString;
});



// builds the solr search URL
function buildSearchParams(q, p) {
  var ret = { 
    'start': p,
    'rows': RESULTS_PER_PAGE,
    'wt': 'json',
    'q': q,
    'hl': 'true',
    'hl.fl': 'text',
    'hl.snippets': 1
  };
  return ret;
}

// takes the page's query string as a parameter
// stores q (query) and p (page # in posts) values into the q and p global variables
function deparam(queryString) {
    var obj = {}; 
    queryString.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
    }); 


    q = obj.q;
    q = q.replace(/\+/g,' ');
    p = parseInt(obj.p);
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
