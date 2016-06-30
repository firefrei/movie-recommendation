package com.movrec;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import com.movrec.Rec;

//import com.sun.xml.bind.v2.schemagen.xmlschema.List;

@Path("/rec")
public class Web {
	Rec recModel;
	
	public Web() {
		recModel = new Rec();
	}
	
	@GET  
	@Path("/hj")
	public Response sayXMLHello() {  
		String output =  "<?xml version=\"1.0\"?>" + "<hello> Hello Jersey" + "</hello>";  
		return Response.status(200).entity(output).build();
	}  
	
	@GET  
	@Path("/json")
	public Response jsonTest() {
		ArrayList<String> foo = new ArrayList<String>();
		foo.add("A");
		foo.add("B");
		foo.add("C");

		String json = new Gson().toJson(foo );
		
		return Response.status(200).entity(json).build();
	}

	@GET  
	@Path("/getMoviesForRating")
	public Response getMoviesForRating() {
		/*  
		 * Movie-ID, Movie-Title, -Genre, IMDB-ID,  */

		/*
		// Returns n movies to rate. key:movieId, value:movietitle,genre,imdbId*/
		System.out.println("getMoviesForRating");
		Map<Integer,List<String>> movies = recModel.getRatingMovies(5);
		System.out.println("->Gotmovies");
		String json = new Gson().toJson(movies);
		
		// CALL SIMON 
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
		
		-CALL SIMON -> returns result and backup-items (if duplicates)
		 -> Pass over Dict/Map with Key:MovieId and Value:rating
		- CHECK HERE: duplicates -> remove them if needed
		
		Rec recModel = new Rec();
		Map<Integer,Double> userRatings = new HashMap();
		Map<Integer,List<String>> recommendations = recModel.addUserRatings(userRatings);*/
		
		Map<Integer, Double> userRatings = new HashMap<Integer, Double>();
		userRatings = new Gson().fromJson(ratingData, userRatings.getClass());
		Map<Integer,List<String>> recommendations = recModel.addUserRatings(userRatings);
		
		
		String json = new Gson().toJson(recommendations);
		
		return Response.status(200).entity(json).build();
	}
	
	
	@GET  
	@Path("/getTop20Movies")
	public Response getTop20Movies() {
		/*  
		 * Movie-ID, Movie-Title, -Genre, IMDB-ID,  */
		ArrayList<String> foo = new ArrayList<String>();
		foo.add("A");
		foo.add("B");
		foo.add("C");

		String json = new Gson().toJson(foo );
		
		// CALL SIMON 
		// Not implemented.
		// Rec recModel = new Rec();
		//recModel.getTopMovies(20);
		// -> Get Dict/Map with Key:MovieID and Value:List with other Attributes (including ranking!)
		// -> Pass over Int:Number of wanted movies
		
		return Response.status(200).entity(json).build();
	}
	
	
//	@GET  
//	@Path("/triggerTraining")
//	public Response triggerTraining() {
//		/*  
//		 * Movie-ID, Movie-Title, -Genre, IMDB-ID,  */
//		ArrayList<String> foo = new ArrayList<String>();
//		foo.add("A");
//		foo.add("B");
//		foo.add("C");
//
//		String json = new Gson().toJson(foo );
//		
//		// CALL SIMON 
//		// -> Get Dict/Map with Key:MovieID and Value:List with other Attributes (including ranking!)
//		// -> Pass over Int:Number of wanted movies
//		
//		return Response.status(200).entity(json).build();
//	}
//	
	
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
