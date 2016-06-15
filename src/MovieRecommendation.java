
import org.apache.spark.api.java.*;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.mllib.recommendation.ALS;
import org.apache.spark.mllib.recommendation.MatrixFactorizationModel;
import org.apache.spark.mllib.recommendation.Rating;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;

public class MovieRecommendation {
  
  public static void main(String[] args) {
	
    SparkConf conf = new SparkConf().setAppName("Movie Recommendation");
    conf.setMaster("local[2]");	
    JavaSparkContext sc = new JavaSparkContext(conf);

    // Load and parse the data
    String path = "/home/simon/bigDataPraktikum/ml-latest/ratings1.csv";
    JavaRDD<Rating> ratings = parseRatings(path, sc);
    
    System.out.println("Data-Set:" +ratings.count());
   
    // Add user ratings to the data set
    JavaRDD<Rating> userRating = parseRatings("/home/simon/bigDataPraktikum/ml-latest-small/userrating.csv", sc);
	ratings = ratings.union(userRating);
    
/*    // Print all rating tuples.
    Iterator<Rating> it = ratings.toLocalIterator();
    while (it.hasNext()) {
    	System.out.println(it.next());
    }*/
    
    System.out.println("Data-Set + User-Rating:" +ratings.count());
    
    // Build the recommendation model using ALS
    int rank = 10;
    int numIterations = 10;
    MatrixFactorizationModel model = ALS.train(JavaRDD.toRDD(ratings), rank, numIterations, 0.01);
    
    // Recommend 5 products to user 0
    Rating[] userProducts = model.recommendProducts(0,5);
    
    // Print recommended products
    for(int i=0; i<userProducts.length; ++i) {
    	System.out.println(userProducts[i].toString());
    }
    
    System.out.println("Done");
    sc.close();
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
}