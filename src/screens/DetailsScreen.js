import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';

const { width } = Dimensions.get('window');

const API_BASE = 'https://db.videasy.net/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

export default function DetailsScreen({ route, navigation }) {
  const { id, mediaType } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id, mediaType]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${mediaType}/${id}?append_to_response=credits,images,recommendations,runtime,first_air_date,release_date`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching details:", error);
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

  if (!data) return null;

  const title = data.title || data.name;
  const releaseYear = (data.release_date || data.first_air_date) ? new Date(data.release_date || data.first_air_date).getFullYear() : 'N/A';
  const runtime = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : (data.number_of_seasons ? `${data.number_of_seasons} Seasons` : '');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView bounces={false}>
        {/* Backdrop */}
        <View style={styles.backdropContainer}>
          <Image 
            source={{ uri: `${BACKDROP_BASE}${data.backdrop_path || data.poster_path}` }} 
            style={styles.backdrop} 
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{releaseYear}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{data.adult ? '18+' : 'U/A 16+'}</Text>
            </View>
            <Text style={styles.metaText}>{runtime}</Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => navigation.navigate('Player', { 
              id, 
              mediaType, 
              title, 
              releaseYear 
            })}
          >
            <Text style={styles.playButtonText}>▶ Play</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadButtonText}>⬇ Download</Text>
          </TouchableOpacity>

          <Text style={styles.overview}>{data.overview}</Text>

          {/* Cast */}
          {data.credits?.cast && (
            <View style={styles.castSection}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <Text style={styles.castText}>
                {data.credits.cast.slice(0, 5).map(c => c.name).join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* Recommendations */}
        {data.recommendations?.results?.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>More Like This</Text>
            <View style={styles.grid}>
              {data.recommendations.results.slice(0, 6).map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.gridItem}
                  onPress={() => navigation.push('Details', { id: item.id, mediaType: item.media_type || mediaType })}
                >
                  <Image 
                    source={{ uri: `${IMAGE_BASE}${item.poster_path}` }} 
                    style={styles.gridImage} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropContainer: {
    width: '100%',
    height: width * 0.6,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  metaText: {
    color: '#bcbcbc',
    fontSize: 14,
  },
  ratingBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  playButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#333',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overview: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  castSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  castText: {
    color: '#bcbcbc',
    fontSize: 13,
  },
  recommendationsSection: {
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  gridItem: {
    width: (width - 50) / 3,
    aspectRatio: 2/3,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});
