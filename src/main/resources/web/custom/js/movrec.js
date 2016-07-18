var base_url = "/MovRecTwo/rest/rec/";



/* GLOBAL / HELPER FUNCTIONS */

$(document).ready(function() {
	// load view Start/Home on startup
    insertView_start();

});


function insertMovieInfo(imdb_id, element_id, movieID) {
	/* GET MOVIE-DATA FROM IMDB and INSERT IN CONTAINER */
	
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



/* VIEWS / VIEW GENERATING FUNCTIONS */

function clear_view() {
	/* CLEAR CONTENT AREA */
	
	$("#content-area").empty();
	$(".nav.navbar-nav").children().removeClass("active");
	
	// Show loading bar
	$("#content-area").append(html_loading());
}

function remove_loading() {
	/* REMOVE ALL LOADUNG BARS FROM PAGE */
	$(".loading-container").remove();
}

function fix_boxHeight(element_selector){
	/* FIXES BOOTSTRAP BUG - SETS STATIC HEIGHT FOR ALL COLS IN GIRD */
	
	var t=0; // the height of the highest element (after the function runs)
	var t_elem;  // the highest element (after the function runs)
	$(element_selector).each(function () {
	    $this = $(this);
	    if ( $this.outerHeight() > t ) {
	        t_elem=this;
	        t=$this.outerHeight();
	    }
	});
	
	// Set height for all elements
	$(element_selector).height(t);
}

function insertView_start() {
	/* GENERATE and INSERT PAGE: Home */
	
	// clear view
	clear_view();
	
	// set menu
	$(".menu_start").addClass("active");
	
	// insert slider (carousel) containers
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
	
	// insert bubble containers
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
    	
    	// Remove loading bar if any 
    	remove_loading();
    	
    	// FOR EACH MOVIE
    	var item_counter = 0;
    	jQuery.each(data, function(movieID, movieInfo) {

    		// generate and insert slider (carousel)
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
    		
    	    // generate and insert bubbles
    		var html_bubbles = '<div class="col-lg-4 movie_'+movieID+'"><img class="poster img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140">';
    		html_bubbles += '<h2>'+ movieInfo[0] +'</h2>';
    		html_bubbles += '<p>';
			// Genres split and output
			var genres = movieInfo[1].split("|");
			jQuery.each(genres, function(key, value) {
				html_bubbles += ' <span class="label label-default">'+value+'</span> ';
			});
			html_bubbles += '</p>';
			html_bubbles += '<p>'+html_rating_stars(movieID)+ ' <button type="button" class="btn btn-default btn-xs" data-toggle="modal" data-target="#movieModal_'+movieID+'">View details &raquo;</button>';
			html_bubbles += '</div>';    			
    		$(".container.marketing .bubbles").append(html_bubbles);
    		
    		// Load and Insert further information
    		insertMovieInfo(movieInfo[2], "movie_"+movieID, movieID);
    		$('.stars_'+movieID).barrating({
    	        theme: 'fontawesome-stars',
    	        initialRating: parseFloat(movieInfo[3]),
    	        readonly: true
    	      });
    		
    		item_counter++;
    	});
    	
    	// Fix bootstrap ordering bug
    	fix_boxHeight(".container.marketing .bubbles .col-lg-4");
    });
}


