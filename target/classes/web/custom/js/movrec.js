$(document).ready(function() {
    var base_url = "http://localhost:8080/MovRecTwo/rest/rec/"
	
	$.ajax({
        url: base_url+"getMoviesForRating"
    }).then(function(data) {
       $('.greeting-id').append(data.id);
       $('.greeting-content').append(data.content);
    });
	
	
});