import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import Navigation from './src/navigation/Navigation';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        <Navigation />
      </View>
    </SafeAreaView>
  );
};

export default App;