function insertView_ratings() {
	/* GENERATE and INSERT PAGE: Recommendations */
	
	// clear view
	clear_view();
	
	// set menu
	$(".menu_ratings").addClass("active");
	
	// vars
	var myRatingsArray = new Object();
	
	// load/insert base containers and content
	var html_base = '<div class="container marketing">';
	html_base += '<div class="rating-results" style="display:none;">'+html_loading()+'</div>';
	html_base += '<div class="rating-votes">';
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
    	
    	// Remove loading bar if any 
    	remove_loading();
    	
    	// FOR EACH MOVIE
    	var item_counter = 0;
    	jQuery.each(data, function(movieID, movieInfo) {

    		// generate modal content
    		var html_modal = '<div class="row featurette movie_'+movieID+'">';
    		html_modal += '<div class="col-md-7';
    		if (item_counter%2) {
    			html_modal += ' col-md-push-5';
    		}
    		html_modal += '">';
    		html_modal += '<h2 class="featurette-heading">'+movieInfo[0]+'</h2>';
    		html_modal += '<p><span class="lead desc"></span> <button type="button" class="btn btn-default btn-xs" style="vertical-align:top;" data-toggle="modal" data-target="#movieModal_'+movieID+'">View details &raquo;</button></p>';
    		html_modal += '<p>';
    		// Genres split and output
			var genres = movieInfo[1].split("|");
			jQuery.each(genres, function(key, value) {
				html_modal += ' <span class="label label-default">'+value+'</span> ';
			});
    		html_modal += '</p><br>';
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
    		myRatingsArray[movieID] = 1.0;

    		// Load and Insert further information
    		insertMovieInfo(movieInfo[2], "movie_"+movieID, movieID);
    		$('.stars_'+movieID).barrating({
    	        theme: 'fontawesome-stars',
    	        readonly: false,
    	        initialRating: 1,
    	        deselectable: true,
    	        onSelect: function(value, text, event) {
    	        	myRatingsArray[movieID] = parseFloat(value);
    	          }
    	      });
    		
    		item_counter++;
    	});
    	
    	// button actions -> submit ratings
    	$("#submit_ratings").click(function() {
    		// Close modal
    		$("#rateModal").modal('hide');
    		
    		// clear result area
    		$(".container.marketing .rating-results").empty().html(html_loading()).show();
    		
    		// log
    		console.log("POST payload:");
    		console.log(myRatingsArray);
    		
    		// post data
    		$.ajax({
                url: base_url+"setMoviesForRating",
                type: 'post',
                dataType: 'json',
                data: {'ratingData': JSON.stringify(myRatingsArray)},
                success: function (data) {
                	var item_counter = 0;
                	console.log("recieved POST response:");
                	console.log(data)
                	
                	// clear result area
                	$(".container.marketing .rating-results").empty()
                	
                	// FOR EACH MOVIE
        	    	jQuery.each(data, function(movieID, movieInfo) {
        	    		// convert ALS suggestion to css-class, e.g. 7,43 to 74
        	    		var suggestion_css_class_id = Math.round(parseFloat(movieInfo[3]) * 10)
        	    		var suggestion_css_color = "";
        	    		if(suggestion_css_class_id/100 < 1/3) { suggestion_css_color = "" }
        	    		else if (suggestion_css_class_id/100 < 2/3) { suggestion_css_color = "orange" }
        	    		else { suggestion_css_color = "green" }
        	    		
        	    		// generate view
        	    		var html = '<div class="col-lg-4 movie_'+movieID+'">';
        	    		html += '<div class="c100 p'+suggestion_css_class_id+' '+suggestion_css_color+'"><span><img class="poster img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140"></span><div class="slice"><div class="bar"></div><div class="fill"></div></div></div>';
            			html += '<h2>'+ movieInfo[0] +'</h2>';
            			html += '<p>';
            			var test = movieInfo[1].split("|");
            			jQuery.each(test, function(key, value) {
            				html += ' <span class="label label-default">'+value+'</span> ';
            			});
            			html += '</p>';
            			html += '<p>'+html_rating_stars(movieID)+ ' <button type="button" class="btn btn-default btn-xs" data-toggle="modal" data-target="#movieModal_'+movieID+'">View details &raquo;</button>';
            			html += '</div><!-- /.col-lg-4 -->';    			
        	    		$(".container.marketing .rating-results").append(html);
        	 
        	    		// Load and Insert further information
        	    		insertMovieInfo(movieInfo[4], "movie_"+movieID, movieID);
        	    		$('.stars_'+movieID).barrating({
        	    	        theme: 'fontawesome-stars',
        	    	        initialRating: parseFloat(movieInfo[2])%5, // dev purpose only (mod 5)
        	    	        readonly: true
        	    	      });
        	    		
        	    		item_counter++;
        	    	});
                
                	// Fix bootstrap ordering bug
                	fix_boxHeight(".container.marketing .rating-results .col-lg-4");
                },
            });
    	});
    });
}


