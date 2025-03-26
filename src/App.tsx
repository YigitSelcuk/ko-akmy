/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AppNavigation from './navigation/AppNavgation';
import { ToastProvider } from './components/Toast';

const App = () => {
  return (
    <ToastProvider>
      <AppNavigation />
    </ToastProvider>
  );
};

export default App;
