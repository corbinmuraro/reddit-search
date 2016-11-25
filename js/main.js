$('search-field').focus();

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


// //CONST- CHANGE ALL THESE TO TELL SOLRSTRAP ABOUT THE LOCATION AND STRUCTURE OF YOUR SOLR
// // TODO: add search term highlighting (bold?)

// var SERVERROOT = 'http://ec2-52-41-3-172.us-west-2.compute.amazonaws.com:8900/solr/core1/select'; //SELECT endpoint
// var HITTITLE = 'date';                                          //Name of the title field- the heading of each hit
// var HITBODY = 'text';                                       //Name of the body field- the teaser text of each hit
// var HITSPERPAGE = 20;                                          //page size- hits per page

// var HITID = 'id'; // Name of the id field
// var HITTEASER = 'teaser';  // Name of field to use for teaser
// var HITLINK = 'url';  // Name of field to use for link

// var HL = false;
// var HL_FL = 'url, text';
// var HL_SIMPLE_PRE = '<strong>';
// var HL_SIMPLE_POST = '</strong>';
// var HL_SNIPPETS = 1;

// var AUTOSEARCH_DELAY = -1;

// //when the page is loaded- do this
// $(document).ready(function() {
//   $('#solrstrap-hits').append('<div offset="0"></div>');
//   $('#solrstrap-searchbox').attr('value', getURLParam('q'));
//   // auto-select search box
//   $('#solrstrap-searchbox').focus();
//   $('#solrstrap-searchbox').select();
//   //when the searchbox is typed- do this
//   // $('#solrstrap-searchbox').keyup(keyuphandler);
//   $('.icon').submit(handle_submit);
//   $('form.navbar-search').submit(handle_submit);
//   $(window).bind('hashchange', hashchange);
//   $('#solrstrap-searchbox').bind("change", querychange);
//   hashchange();
// });

// //jquery plugin allows resultsets to be painted onto any div.
// (function( $ ) {
//   $.fn.loadSolrResults = function(q, fq, offset) {
//     $(this).getSolrResults(q, fq, offset);
//   };
// })( jQuery );


// //jquery plugin allows autoloading of next results when scrolling.
// (function( $ ) {
//   $.fn.loadSolrResultsWhenVisible = function(q, fq, offset) {
//     elem = this;
//     $(window).scroll(function(event){
//       if (isScrolledIntoView(elem) && !$(elem).attr('loaded')) {
//         //dont instantsearch and autoload at the same time
//         if ($('#solrstrap-searchbox').val() != getURLParam('q')) {
//           handle_submit();
//         }
//         $(elem).attr('loaded', true);
//         $(elem).getSolrResults(q, fq, offset);
//         $(window).unbind('scroll');
//       }
//     });
//   };
// })( jQuery );


// //jquery plugin for takling to solr
// (function( $ ){
//   var TEMPLATES = {
//     'hitTemplate':Handlebars.compile($("#hit-template").html()),
//     'summaryTemplate':Handlebars.compile($("#result-summary-template").html()),
//     'navTemplate':Handlebars.compile($("#nav-template").html()),
//     'chosenNavTemplate':Handlebars.compile($("#chosen-nav-template").html())
//   };

//   $.fn.getSolrResults = function(q, fq, offset) {
//     var rs = this;
//     $(rs).parent().css({ opacity: 0.5 });
//     $.ajax({url:SERVERROOT,
//     dataType: 'jsonp',
//     data: buildSearchParams(q, fq, offset), 
//     traditional: true,
//     jsonp: 'json.wrf',
//     success: 
//   	  function(result){
//   	    // console.log(result);
//   	    //only redraw hits if there are new hits available
//   	    if (result.response.docs.length > 0) {
//   	      if (offset === 0) {
//         		rs.empty();
//         		//strapline that tells you how many hits you got
//         		rs.append(TEMPLATES.summaryTemplate({totalresults: result.response.numFound, query: q}));
//         		rs.siblings().remove();
//   	      }
//   	      //draw the individual hits
//   	      for (var i = 0; i < result.response.docs.length; i++) {
//   		      var title = normalize_ws(get_maybe_highlit(result, i, HITTITLE));
//   		      var text = normalize_ws(get_maybe_highlit(result, i, HITBODY));
//             var complex_link_text = text.replace(/\[(.*?)\]\s?\((.*?)\)/g,'<a href="$2">$1</a>');
//             text = complex_link_text;

//             // TODO: get simple link texts working as well (need to ignore existing link replacements from ^)
//             // var simple_link_text = text.replace(/(((https?:\/\/)|(www\.))[^\s][^"]+)/g,'<a href="$1">$1</a>');
//             // text = simple_link_text;


//   		      var teaser = normalize_ws(get_maybe_highlit(result, i, HITTEASER));
//   		      var link = result.response.docs[i][HITLINK];
  	      
