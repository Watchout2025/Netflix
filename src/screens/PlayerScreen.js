import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

// Helper function from original code
function formatTitleForHls(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

// Emulate getRegionBasedPlayerBaseUrl
async function getRegionBasedPlayerBaseUrl() {
  return "https://www.watchout.fun/player"; 
}

const RPM_WORKER_BASE_URL = 'https://report.bingeoutofficial.workers.dev/';

export default function PlayerScreen({ route, navigation }) {
  // We expect title, releaseYear, seasonNumber, episodeNumber passed in params if applicable
  const { id, mediaType, title, releaseYear, seasonNumber, episodeNumber } = route.params;
  const [loading, setLoading] = useState(true);
  const [playUrl, setPlayUrl] = useState(null);

  useEffect(() => {
    resolvePlaybackUrl();
  }, [id, mediaType]);

  const resolvePlaybackUrl = async () => {
    setLoading(true);
    let resolvedUrl = null;

    if (mediaType === 'movie') {
      resolvedUrl = await resolveMovieUrl(id, title, releaseYear);
    } else if (mediaType === 'tv') {
      // Default to S1 E1 if not provided (e.g. from Home screen click)
      const s = seasonNumber || 1;
      const e = episodeNumber || 1;
      resolvedUrl = await resolveTvUrl(id, title, s, e);
    }

    if (resolvedUrl) {
      setPlayUrl(resolvedUrl);
    } else {
      Alert.alert("Error", "Could not find a working stream for this title.");
      navigation.goBack();
    }
  };

  const resolveMovieUrl = async (movieId, movieTitle, year) => {
    let link = null;

    // 1. Try GitHub (Primary)
    try {
      const githubRes = await fetch(`https://raw.githubusercontent.com/Watchout2025/api/refs/heads/main/hls/movie/${movieId}`);
      if (githubRes.ok) {
        const fileCode = (await githubRes.text()).trim();
        if (fileCode) {
          link = `https://watchout-player.netlify.app/movie/${movieId}`;
          console.log("GitHub HLS loaded");
          return link;
        }
      }
    } catch (err) { console.log(err); }

    // 2. Try RPM Worker
    if (!link && movieTitle && year) {
      const formattedTitle = formatTitleForHls(movieTitle);
      const dottedTitle = `${formattedTitle}.${year}`;
      try {
        const rpmRes = await fetch(`${RPM_WORKER_BASE_URL}?title=${encodeURIComponent(dottedTitle)}`);
        const rpmData = await rpmRes.json();
        if (rpmData?.result?.files?.length > 0) {
          const fileCode = rpmData.result.files[0].file_code;
          const playerBase = await getRegionBasedPlayerBaseUrl();
          link = `${playerBase}/#${fileCode}&api=all`;
          return link;
        }
      } catch (err) { console.log(err); }
    }

    // 3. Fallback to Videasy
    if (!link) {
      link = `https://player.videasy.to/movie/${movieId}`;
    }

    return link;
  };

  const resolveTvUrl = async (seriesId, seriesName, seasonNum, episodeNum) => {
    let link = null;
    const formattedSeason = seasonNum < 10 ? `s0${seasonNum}` : `s${seasonNum}`;
    const formattedEpisode = episodeNum < 10 ? `e0${episodeNum}` : `e${episodeNum}`;

    // 1. GitHub
    try {
      const githubRes = await fetch(`https://raw.githubusercontent.com/Watchout2025/api/refs/heads/main/hls/tv/${seriesId}/S${seasonNum}.json`);
      if (githubRes.ok) {
        const data = await githubRes.json();
        if (data[episodeNum]) {
          link = `https://watchout-player.netlify.app/tv/${seriesId}/S${seasonNum}/E${episodeNum}`;
          return link;
        }
      }
    } catch (err) { console.log(err); }

    // 2. RPM Worker
    if (!link && seriesName) {
      const formattedTitle = formatTitleForHls(seriesName);
      const dottedTitle = `${formattedTitle}.${formattedSeason}${formattedEpisode}`;
      try {
        const rpmRes = await fetch(`${RPM_WORKER_BASE_URL}?title=${encodeURIComponent(dottedTitle)}`);
        const rpmData = await rpmRes.json();
        if (rpmData?.result?.files?.length > 0) {
          const expectedStart = dottedTitle.toLowerCase();
          const matchedFile = rpmData.result.files.find(f => f.title?.toLowerCase().startsWith(expectedStart));
          if (matchedFile?.file_code) {
            const playerBase = await getRegionBasedPlayerBaseUrl();
            link = `${playerBase}/#${matchedFile.file_code}&api=all`;
            return link;
          }
        }
      } catch (err) { console.log(err); }
    }

    // 3. Videasy Fallback
    if (!link) {
      link = `https://player.videasy.to/tv/${seriesId}/${seasonNum}/${episodeNum}`;
    }

    return link;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      
      <View style={styles.webviewContainer}>
        {playUrl ? (
          <WebView 
            source={{ uri: playUrl }}
            style={styles.webview}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadEnd={() => setLoading(false)}
          />
        ) : null}
        
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#e50914" />
            <Text style={{color: '#fff', marginTop: 10}}>Finding Best Stream...</Text>
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
