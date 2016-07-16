package com.movrec;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;

import com.movrec.Rec;


@Path("/rec")
public class Web {
	Rec recModel;
	
	@Context ServletContext context;
	
	@GET  
	@Path("/getRandomMovies")
	public Response getRandomMovies() {
		/*  
		 * Movie-ID, Movie-Title, -Genre, IMDB-ID, Rating  */

		/*
		 
		// Returns n movies to rate. key:movieId, value:movietitle,genre,imdbId*/
		
		recModel = (Rec) context.getAttribute("recModel");
		
		Map<Integer,List<String>> movies = recModel.getRandomMovies(9);
		String json = new Gson().toJson(movies);
		
		// -> Get Dict/Map with Key:MovieID and Value:List with other Attributes
		// -> Pass over Int:Number of wanted movies
		
		return Response.status(200).entity(json).build();
	}
	

	@GET  
	@Path("/getMoviesForRating")
	public Response getMoviesForRating() {
		/*  
		 * Movie-ID, Movie-Title, -Genre, IMDB-ID,  */

		/*
		// Returns n movies to rate. key:movieId, value:movietitle,genre,imdbId*/
		recModel = (Rec) context.getAttribute("recModel");
		
		System.out.println("getMoviesForRating");
		Map<Integer,List<String>> movies = recModel.getRatingMovies(10);
		System.out.println("->Gotmovies");
		String json = new Gson().toJson(movies);
		
		// -> Get Dict/Map with Key:MovieID and Value:List with other Attributes
		// -> Pass over Int:Number of wanted movies
		
		return Response.status(200).entity(json).build();
	}

	@POST  
	@Path("/setMoviesForRating")
	@Produces(MediaType.TEXT_HTML)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public Response setMoviesForRating(@FormParam("ratingData") String ratingData
		    ) {
		/* IN: Movie-ID, Rating (0.5-5), ratedMovieIds
		 * OUT:  
		 * 
		
		- returns result and backup-items (if duplicates)
		 -> Pass over Dict/Map with Key:MovieId and Value:rating
		- CHECK HERE: duplicates -> remove them if needed
		*/
		
		recModel = (Rec) context.getAttribute("recModel");
		
		Map<String, Double> userRatings = new HashMap<String, Double>();
		userRatings = new Gson().fromJson(ratingData, userRatings.getClass());
		Map<Integer,List<String>> recommendations = recModel.addUserRatings(userRatings,6);
		
		String json = new Gson().toJson(recommendations);
		
		return Response.status(200).entity(json).build();
	}
	
	
	@GET  
	@Path("/getAllGenres")
	public Response getAllGenres() {
		/*  
		 * Movie-ID, Movie-Title, -Genre, IMDB-ID,  */
		
		recModel = (Rec) context.getAttribute("recModel");
		
		Set<String> genres = recModel.getGenres();
		String json = new Gson().toJson(genres);
		
		return Response.status(200).entity(json).build();
	}
	
	
	@POST  
	@Path("/getMoviesForGenre")
	@Produces(MediaType.TEXT_HTML)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public Response getMoviesForGenre(@FormParam("genre") String genre
		    ) {
		/* IN: Movie-ID, Rating (0.5-5), ratedMovieIds
		 * OUT:  
		 * 
		
		 - returns movies in getMoviesForRating format
		 -> Pass over String with genre name
	*/
		
		recModel = (Rec) context.getAttribute("recModel");
	
		Map<Integer,List<String>> movies = recModel.getMoviesByGenre(genre, 10);
		String json = new Gson().toJson(movies);
		
		return Response.status(200).entity(json).build();
	}
	

//	@GET
//	@Path("/{parameter}")
//	public Response responseMsg( @PathParam("parameter") String parameter,
//			@DefaultValue("Nothing to say") @QueryParam("value") String value) {
//
//		String output = "Hello from: " + parameter + " : " + value;
//
//		return Response.status(200).entity(output).build();
//
//	}
}
