import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ekranları içe aktarıyoruz
import Onboarding from '../screens/Onboarding/Onboarding';
import Login from '../screens/Login/Login';
import EmployeeLogin from '../screens/EmployeeLogin/EmployeeLogin';
import AgencyLogin from '../screens/AgencyLogin/AgencyLogin';
import EmployeeHome from '../screens/EmployeeHome/EmployeeHome';
import AgencyHome from '../screens/AgencyHome/AgencyHome';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import Register from '../screens/Register/Register';

// Stack Navigator tipi
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  EmployeeLogin: undefined;
  AgencyLogin: undefined;
  EmployeeHome: undefined;
  AgencyHome: undefined;
  ForgotPassword: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Onboarding'in daha önce gösterilip gösterilmediğini kontrol et
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        
        if (hasSeenOnboarding === 'true') {
          // Daha önce Onboarding gösterilmişse doğrudan Login sayfasına yönlendir
          setIsFirstLaunch(false);
        } else {
          // İlk kez uygulama açılıyorsa Onboarding göster
          setIsFirstLaunch(true);
        }
        
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // console.log('Uygulama başlatma hatası:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Henüz AsyncStorage kontrolü yapılmadıysa
  if (isLoading) {
    return null; // Splash ekranı burada gösterilebilir
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isFirstLaunch ? "Onboarding" : "Login"}
      >
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="EmployeeLogin" component={EmployeeLogin} />
        <Stack.Screen name="AgencyLogin" component={AgencyLogin} />
        <Stack.Screen name="EmployeeHome" component={EmployeeHome} />
        <Stack.Screen name="AgencyHome" component={AgencyHome} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
