package com.movrec;


import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;
import java.util.Set;
import java.util.regex.Pattern;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.mllib.recommendation.ALS;
import org.apache.spark.mllib.recommendation.MatrixFactorizationModel;
import org.apache.spark.mllib.recommendation.Rating;

import akka.japi.Pair;


public class Rec {

	public static HashMap<Integer,List<String>> movies;
	public static HashMap<Integer,List<String>> links;
	public static JavaRDD<Rating> ratings;
	public static List<Integer> movieIds;
	public static JavaSparkContext sc;
	public static Map<Integer,Double> movieRatings;
	public static Map<String,List<Integer>> genres;
	
	public static void main(String[] args) {
		
		// SETUP
		String basepath = "/home/bar/uni/master/s2/Big_Data_Praktikum/";
		
		// Initialize SparkContext
	    SparkConf conf = new SparkConf().setAppName("Movie Recommendation");
	    conf.setMaster("local[2]");
	    sc = new JavaSparkContext(conf);

	    // Load and parse the data
	    movieIds = new ArrayList<Integer>();
	    movies = parseCSVFile(basepath + "ml-latest-small/movies.csv");
	    links = parseCSVFile(basepath + "ml-latest-small/links.csv");
	    ratings = parseRatings(basepath+"ml-latest-small/ratings.csv", sc);
	    movieRatings = generateMovieRatings(basepath + "ml-latest-small/ratings.csv");
	    
	    
	    // Close the SparkContext
	    System.out.println("Done");
	    sc.close();
	  }
	
	public Rec() {
		
		// Spark setup
	    SparkConf conf = new SparkConf().setAppName("Movie Recommendation");
	    conf.setMaster("local[4]");
	    sc = new JavaSparkContext(conf);

	    // Load and parse the data
	    movieIds = new ArrayList<Integer>();
	    String movies_csv = getClass().getClassLoader().getResource("ml-latest-small/movies.csv").getFile();
	    movies = parseCSVFile(movies_csv);
	    links = parseCSVFile(getClass().getClassLoader().getResource("ml-latest-small/links.csv").getFile());
	    ratings = parseRatings(getClass().getClassLoader().getResource("ml-latest-small/ratings.csv").getFile(), sc);
	    movieRatings = generateMovieRatings(getClass().getClassLoader().getResource("ml-latest-small/ratings.csv").getFile());
	    genres = parseGenres(movies_csv);

	}
	  
		// Parse the given CSV file and return a JavaRDD containing the ratings.
		public static JavaRDD<Rating> parseRatings(String dataPath, JavaSparkContext sc) {
			JavaRDD<String> input = sc.textFile(dataPath);
			JavaRDD<Rating> rating = input.map(
					new Function<String, Rating>() {
						public Rating call(String s) {
							String[] sarray = s.split(",");
							return new Rating(Integer.parseInt(sarray[0]), Integer.parseInt(sarray[1]), 
									Double.parseDouble(sarray[2]));
						}
					}
					);
			return rating;
		}
		
