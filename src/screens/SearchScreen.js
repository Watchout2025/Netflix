import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_BASE = 'https://db.videasy.net/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        performSearch(query.trim());
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search/multi?query=${encodeURIComponent(searchTerm)}&language=en-US&page=1`);
      const data = await res.json();
      
      if (data.results) {
        // Filter out people, keep only movies and TV shows that have posters
        const filtered = data.results.filter(
          item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
        );
        // Sort by popularity so better results show up first
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        
        setResults(filtered);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.push('Details', { id: item.id, mediaType: item.media_type })}
      >
        <Image 
          source={{ uri: `${IMAGE_BASE}${item.poster_path}` }} 
          style={styles.image}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title || item.name}
          </Text>
          <Text style={styles.cardType}>
            {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
          </Text>
          {item.release_date || item.first_air_date ? (
            <Text style={styles.cardYear}>
              {new Date(item.release_date || item.first_air_date).getFullYear()}
            </Text>
          ) : null}
        </View>
        <View style={styles.playIconContainer}>
            <Ionicons name="play-circle-outline" size={32} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search movies, TV shows..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
          keyboardAppearance="dark"
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e50914" />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
        />
      ) : query.trim() !== '' ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsText}>No results found for "{query}"</Text>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Ionicons name="film-outline" size={64} color="#333" />
          <Text style={styles.noResultsText}>Find your next favorite movie</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    margin: 15,
    marginTop: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    color: '#888',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 150,
  },
  cardInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardType: {
    color: '#e50914',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardYear: {
    color: '#888',
    fontSize: 12,
  },
  playIconContainer: {
    padding: 15,
  }
});