function insertView_genres() {
	/* GENERATE and INSERT PAGE: Genres */
	
	// clear view
	clear_view();
	
	// set menu
	$(".menu_genres").addClass("active");
	
	// load/insert base containers and content
	var html_base = '<div class="container marketing">';
	html_base += '<div class="rating-results" style="display:none;"></div>';
	html_base += '<h4>1) Select a genre to get recommendations</h4>';
	html_base += '<div class="genres">'+html_loading()+'</div>';
	html_base += '<div class="rating-votes" style="display:none;">';
	html_base += '<h4>2) Now rate some movies to get recommendations</h4>';
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
        url: base_url+"getAllGenres"
    }).then(function(data) {
    	// Remove loading bar if any 
    	remove_loading();
    	
    	// log
    	console.log("getAllGenres");
		console.log(data);
		
		// FOR EACH MOVIE
    	var item_counter = 0;
    	jQuery.each(data, function(key, value) {
    		
    		// insert list with all genres as buttons
    		var html_genre = ' <button type="button" class="btn btn-default" id="submit_genre_'+key+'">'+value+'</button> ';
    		$(".container.marketing .genres").append(html_genre);
    		
    		// button actions -> submit genre
    		$("#submit_genre_"+key).click(function() {
    			// generate and insert modal content
        		insertView_genres_fillModal(value); 
        		 
        		// Set button active
        		$(".genres button").removeClass("active");
        		$(this).addClass("active");
        		
        		// Show next step
        		$(".rating-votes").show();
        	});	
    	});
    });
}

