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
    	success: function(result) {
            var numResults = result.response.numFound;
            $('.summary').append(summaryTemplate({totalresults: numResults, query: q}));

            for (var i = 0; i < result.response.docs.length; i++) {
                var id = result.response.docs[i].id;
                var highlighted_text = result.highlighting[id].text[0];
                
                var clean_post = clean_up_post_urls(highlighted_text);

                // ?context=10 to show at most 10 parent comments up the chain
                $(".results").append(resultTemplate({url: result.response.docs[i].url + "?context=10", title: result.response.docs[i].user, text: clean_post}));
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
        'hl.simple.pre': '<strong>',
        'hl.simple.post': '</strong>',
        'hl.fragsize': 0
    };

    return ret;
}

var bad_url_regex = /(https?:\/\/)(www\.)?(.*?)?(<strong>)(.*?)(<\/strong>)/g;
var good_url_regex = /(?!.*?")(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=;]*))/g;
var reddit_url_regex = /\[(.*?)\]\s?\((.*?)\)/g;

function clean_up_post_urls(post_text) {
    // scrub <strong> and </strong> off of the urls
    while (bad_url_regex.test(post_text)) {
        post_text = post_text.replace(bad_url_regex, '$1$2$3$5');
    }
    var clean_text = post_text;

    var with_reddit_urls = clean_text.replace(reddit_url_regex, '<a href="$2">$1</a>');
    
    var with_regular_urls = with_reddit_urls.replace(good_url_regex,'<a href="$1">$1</a>');

    return with_regular_urls;
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
