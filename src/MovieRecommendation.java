import scala.Tuple2;

import org.apache.spark.api.java.*;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.VoidFunction;
import org.apache.spark.mllib.recommendation.ALS;
import org.apache.spark.mllib.recommendation.MatrixFactorizationModel;
import org.apache.spark.mllib.recommendation.Rating;

import java.util.Iterator;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;

public class MovieRecommendation {
  public static void main(String[] args) {
    SparkConf conf = new SparkConf().setAppName("Movie Recommendation");
    conf.setMaster("local[2]");
    JavaSparkContext sc = new JavaSparkContext(conf);

    // Load and parse the data
    String path = "/Users/mat/Downloads/ml-10M100K/ratings.dat";
    JavaRDD<String> data = sc.textFile(path);
    JavaRDD<Rating> ratings = data.map(
      new Function<String, Rating>() {
        public Rating call(String s) {
          String[] sarray = s.split("::");
          return new Rating(Integer.parseInt(sarray[0]), Integer.parseInt(sarray[1]), 
                            Double.parseDouble(sarray[2]));
        }
      } 
    );
    
    ratings.foreach(new VoidFunction<Rating>() {

		@Override
		public void call(Rating arg0) throws Exception {
			// TODO Auto-generated method stub
	        System.out.println(arg0);
		}
    });

    // Build the recommendation model using ALS
    int rank = 10;
    int numIterations = 20;
    MatrixFactorizationModel model = ALS.train(JavaRDD.toRDD(ratings), rank, numIterations, 0.01); 

    // Evaluate the model on rating data
    JavaRDD<Tuple2<Object, Object>> userProducts = ratings.map(
      new Function<Rating, Tuple2<Object, Object>>() {
        public Tuple2<Object, Object> call(Rating r) {
          return new Tuple2<Object, Object>(r.user(), r.product());
        }
      }
    );
    JavaPairRDD<Tuple2<Integer, Integer>, Double> predictions = JavaPairRDD.fromJavaRDD(
      model.predict(JavaRDD.toRDD(userProducts)).toJavaRDD().map(
        new Function<Rating, Tuple2<Tuple2<Integer, Integer>, Double>>() {
          public Tuple2<Tuple2<Integer, Integer>, Double> call(Rating r){
            return new Tuple2<Tuple2<Integer, Integer>, Double>(
              new Tuple2<Integer, Integer>(r.user(), r.product()), r.rating());
          }
        }
    ));
    JavaRDD<Tuple2<Double, Double>> ratesAndPreds = 
      JavaPairRDD.fromJavaRDD(ratings.map(
        new Function<Rating, Tuple2<Tuple2<Integer, Integer>, Double>>() {
          public Tuple2<Tuple2<Integer, Integer>, Double> call(Rating r){
            return new Tuple2<Tuple2<Integer, Integer>, Double>(
              new Tuple2<Integer, Integer>(r.user(), r.product()), r.rating());
          }
        }
    )).join(predictions).values();
    double MSE = JavaDoubleRDD.fromRDD(ratesAndPreds.map(
      new Function<Tuple2<Double, Double>, Object>() {
        public Object call(Tuple2<Double, Double> pair) {
          Double err = pair._1() - pair._2();
          return err * err;
        }
      }
    ).rdd()).mean();
    System.out.println("Mean Squared Error = " + MSE);
    
    // Save and load model
    model.save(sc.sc(), "/Users/mat/Downloads/ml-latest/tmp/myCollaborativeFilter");
    MatrixFactorizationModel sameModel = MatrixFactorizationModel.load(sc.sc(),
      "/Users/mat/Downloads/ml-latest/tmp/myCollaborativeFilter");
  }
}