		// Parse the given CSV file and returns a HashMap of the content.
		public static HashMap<Integer,List<String>> parseCSVFile(String pathToCSV) {
			HashMap<Integer,List<String>> movieInformation = new HashMap<Integer,List<String>>();
		    
			BufferedReader br = null;
			String line = "";
			
			try {
				br = new BufferedReader(new FileReader(pathToCSV));
				while ((line = br.readLine()) != null) {
					String[] movie = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)", -1);
					int movieId = Integer.parseInt(movie[0]);
					movieIds.add(movieId);

					List<String> temp = Arrays.asList(movie);
					List<String> information = new ArrayList<String>(temp);
					information.remove(0);
					movieInformation.put(movieId, information);
				}

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				if (br != null) {
					try {
						br.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
			return movieInformation;
		}
		
		// Returns n random movies + movie information.
		public HashMap<Integer,List<String>> getRandomMovies(int n) {
			HashMap<Integer,List<String>> randomMovies = new HashMap<Integer,List<String>>();
			Random generator = new Random();
			    for (int i = 1; i<= n; ++i){			    	
			    	int key = movieIds.get(generator.nextInt(movieIds.size()-1));
			    	List<String> randMovie = (List<String>) movies.get(key);
			    	List<String> imdId = links.get(key);
			    	randMovie.add(imdId.get(0));
			    	Double rating = (Double)movieRatings.get(key);
			    	randMovie.add(rating.toString());
			    	randomMovies.put(key, randMovie);
			    }
			return randomMovies;
		}

		// Returns n random movies + movie information.
		public HashMap<Integer,List<String>> getRatingMovies(int n) {
			HashMap<Integer,List<String>> ratingMovies = new HashMap<Integer,List<String>>();
			Random generator = new Random();
			    for (int i = 1; i<= n; ++i){			    	
			    	int key = movieIds.get(generator.nextInt(movieIds.size()-1));
			    	List<String> randMovie = (List<String>) movies.get(key);
			    	List<String> imdId = links.get(key);
			    	randMovie.add(imdId.get(0));
			    	ratingMovies.put(key, randMovie);
			    }
			return ratingMovies;
		}

		// Add User ratings to the data set. key:movieId, value:rating
		// Returns recommended movies. key:movieId, value:movietitle,genre,rating,imdId
		public Map<Integer,List<String>> addUserRatings(Map<String,Double> userRatings, int n){
			for (Entry<String, Double> entry: userRatings.entrySet()) {
				Integer myInt = Integer.parseInt(entry.getKey());
				Double myDouble = entry.getValue();
				
				
				Rating rating = new Rating(0,myInt, myDouble);
				List<Rating> ratingList = Arrays.asList(rating);
				JavaRDD<Rating> userRating = sc.parallelize(ratingList);
				ratings = ratings.union(userRating);
			}

			// Call recommendation function to get n recommended movies
			Rating[] recommendedMovies = recommendMovies(n);
			Map<Integer,List<String>> products = new HashMap<Integer, List<String>>();
			
			// Add movie informations to the recommended movies.
			for(int i=0; i<recommendedMovies.length; ++i) {
				String ranking = recommendedMovies[i].toString();
				String delims = "[,]";
				String[] tokens = ranking.split(delims);
				int key = Integer.parseInt(tokens[1]);
				List<String> movinf = movies.get(key);
				String rating = movieRatings.get(key).toString();
				movinf.add(rating);
				movinf.add(tokens[2]);
				List<String> imdId = links.get(key);
				movinf.add(imdId.get(0));
				products.put(key, movinf);
			}
			return products;
		}

		// Recommend n movies.
		public Rating[] recommendMovies(int n) {
			
			// Build the recommendation model using ALS
		    int rank = 10;
		    int numIterations = 20;
		    MatrixFactorizationModel model = ALS.train(JavaRDD.toRDD(ratings), rank, numIterations, 0.01);
		    
			// Recommend n products to user 0
		    Rating[] userProducts = model.recommendProducts(0,n);
		    return userProducts;
		}
		// Generates the ratings for all movies.
		public static Map<Integer,Double> generateMovieRatings(String pathToData) {
			
			Map<Integer,Pair<Integer,Double>> movieRatings = new HashMap<Integer,Pair<Integer,Double>>();
			
			BufferedReader br = null;
			String line = "";
			
			try {
				br = new BufferedReader(new FileReader(pathToData));
				while ((line = br.readLine()) != null) {
					String[] movie = line.split(",");
					int movieId = Integer.parseInt(movie[1]);
					double rating = Double.parseDouble(movie[2]);
					
					// Check if genre is allready in the map.
					if(movieRatings.containsKey(movieId)) {
						Pair<Integer,Double> oldPair = movieRatings.get(movieId);
						Pair<Integer,Double> newPair = new Pair<Integer,Double>(oldPair.first()+1,oldPair.second()+rating);
						movieRatings.put(movieId, newPair);
					} else {
						Pair<Integer,Double> newPair = new Pair<Integer,Double>(1,rating);
						movieRatings.put(movieId, newPair);
					}
				}

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				if (br != null) {
					try {
						br.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
			// Compute the rating of each movie
			Map<Integer,Double> movRating = new HashMap<Integer,Double>();
			Iterator<Entry<Integer, Pair<Integer, Double>>> it = movieRatings.entrySet().iterator();
			while (it.hasNext()) {
				Map.Entry<Integer, Pair<Integer,Double>> entry = (Map.Entry<Integer, Pair<Integer,Double>>)it.next();
				Double rating = entry.getValue().second()/entry.getValue().first();
				movRating.put(entry.getKey(), rating);
			}
			return movRating;
		}
		
		// Parse all genres of the given CSV file. key:genre value:list of the movieIds
		public static Map<String,List<Integer>> parseGenres(String pathToCSV) {
			Map<String,List<Integer>> tempGenres = new HashMap<String,List<Integer>>();
		    
			BufferedReader br = null;
			String line = "";
			
			try {
				br = new BufferedReader(new FileReader(pathToCSV));
				while ((line = br.readLine()) != null) {
					String[] movie = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)", -1);
					Integer movieId = Integer.parseInt(movie[0]);
					String[] genreList = movie[2].split(Pattern.quote("|"),-1);
					String genre;
					
					for(int i=0; i<genreList.length; i++) {
						genre = genreList[i];
						if(tempGenres.containsKey(genre)) {
							List<Integer> currentGenreList = (List<Integer>)tempGenres.get(genre);
							currentGenreList.add(movieId);
							tempGenres.replace(genre, currentGenreList);
						} else {
							List<Integer> newGenreList = new ArrayList<Integer>(movieId);
							tempGenres.put(genre, newGenreList);
						}
					}
				}

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				if (br != null) {
					try {
						br.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
			return tempGenres;
		}
		
		// Returns a set of all genres.
		public Set<String> getGenres() {
			return genres.keySet(); 
		}
		
		// Returns all movies of the given genre.
		public Map<Integer,List<String>> getMoviesByGenre(String genre, Integer n) {
			Map<Integer,List<String>> moviesByGenre = new HashMap<Integer,List<String>>();
			List<Integer> movieIds = genres.get(genre);
			Random generator = new Random();
			    for (int i = 1; i<= n; ++i){			    	
			    	int key = movieIds.get(generator.nextInt(movieIds.size()-1));
			    	List<String> movInf = movies.get(key);
					List<String> imdbId = links.get(key);
					movInf.add(imdbId.get(0));
					moviesByGenre.put(key, movInf);
			    }
			return moviesByGenre;
		}
		
		public void close() {
			sc.close();
		}
}
