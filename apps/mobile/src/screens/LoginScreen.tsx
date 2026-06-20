import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Mock users for authentication
const MOCK_USERS = [
  {
    email: 'admin@jstamilcinemas.com',
    password: 'Admin@123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    email: 'akashsharan5544@gmail.com',
    password: '5Sharan$55',
    name: 'Sharan J S',
    phone: '9994168334',
    role: 'admin',
  },
  {
    email: 'user@example.com',
    password: 'User@123',
    name: 'Regular User',
    role: 'user',
  },
];

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Find user
    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user) {
      setError('Invalid email or password');
      return;
    }

    if (user.password !== password) {
      setError('Invalid email or password');
      return;
    }

    setError('');

    // Store user data for access throughout the app
    // In a real app, use AsyncStorage or SecureStore
    global.currentUser = user;

    // All users go to MainTabs
    // Admins will see an additional Admin tab
    navigation.replace('MainTabs');
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>J S Tamil Cinemas</Text>
            <Text style={styles.subtitle}>Dive Back In</Text>
          </View>

          {/* Quick Login Button for Testing */}
          <TouchableOpacity
            style={styles.quickLoginButton}
            onPress={() => quickLogin('user@example.com', 'User@123')}
          >
            <Text style={styles.quickLoginText}>👤 Quick Test Login (Regular User)</Text>
          </TouchableOpacity>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor={colors.onSurfaceVariant}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.onSurfaceVariant}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signUpLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    ...typography.displayLgMobile,
    color: colors.primaryFixedDim,
    letterSpacing: -1,
  },
  subtitle: {
    ...typography.displayLgMobile,
    color: colors.onSurface,
    marginTop: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginBottom: 8,
  },
  input: {
    ...typography.bodyMd,
    backgroundColor: colors.surfaceContainerHigh,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 8,
    padding: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    ...typography.labelSm,
    color: colors.primaryFixedDim,
  },
  signInButton: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  signInButtonText: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onPrimaryContainer,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  dividerText: {
    ...typography.bodyMd,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    paddingHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  socialButtonText: {
    ...typography.labelSm,
    color: colors.onSurface,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    ...typography.bodyMd,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  signUpLink: {
    ...typography.bodyMd,
    fontSize: 14,
    color: colors.primaryFixedDim,
    fontWeight: '600',
  },
  quickLoginButton: {
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  quickLoginText: {
    ...typography.labelSm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    ...typography.bodyMd,
    color: '#f44336',
    textAlign: 'center',
  },
});