//   		      var hit_data = {title: title, text: text};

//         		if (teaser) {
//         		  hit_data.teaser = teaser;
//         		}
//         		if (link) {
//         		  hit_data.link = link;
//         		}

//   		      rs.append(TEMPLATES.hitTemplate(hit_data));
//   	      }

//   	      $(rs).parent().css({ opacity: 1 });
//   	      //if more results to come- set up the autoload div
//   	      if ((+HITSPERPAGE+offset) < +result.response.numFound) {
//   		      var nextDiv = document.createElement('div');
//   		      $(nextDiv).attr('offset', +HITSPERPAGE+offset);
//   		      rs.parent().append(nextDiv);
//   		      $(nextDiv).loadSolrResultsWhenVisible(q, fq, +HITSPERPAGE+offset);
//   	      }
//   	    }
//   	  }
//     });
//   };
// })( jQuery );

// //utility function for grabbling URLs
// function getURLParam(name) {
//   var ret = $.bbq.getState(name);
//   return ret;
// }

// //function to generate an array of URL parameters, where there are likely to be several params with the same key
// function getURLParamArray(name) {
//   var ret =  $.bbq.getState(name) || [];
//   if (typeof(ret) == 'string')
//     ret = [ret];
//   return ret;
// }

// //utility function that checks to see if an element is onscreen
// function isScrolledIntoView(elem) {
//   var docViewTop = $(window).scrollTop();
//   var docViewBottom = docViewTop + $(window).height();
//   var elemTop = $(elem).offset().top;
//   var elemBottom = elemTop + $(elem).height();
//   return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
// }

// function buildSearchParams(q, fq, offset) {
//   var ret = { 
//   'rows': HITSPERPAGE,
//   'wt': 'json',
//   'q': q,
//   'start': offset
//   };
//   if (FACETS.length > 0) {
//     ret['facet'] = 'true';
//     ret['facet.mincount'] = '1';
//     ret['facet.limit'] = '20';
//     ret['facet.field'] = FACETS;
//   }
//   if (fq.length > 0) {
//     ret['fq'] = fq;
//   }
//   if (HL_FL) {
//     ret['hl'] = 'true';
//     ret['hl.fl'] = HL_FL;
//     ret['hl.simple.pre'] = HL_SIMPLE_PRE;
//     ret['hl.simple.post'] = HL_SIMPLE_POST;
//     ret['hl.snippets'] = HL_SNIPPETS;
//   }
//   return ret;
// }

// //optionally convert a string array to a string, by concatenation
// function array_as_string(array_or_string)
// {
//   var ret = '';
//   if (typeof(array_or_string) == 'string') {
//     ret = array_or_string;
//   }
//   else if (typeof(array_or_string) == 'object' && array_or_string.hasOwnProperty('length') && array_or_string.length > 0) {
//     ret = array_or_string.join(" ... ");
//   }
//   return ret;
// }

// //normalize a string with respect to whitespace:
// //1) Remove all leadsing and trailing whitespace
// //2) Replace all runs of tab, space and &nbsp; with a single space
// function normalize_ws(string) 
// {
//   return string.replace(/^\s+/, '')
//     .replace(/\s+$/, '')
//     .replace(/(?: |\t|&nbsp;|&#xa0;|\xa0)+/g, ' '); 
// }


// //get field from result for document i, optionally replacing with
// //highlit version
// function get_maybe_highlit(result, i, field) 
// {
//   var res = result.response.docs[i][field];
//   if (HL) {
//     var id = result.response.docs[i][HITID];
//     var hl_map = result.highlighting[id];
//     if (hl_map.hasOwnProperty(field)) {
//       res = hl_map[field];
//     }

//     // temporary fix to prevent full result from broken solr highlighting fragments on a few results
//     else if ( field === "content" ){
//         result.highlighting[id][field] = "<br>";
//         hl_map = result.highlighting[id];
//         res = hl_map[field];
//     }
//   }

//   return array_as_string(res);
// }


// function hashchange(event)
// // {
//   $('#solrstrap-hits div[offset="0"]').loadSolrResults(getURLParam('q'), getURLParamArray('fq'), 0);
// }

// function handle_submit(event)
// {
//   var q = $.trim($('#solrstrap-searchbox').val());
//   if (q !== '') {
//     $.bbq.removeState("fq");
//     $.bbq.removeState("q");
//     $.bbq.pushState({'q': q});
//   }
//   return false;
// }

// var querychange = handle_submit;

// var timeoutid;
// function keyuphandler()
// {
//   if (timeoutid) {
//     window.clearTimeout(timeoutid);
//   }
//   timeoutid = window.setTimeout(maybe_autosearch, AUTOSEARCH_DELAY);
// }

