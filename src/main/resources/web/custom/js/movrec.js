var base_url = "http://localhost:8080/MovRecTwo/rest/rec/";

$(document).ready(function() {
    
    	insertView_start();
    	
});



function insertMovieInfo(imdb_id, element_id, movieID) {
	$.ajax({
	      url: "http://www.omdbapi.com/?i=tt" + imdb_id,
	      datatype: "jsonp",
	        success: function(data){
	            // Image
	        	$("." + element_id + " img.poster").attr("src", data["Poster"]);
	        	
	        	// Description
	        	$("." + element_id + " .desc").html(data["Plot"])
	        	
	        	// Modals
	        	$("#content-area").append(html_modalMovie(movieID, data));
	        }
	    });
};



/* VIEWS */

function clear_view() {
	$("#content-area").empty();
	$(".nav.navbar-nav").children().removeClass("active");
}

function html_rating_stars(id) {
	html = '<select class="stars_'+id+'">';
	html += '<option value="1">1</option>';
	html += '<option value="2">2</option>';
	html += '<option value="3">3</option>';
	html += '<option value="4">4</option>';
	html += '<option value="5">5</option>';
	html += '</select>';
	return html;
}

function insertView_start() {
	// clear view
	clear_view();
	
	// set menu
	$(".menu_start").addClass("active");
	
	// load/insert base plugins
	var html_carousel_base = '<!-- Carousel ================================================== -->';
	html_carousel_base += '<div id="myCarousel" class="carousel slide" data-ride="carousel">';
	 html_carousel_base += '<!-- Indicators -->';
	  html_carousel_base += '<ol class="carousel-indicators">';
	html_carousel_base += '<!--  MovRec: carousel indicators -->';
	  html_carousel_base += '</ol>';
	  html_carousel_base += '<div class="carousel-inner" role="listbox">';
	html_carousel_base += '<!--  MovRec: carousel content -->';
	  html_carousel_base += '</div>';
	  html_carousel_base += '<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">';
	html_carousel_base += '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>';
	html_carousel_base += '<span class="sr-only">Previous</span>';
	  html_carousel_base += '</a>';
	  html_carousel_base += '<a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">';
	html_carousel_base += '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
	html_carousel_base += '<span class="sr-only">Next</span>';
	  html_carousel_base += '</a>';
	html_carousel_base += '</div><!-- /.carousel -->';
	$("#content-area").append(html_carousel_base);
	
	var html_bubbles_base = '<div class="container marketing">';
	html_bubbles_base += '<h4>did you already know these movies?</h4><br>';
	html_bubbles_base += '<!-- Three columns of text below the carousel -->';
	html_bubbles_base += '<div class="row bubbles">';
	html_bubbles_base += '<!--  MovRec: item bubbles content -->';
	html_bubbles_base += '</div><!-- /.row -->';
	html_bubbles_base += '</div>';
	$("#content-area").append(html_bubbles_base);
	
	
	// Load dynamic content
	$.ajax({
		dataType: 'json',
        url: base_url+"getRandomMovies"
    }).then(function(data) {
    	var item_counter = 0;
    	jQuery.each(data, function(movieID, movieInfo) {

    		// generate carousel
    		var html_carousel_indicators = '<li data-target="#myCarousel" data-slide-to="'+item_counter+'" class=""></li>';
    		if(item_counter == 0) {
    			html_carousel_indicators = '<li data-target="#myCarousel" data-slide-to="'+item_counter+'" class="active"></li>';
    		}
    		$("#myCarousel .carousel-indicators").append(html_carousel_indicators);
    		
    		var html_carousel = '<div class="item movie_'+movieID+'">';
    		if(item_counter == 0){
    			html_carousel = '<div class="item active movie_'+movieID+'">';
    		}
	    		html_carousel += '<div class="container">';
	    		html_carousel += '<div class="carousel-caption"><div class="image">';
	    		html_carousel += '<img class="poster" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="First slide">';
	    		html_carousel += '</div><div class="info"><h1>'+movieInfo[0]+'</h1>';
	    		html_carousel += '<p class="desc"></p>';
	    		html_carousel += '<p>'+html_rating_stars(movieID)+ ' <button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#movieModal_'+movieID+'">View details</button>';
	    		html_carousel += '</div></div>';
	    		html_carousel += '</div>';
	    		html_carousel += '</div>';
	    	$("#myCarousel .carousel-inner").append(html_carousel);
    		
    	    // generate overview
    		var html = '<div class="col-lg-4 movie_'+movieID+'"><img class="poster img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140">';
    			html += '<h2>'+ movieInfo[0] +'</h2>';
    			html += '<p>';
    			var test = movieInfo[1].split("|");
    			jQuery.each(test, function(key, value) {
    				html += ' <span class="label label-default">'+value+'</span> ';
    			});
    			html += '</p>';
    			html += '<p>'+html_rating_stars(movieID)+ ' <button type="button" class="btn btn-default btn-xs" data-toggle="modal" data-target="#movieModal_'+movieID+'">View details &raquo;</button>';
    			html += '</div><!-- /.col-lg-4 -->';    			
    			
    		$(".container.marketing .bubbles").append(html);
    		
    		// Load further information
    		insertMovieInfo(movieInfo[2], "movie_"+movieID, movieID);
    		$('.stars_'+movieID).barrating({
    	        theme: 'fontawesome-stars',
    	        initialRating: 3.5,
    	        readonly: true
    	      });
    		
    		item_counter++;
    	});
    });
}



