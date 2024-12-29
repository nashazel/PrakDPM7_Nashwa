import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import React from 'react';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Oops! This page doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go back to the home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff', // White background for a clean look
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Dark text for contrast
    textAlign: 'center',
    marginBottom: 30,
  },
  link: {
    marginTop: 25,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#007AFF', // Blue border for the link button
    borderRadius: 12,
    backgroundColor: '#E6F4FF', // Soft blue background
    elevation: 5, // Slight shadow for button effect
  },
  linkText: {
    color: '#007AFF', // Blue text to indicate it's a clickable link
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
