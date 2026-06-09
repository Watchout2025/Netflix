import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PlayerScreen({ route, navigation }) {
  const { id, mediaType } = route.params;
  const [loading, setLoading] = useState(true);

  // The base player URL using the Videasy proxy mentioned in the original code
  // For TV Shows, it defaults to Season 1, Episode 1. A season selector can be added later.
  const playUrl = mediaType === 'movie' 
    ? `https://player.videasy.to/movie/${id}`
    : `https://player.videasy.to/tv/${id}/1/1`; 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      
      <View style={styles.webviewContainer}>
        <WebView 
          source={{ uri: playUrl }}
          style={styles.webview}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadEnd={() => setLoading(false)}
        />
        
        {/* Close Button overlay */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#e50914" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 5,
  }
});
