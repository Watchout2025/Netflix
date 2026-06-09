import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  StatusBar, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const API_BASE = 'https://db.videasy.net/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

export default function HomeScreen({ navigation }) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const movieRes = await fetch(`${API_BASE}/trending/movie/week`);
      const movieData = await movieRes.json();
      
      const tvRes = await fetch(`${API_BASE}/trending/tv/week`);
      const tvData = await tvRes.json();

      setTrendingMovies(movieData.results || []);
      setTrendingTV(tvData.results || []);
      
      if (movieData.results && movieData.results.length > 0) {
        const randomIdx = Math.floor(Math.random() * Math.min(movieData.results.length, 5));
        setFeaturedMovie(movieData.results[randomIdx]);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  const openDetails = (id, mediaType) => {
    navigation.navigate('Details', { id, mediaType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' }} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <TouchableOpacity><Text style={styles.headerLink}>TV Shows</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.headerLink}>Movies</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.headerLink}>Categories</Text></TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} bounces={false}>
        {featuredMovie && (
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => openDetails(featuredMovie.id, featuredMovie.media_type || 'movie')}
            style={styles.heroContainer}
          >
            <Image 
              source={{ uri: `${BACKDROP_BASE}${featuredMovie.backdrop_path}` }} 
              style={styles.heroImage} 
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{featuredMovie.title || featuredMovie.name}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.playButton} onPress={() => openDetails(featuredMovie.id, featuredMovie.media_type || 'movie')}>
                  <Text style={styles.playButtonText}>▶ Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listButton}>
                  <Text style={styles.listButtonText}>+ My List</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <MovieRow title="Trending Movies" movies={trendingMovies} onPress={openDetails} mediaType="movie" />
        <MovieRow title="Trending TV Shows" movies={trendingTV} onPress={openDetails} mediaType="tv" />
        <MovieRow title="Top Rated" movies={[...trendingMovies].reverse()} onPress={openDetails} mediaType="movie" />
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const MovieRow = ({ title, movies, onPress, mediaType }) => (
  <View style={styles.rowContainer}>
    <Text style={styles.rowTitle}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {movies.map(movie => (
        <TouchableOpacity 
            key={movie.id} 
            style={styles.movieCard}
            onPress={() => onPress(movie.id, mediaType)}
        >
          <Image 
            source={{ uri: `${IMAGE_BASE}${movie.poster_path}` }} 
            style={styles.movieImage} 
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  logo: {
    width: 80,
    height: 40,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  headerLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    width: '100%',
    height: width * 1.5,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 20,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    textTransform: 'uppercase',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 35,
    paddingVertical: 8,
    borderRadius: 4,
  },
  playButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  listButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rowContainer: {
    paddingLeft: 20,
    marginBottom: 25,
  },
  rowTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    paddingRight: 20,
  },
  movieCard: {
    width: 110,
    height: 160,
    marginRight: 10,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
});
