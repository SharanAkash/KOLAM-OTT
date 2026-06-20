import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function MovieDetailScreen({ navigation, route }: any) {
  const movie = {
    title: 'Ponniyin Selvan II',
    year: 2023,
    duration: '164 min',
    rating: 4.8,
    genre: ['Action', 'Drama', 'Historical'],
    director: 'Mani Ratnam',
    cast: ['Vikram', 'Aishwarya Rai', 'Karthi'],
    description:
      'The story continues in this epic historical drama as Arulmozhi Varman fights for the throne of the Chola Empire. With breathtaking visuals and a stellar cast, this sequel takes viewers deeper into the world of ancient Tamil kingdoms.',
    backdrop: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=800&h=600&fit=crop',
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.backdrop}>
          <Image source={{ uri: movie.backdrop }} style={styles.backdropImage} />
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.backdropGradient}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PREMIUM</Text>
            </View>
            <Text style={styles.rating}>⭐ {movie.rating}/5</Text>
          </View>

          <Text style={styles.title}>{movie.title}</Text>

          <View style={styles.metadata}>
            <Text style={styles.metadataText}>{movie.year}</Text>
            <Text style={styles.metadataText}>•</Text>
            <Text style={styles.metadataText}>{movie.duration}</Text>
          </View>

          <View style={styles.genres}>
            {movie.genre.map((g) => (
              <View key={g} style={styles.genreTag}>
                <Text style={styles.genreText}>{g}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.description}>{movie.description}</Text>

          <View style={styles.info}>
            <Text style={styles.infoLabel}>Director: </Text>
            <Text style={styles.infoValue}>{movie.director}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.infoLabel}>Cast: </Text>
            <Text style={styles.infoValue}>{movie.cast.join(', ')}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playButtonText}>▶ Watch Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>+ My List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdrop: {
    height: 300,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backdropGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.onSurface,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: `${colors.primaryFixedDim}33`,
    borderWidth: 1,
    borderColor: `${colors.primaryFixedDim}66`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.primaryFixedDim,
  },
  rating: {
    ...typography.labelSm,
    color: colors.primaryFixedDim,
  },
  title: {
    ...typography.displayLgMobile,
    color: colors.onSurface,
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metadataText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  genres: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  genreTag: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    ...typography.bodyMd,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  description: {
    ...typography.bodyLg,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginBottom: 20,
  },
  info: {
    marginBottom: 12,
  },
  infoLabel: {
    ...typography.bodyMd,
    color: colors.primaryFixedDim,
    fontWeight: '600',
  },
  infoValue: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  playButton: {
    backgroundColor: colors.primaryContainer,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  playButtonText: {
    ...typography.headlineMd,
    color: colors.onPrimaryContainer,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontWeight: '600',
  },
});
