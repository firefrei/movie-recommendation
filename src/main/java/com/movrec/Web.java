package com.movrec;

import java.util.ArrayList;

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

import com.sun.xml.bind.v2.schemagen.xmlschema.List;

@Path("/hello")
public class Web {
	
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
		ArrayList<String> foo = new ArrayList<String>();
		foo.add("A");
		foo.add("B");
		foo.add("C");

		String json = new Gson().toJson(foo );
		
		// CALL SIMON 
		// -> Get Dict/Map with Key:MovieID and Value:List with other Attributes
		// -> Pass over Int:Number of wanted movies
		
		return Response.status(200).entity(json).build();
	}

	@POST  
	@Path("/setMoviesForRating")
	@Produces(MediaType.TEXT_HTML)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public Response setMoviesForRating(@FormParam("movieID") String movieID,
		      @FormParam("rating") Double rating,
		      @FormParam("ratedMovieIds") String ratedMovieIds
		    ) {
		/* IN: Movie-ID, Rating (0.5-5), ratedMovieIds
		 * OUT:  
		 * */
	
		
		// CALL SIMON -> returns result and backup-items (if duplicates)
		// -> Pass over Dict/Map with Key:MovieId and Value:rating
		// CHECK HERE: duplicates -> remove them if needed
		
		return Response.status(200).entity("").build();
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
