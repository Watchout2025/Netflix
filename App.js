import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  StatusBar, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';

const MOVIES = [
  { id: 1, title: 'Stranger Things', image: 'https://image.tmdb.org/t/p/w500/x2LSRm21uTExHiBqSdy87P9p1pE.jpg' },
  { id: 2, title: 'The Witcher', image: 'https://image.tmdb.org/t/p/w500/7vjaCdS6In6KOT2oY6vYvTvQYOk.jpg' },
  { id: 3, title: 'Money Heist', image: 'https://image.tmdb.org/t/p/w500/reEMJA1uzpG3SZ0KGv7GKE97pU.jpg' },
  { id: 4, title: 'The Crown', image: 'https://image.tmdb.org/t/p/w500/v9IPrP5vI6f08X33L50KUnC1C92.jpg' },
  { id: 5, title: 'Bridgerton', image: 'https://image.tmdb.org/t/p/w500/luoKpgVj365hwzM0PSi69q9v9An.jpg' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
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

      <ScrollView style={styles.scrollView}>
        {/* Featured Hero */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://image.tmdb.org/t/p/original/6tfT0Znt7cwzWJpL0pSnNpAuiZ.jpg' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>SQUID GAME</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.listButton}>
                <Text style={styles.listButtonText}>+ My List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Movie Rows */}
        <MovieRow title="Trending Now" movies={MOVIES} />
        <MovieRow title="Popular on Netflix" movies={MOVIES.slice().reverse()} />
        <MovieRow title="New Releases" movies={MOVIES} />
        
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const MovieRow = ({ title, movies }) => (
  <View style={styles.rowContainer}>
    <Text style={styles.rowTitle}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {movies.map(movie => (
        <TouchableOpacity key={movie.id} style={styles.movieCard}>
          <Image source={{ uri: movie.image }} style={styles.movieImage} />
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
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 40,
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
    height: 500,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 10,
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
    paddingVertical: 10,
    borderRadius: 4,
  },
  listButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rowContainer: {
    paddingLeft: 20,
    marginBottom: 30,
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
    width: 120,
    height: 180,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
});
