import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const { width } = Dimensions.get('window');

const mockMovies = [
  { id: '1', title: 'Ponniyin Selvan II', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop', rating: 4.8 },
  { id: '2', title: 'Jailer', image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop', rating: 4.7 },
  { id: '3', title: 'Vikram', image: 'https://images.unsplash.com/photo-1574267432644-f610bcb5b103?w=300&h=450&fit=crop', rating: 4.9 },
  { id: '4', title: 'Varisu', image: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=300&h=450&fit=crop', rating: 4.5 },
  { id: '5', title: 'Thunivu', image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop', rating: 4.6 },
];

interface MovieCarouselProps {
  title: string;
  movies: typeof mockMovies;
  navigation: any;
}

function MovieCarousel({ title, movies, navigation }: MovieCarouselProps) {
  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.carouselTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselScroll}
      >
        {movies.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            style={styles.movieCard}
            onPress={() => navigation.navigate('MovieDetail', { movieId: movie.id })}
          >
            <Image source={{ uri: movie.image }} style={styles.movieImage} />
            <View style={styles.movieInfo}>
              <Text style={styles.movieRating}>⭐ {movie.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=800&h=600&fit=crop' }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)', colors.background]}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>PREMIUM EXCLUSIVE</Text>
            </View>
            <Text style={styles.heroTitle}>VEERAN</Text>
            <Text style={styles.heroSubtitle}>The Legend of the Kingdom</Text>
            <Text style={styles.heroDescription}>
              Experience the untold story of the Chola Empire's greatest warrior
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>▶ Watch Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.infoButton}>
                <Text style={styles.infoButtonText}>ⓘ More Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Movie Carousels */}
        <View style={styles.content}>
          <MovieCarousel title="Trending Now" movies={mockMovies} navigation={navigation} />
          <MovieCarousel title="New Releases" movies={mockMovies} navigation={navigation} />
          <MovieCarousel title="Tamil Classics" movies={mockMovies} navigation={navigation} />
          <MovieCarousel title="Blockbusters" movies={mockMovies} navigation={navigation} />
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
  scrollView: {
    flex: 1,
  },
  hero: {
    height: 600,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 400,
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  heroBadge: {
    backgroundColor: `${colors.primaryFixedDim}33`,
    borderWidth: 1,
    borderColor: `${colors.primaryFixedDim}66`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroBadgeText: {
    ...typography.labelSm,
    color: colors.primaryFixedDim,
  },
  heroTitle: {
    ...typography.displayLgMobile,
    color: colors.onSurface,
    marginBottom: 4,
  },
  heroSubtitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: 12,
  },
  heroDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: 20,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  playButton: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  playButtonText: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onPrimaryContainer,
  },
  infoButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoButtonText: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  content: {
    paddingVertical: 20,
  },
  carouselContainer: {
    marginBottom: 32,
  },
  carouselTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  carouselScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  movieCard: {
    width: 160,
    marginHorizontal: 4,
  },
  movieImage: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerHigh,
  },
  movieInfo: {
    marginTop: 8,
  },
  movieRating: {
    ...typography.labelSm,
    color: colors.primaryFixedDim,
  },
});
