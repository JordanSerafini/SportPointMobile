import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Route from './app/components/router/Route';

export default function App() {
  return (
    <View style={styles.container}>
        
        <Route />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
