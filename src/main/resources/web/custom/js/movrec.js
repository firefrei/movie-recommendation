$(document).ready(function() {
    var base_url = "http://localhost:8080/MovRecTwo/rest/rec/"
	
	$.ajax({
		dataType: 'json',
        url: base_url+"getMoviesForRating"
    }).then(function(data) {
    	
    	jQuery.each(data, function(movieID, movieInfo) {
    	    // do something with `item` (or `this` is also `item` if you like)
    		var html = '<div class="col-lg-4"><img class="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140">';
    			html += '<h2>'+ movieInfo[0] +'</h2>';
    			html += '<p>'+ movieInfo[1] +'</p>';
    			html += '<p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>';
    			html += '</div><!-- /.col-lg-4 -->';    			
    			
    		$(".container.marketing .row").append(html)

    	});
    	

    });
	
	
});