function insertView_genres_fillModal(genre) {
	/* GENERATE ADDITIONAL CONTENT FOR PAGE: Genres */
	
	// vars
	var myRatingsArray = new Object();
	
	// post data
	$.ajax({
        url: base_url+"getMoviesForGenre",
        type: 'post',
        dataType: 'json',
        data: {'genre': genre},
        success: function (data) { 
        	// Remove loading bar if any 
        	remove_loading();
        	
        	// MODAL
    		$(".container.marketing .modal-body").empty();
        	
    		// FOR EACH MOVIE
        	var item_counter = 0;
        	jQuery.each(data, function(movieID, movieInfo) {
            	
        		// generate modal content
        		var html_modal = '<div class="row featurette movie_'+movieID+'">';
        		html_modal += '<div class="col-md-7';
        		if (item_counter%2) { html_modal += ' col-md-push-5'; }
        		html_modal += '">';
        		html_modal += '<h2 class="featurette-heading">'+movieInfo[0]+'</h2>';
        		html_modal += '<p><span class="lead desc"></span> <button type="button" class="btn btn-default btn-xs" style="vertical-align:top;" data-toggle="modal" data-target="#movieModal_'+movieID+'">View details &raquo;</button></p>';
        		html_modal += '<p>';
        		// Genres split and output
    			var genres = movieInfo[1].split("|");
    			jQuery.each(genres, function(key, value) {
    				html_modal += ' <span class="label label-default">'+value+'</span> ';
    			});
        		html_modal += '</p><br>';
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
        		myRatingsArray[movieID] = 1.0;
    
        		// Load and Insert further information
        		insertMovieInfo(movieInfo[2], "movie_"+movieID, movieID);
        		$('.stars_'+movieID).barrating({
        	        theme: 'fontawesome-stars',
        	        readonly: false,
        	        initialRating: 1,
        	        showSelectedRating: true,
        	        deselectable: true,
        	        onSelect: function(value, text, event) {
        	        	myRatingsArray[movieID] = parseFloat(value);
        	          }
        	      });
        		
        		item_counter++;
        	});
        	
        	
        	// button actions -> submit ratings
        	$("#submit_ratings").click(function() {
        		// Close modal
        		$("#rateModal").modal('hide');
        		
        		// clear result area
        		$(".container.marketing .rating-results").empty().html(html_loading()).show();
        		
        		// log
        		console.log("POST payload:");
        		console.log(myRatingsArray);
        		
        		// post data
        		$.ajax({
                    url: base_url+"setMoviesForRating",
                    type: 'post',
                    dataType: 'json',
                    data: {'ratingData': JSON.stringify(myRatingsArray)},
                    success: function (data) {
                    	var item_counter = 0;
                    	
                    	// log
                    	console.log("recieved POST response:");
                    	console.log(data)
                    	
                    	// clear result area
                    	$(".container.marketing .rating-results").empty()
                    	
                    	// FOR EACH MOVIE
            	    	jQuery.each(data, function(movieID, movieInfo) {
            	    		// convert ALS suggestion quote to css-class, e.g. 7,43 to 74
            	    		var suggestion_css_class_id = Math.round(parseFloat(movieInfo[3]) * 10)
            	    		if (suggestion_css_class_id > 100) { suggestion_css_class_id = 100; }
            	    		var suggestion_css_color = "";
            	    		if(suggestion_css_class_id/100 < 1/3) { suggestion_css_color = "" }
            	    		else if (suggestion_css_class_id/100 < 2/3) { suggestion_css_color = "orange" }
            	    		else { suggestion_css_color = "green" }
            	    		
            	    		// generate bubbles
            	    		var html = '<div class="col-lg-4 movie_'+movieID+'">';
            	    		html += '<div class="c100 p'+suggestion_css_class_id+' '+suggestion_css_color+'"><span><img class="poster img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140"></span><div class="slice"><div class="bar"></div><div class="fill"></div></div></div>';
                			html += '<h2>'+ movieInfo[0] +'</h2>';
                			html += '<p>';
                			var test = movieInfo[1].split("|");
                			jQuery.each(test, function(key, value) {
                				html += ' <span class="label label-default">'+value+'</span> ';
                			});
                			html += '</p>';
                			html += '<p>'+html_rating_stars(movieID)+ ' <button type="button" class="btn btn-default btn-xs" data-toggle="modal" data-target="#movieModal_'+movieID+'">View details &raquo;</button>';
                			html += '</div><!-- /.col-lg-4 -->';    			
            	    		$(".container.marketing .rating-results").append(html);
            	 
            	    		// Load and Insert further information
            	    		insertMovieInfo(movieInfo[4], "movie_"+movieID, movieID);
            	    		$('.stars_'+movieID).barrating({
            	    	        theme: 'fontawesome-stars',
            	    	        initialRating: parseFloat(movieInfo[2])%5, // dev purpose only (mod 5)
            	    	        readonly: true
            	    	      });
            	    		
            	    		item_counter++;
            	    	});
                    	
                    	// Fix bootstrap ordering bug
                    	fix_boxHeight(".container.marketing .rating-results .col-lg-4");
                    },
                });
        	});
        }
	});
}



/* HTML GENERATION ONLY */

function html_rating_stars(id) {
	/* HTML FOR RATING STARS */
	html = '<select class="stars_'+id+'">';
	html += '<option value="1">1</option>';
	html += '<option value="2">2</option>';
	html += '<option value="3">3</option>';
	html += '<option value="4">4</option>';
	html += '<option value="5">5</option>';
	html += '</select>';
	return html;
}
   

function html_modalMovie(movieID, movieInfoMap) {
	/* HTML FOR MOVIE-INFO (IMDB-INFO) MODAL */
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
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	
	return html;
}

function html_loading() {
	/* HTML FOR LOADING BAR */
	var html = '<div class="loading-container">';
	html += '<div class="loading-label">';
	html += '<h1>loading data &middot; please wait...</h1>';
	for (var i=0; i<100; i++) {
		html += '<div class="loading-pixels"></div>';
	}
	html += '</div>';
	html += '</div>';
	
	return html;
}