function insertView_ratings() {
	// clear view
	clear_view();
	
	// set menu
	$(".menu_ratings").addClass("active");
	
	// vars
	var myRatingsArray = new Object();
	
	// load/insert base plugins
	var html_base = '<div class="container marketing">';
	html_base += '<div>';
	html_base += '<h4>Rate some movies to get recommendations</h4>';
	html_base += '<button type="button" class="btn btn-circle" data-toggle="modal" data-target="#rateModal">Rate now!</button>';
	html_base += '</div>';
	html_base += '<div class="modal movie-detail fade" id="rateModal" tabindex="-1" role="dialog" aria-labelledby="rateModalLabel">';
	html_base += '<div class="modal-dialog modal-lg" role="document">';
	html_base += '<div class="modal-content">';
	html_base += '<div class="modal-header">';
	html_base += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	html_base += '<h4 class="modal-title" id="rateModalLabel">Rate some movies to get recommendations</h4>';
	html_base += '</div>';
	html_base += '<div class="modal-body">';
	html_base += '</div>';
	html_base += '<div class="modal-footer">';
	html_base += '<button type="button" class="btn btn-default" data-dismiss="modal">cancel</button>';
	html_base += '<button type="button" class="btn btn-primary" id="submit_ratings">submit ratings</button>';
	html_base += '</div>';
	html_base += '</div>';
	html_base += '</div>';
	html_base += '</div>';
	$("#content-area").append(html_base);
	
	$.ajax({
		dataType: 'json',
        url: base_url+"getMoviesForRating"
    }).then(function(data) {
    	var item_counter = 0;
    	jQuery.each(data, function(movieID, movieInfo) {

    		// generate featurette
    		var html_modal = '<div class="row featurette movie_'+movieID+'">';
    		html_modal += '<div class="col-md-7';
    		if (item_counter%2) {
    			html_modal += ' col-md-push-5';
    		}
    		html_modal += '">';
    		html_modal += '<h2 class="featurette-heading">'+movieInfo[0]+'</h2>';
    		html_modal += '<p><span class="lead desc"></span> <button type="button" class="btn btn-default btn-sm" style="vertical-align:top;" data-toggle="modal" data-target="#movieModal_'+movieID+'">View details &raquo;</button></p>';
    		html_modal += '<p class="rating">your rating: '+html_rating_stars(movieID)+'</p>';
    		html_modal += '<p></p>';
    		html_modal += '</div>';
    		html_modal += '<div class="col-md-5';
    		if (item_counter%2) {
    			html_modal += ' col-md-pull-7';
    		}
    		html_modal += '">';
    		html_modal += '<img class="featurette-image img-responsive center-block poster" data-src="" alt="Poster">';
    		html_modal += '</div>';
    		html_modal += '</div>';
    		html_modal += '<hr class="featurette-divider">';
    		$(".container.marketing .modal-body").append(html_modal);
    		
    		// Add movie to ratingsArray
    		myRatingsArray[movieID] = 0.0;

    		// Load further information
    		insertMovieInfo(movieInfo[2], "movie_"+movieID, movieID);
    		$('.stars_'+movieID).barrating({
    	        theme: 'fontawesome-stars',
    	        readonly: false,
    	        onSelect: function(value, text, event) {
    	        	myRatingsArray[movieID] = parseFloat(value);
    	          }
    	      });
    		
    		
//    		// generate featurette
//    		var html_featurette_base = '<hr class="featurette-divider">';
//    		html_featurette_base += '<div class="row featurette movie_'+movieID+'">';
//    		html_featurette_base += '<div class="col-md-7';
//    		if (item_counter%2) {
//    			html_featurette_base += ' col-md-push-5';
//    		}
//    		html_featurette_base += '">';
//    		html_featurette_base += '<h2 class="featurette-heading">'+movieInfo[0]+'</h2>';
//    		html_featurette_base += '<p><span class="lead desc"></span> <button type="button" class="btn btn-default btn-sm" style="vertical-align:top;" data-toggle="modal" data-target="#movieModal_'+movieID+'">View details &raquo;</button></p>';
//    		html_featurette_base += '<p class="rating">your rating: '+html_rating_stars(movieID)+'</p>';
//    		html_featurette_base += '<p></p>';
//    		html_featurette_base += '</div>';
//    		html_featurette_base += '<div class="col-md-5';
//    		if (item_counter%2) {
//    			html_featurette_base += ' col-md-pull-7';
//    		}
//    		html_featurette_base += '">';
//    		html_featurette_base += '<img class="featurette-image img-responsive center-block poster" data-src="" alt="Poster">';
//    		html_featurette_base += '</div>';
//    		html_featurette_base += '</div>';
//    		$(".container.marketing").append(html_featurette_base);
//    		
//    		// Load further information
//    		insertMovieInfo(movieInfo[2], "movie_"+movieID, movieID);
//    		$('.stars_'+movieID).barrating({
//    	        theme: 'fontawesome-stars',
//    	        readonly: false
//    	      });
    		
    		item_counter++;
    	});
    	
    	// button actions -> submit ratings
    	$("#submit_ratings").click(function() {
    		// Close modal
    		$("#rateModal").modal('hide');
    		
    		// post data
    		$.post(base_url+"setMoviesForRating", {'ratingData': JSON.stringify(myRatingsArray)}).done(function(data, statusText) {
    		    // This block is optional, fires when the ajax call is complete
    		});
    	});
    });
}


function html_modalMovie(movieID, movieInfoMap) {
	html = '<!-- Modal -->';
	html += '<div class="modal movie-detail fade" id="movieModal_'+movieID+'" tabindex="-1" role="dialog" aria-labelledby="movieModal_'+movieID+'Label">';
	html += '<div class="modal-dialog" role="document">';
	html += '<div class="modal-content">';
	html += '<div class="modal-header">';
	html += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	html += '<h4 class="modal-title" id="movieModal_'+movieID+'Label">'+movieInfoMap["Title"]+'</h4>';
	html += '</div>';
	html += '<div class="modal-body">';
	html += '<h4><i>IMDB information</i></h4>';
	html += '<img src="'+movieInfoMap["Poster"]+'" alt="Poster">';
	jQuery.each(movieInfoMap, function(key, value) {
		html += '<b>'+key + '</b>: ' + value + '<br>';
	});
	html += '</div>';
	html += '<div class="modal-footer">';
	html += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
	//html += '<button type="button" class="btn btn-primary">Save changes</button>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	
	return html;
}