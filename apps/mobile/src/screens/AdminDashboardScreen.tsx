import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function AdminDashboardScreen({ navigation }: any) {
  const stats = {
    totalUsers: 15234,
    activeSubscriptions: 8456,
    totalMovies: 1247,
    totalRevenue: '₹45,67,890',
  };

  const recentUsers = [
    { id: 1, name: 'Rajesh Kumar', plan: 'Premium', date: '2024-06-15' },
    { id: 2, name: 'Priya Sharma', plan: 'Basic', date: '2024-06-14' },
    { id: 3, name: 'Arjun Reddy', plan: 'Premium', date: '2024-06-13' },
  ];

  const recentMovies = [
    { id: 1, title: 'Ponniyin Selvan II', views: 45678, status: 'Published' },
    { id: 2, title: 'Jailer', views: 67890, status: 'Published' },
    { id: 3, title: 'Leo', views: 34567, status: 'Draft' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Manage your platform</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} />
          <StatCard title="Subscriptions" value={stats.activeSubscriptions.toLocaleString()} />
          <StatCard title="Total Movies" value={stats.totalMovies.toLocaleString()} />
          <StatCard title="Revenue (MTD)" value={stats.totalRevenue} />
        </View>

        {/* Recent Users */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Users</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          {recentUsers.map((user) => (
            <View key={user.id} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.listItemTitle}>{user.name}</Text>
                  <Text style={styles.listItemSubtitle}>{user.date}</Text>
                </View>
              </View>
              <View style={[
                styles.badge,
                user.plan === 'Premium' && styles.badgePremium
              ]}>
                <Text style={styles.badgeText}>{user.plan}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Movies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Movies</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Movie</Text>
            </TouchableOpacity>
          </View>

          {recentMovies.map((movie) => (
            <View key={movie.id} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={[styles.avatar, styles.movieAvatar]}>
                  <Text style={styles.avatarText}>🎬</Text>
                </View>
                <View>
                  <Text style={styles.listItemTitle}>{movie.title}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {movie.views.toLocaleString()} views
                  </Text>
                </View>
              </View>
              <View style={[
                styles.badge,
                movie.status === 'Published' ? styles.badgePublished : styles.badgeDraft
              ]}>
                <Text style={styles.badgeText}>{movie.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <ActionCard
            icon="🎬"
            title="Add Movie"
            onPress={() => {}}
          />
          <ActionCard
            icon="👥"
            title="Manage Users"
            onPress={() => {}}
          />
          <ActionCard
            icon="📊"
            title="Analytics"
            onPress={() => {}}
          />
          <ActionCard
            icon="⚙️"
            title="Settings"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function ActionCard({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    ...typography.displayLarge,
    color: colors.onSurface,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.onSurfaceVariant,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surfaceContainer,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  statValue: {
    ...typography.displayMedium,
    color: colors.primaryFixedDim,
    marginBottom: 4,
  },
  statTitle: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.headlineMedium,
    color: colors.onSurface,
  },
  viewAll: {
    ...typography.labelMedium,
    color: colors.primaryFixedDim,
  },
  addButton: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    ...typography.labelMedium,
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  movieAvatar: {
    backgroundColor: colors.tertiaryContainer,
  },
  avatarText: {
    ...typography.titleMedium,
    color: colors.onPrimaryContainer,
  },
  listItemTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
    marginBottom: 2,
  },
  listItemSubtitle: {
    ...typography.bodySmall,
    color: colors.onSurfaceVariant,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  badgePremium: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  badgePublished: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  badgeDraft: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  badgeText: {
    ...typography.labelSmall,
    color: colors.onSurface,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surfaceContainer,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    ...typography.titleSmall,
    color: colors.onSurface,
    textAlign: 'center',
  },
});
