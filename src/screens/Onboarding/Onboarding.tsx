import React, { useState, useRef } from 'react';
import { 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Animated
} from 'react-native';
import LottieView from 'lottie-react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Onboarding.style';
import { COLORS } from '../../theme/theme';

// Onboarding veri tipi
interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  animation: any;
}

// RootStackParamList tipi
type RootStackParamList = {
  Login: undefined;
};

// Onboarding verileri
const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'İsteğimiz',
    description: 'Saygılı, güvenilir, dinamik, yaratıcı, çözüm odaklı, sorumluluk sahibi bir iş ortaklığı sağlamaktır.',
    animation: require('../../assets/animations/animation1.json'),
  },
  {
    id: '2',
    title: 'Amacımız',
    description: 'Organizasyonunuzun bir parçası olarak tecrübeli, genç ve dinamik personellerimizle yanınızda yer almak.',
    animation: require('../../assets/animations/animation2.json'),
  },
  {
    id: '3',
    title: 'Hedefimiz',
    description: 'Şeffaf kalarak, sektördeki kaliteli hizmet anlayışında öncü olmak ve akabinde sürekli iyileştirmeyi sağlamak.',
    animation: require('../../assets/animations/animation3.json'),
  },
];

const Onboarding = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  // Onboarding'i atlama veya bitirme fonksiyonu
  const completeOnboarding = async () => {
    try {
      // Onboarding'in görüldüğünü AsyncStorage'a kaydet
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      // Login ekranına yönlendir
      navigation.navigate('Login');
    } catch (error) {
      console.error('Onboarding tamamlama hatası:', error);
    }
  };

  // İleri butonuna basıldığında
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      if (slidesRef.current) {
        slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
      }
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  // Onboarding slide'ı render fonksiyonu
  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slideContainer}>
        <View style={styles.animationContainer}>
          <LottieView
            source={item.animation}
            autoPlay
            loop
            style={{ flex: 1 }}
          />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  // Dot indikatörleri
  const renderDots = () => {
    const { width } = styles.slideContainer;
    
    return (
      <View style={styles.dotContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View 
              key={index.toString()} 
              style={[
                styles.dot, 
                { width: dotWidth, opacity, backgroundColor: index === currentIndex ? COLORS.accent : COLORS.gray }
              ]} 
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Atla butonu */}
      <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
        <Text style={styles.skipText}>Atla</Text>
      </TouchableOpacity>

      {/* FlatList ile slaytlar */}
      <FlatList
        ref={slidesRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.floor(
            event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
          );
          setCurrentIndex(newIndex);
        }}
      />

      {/* Dot indikatörler */}
      {renderDots()}

      {/* İleri butonu */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{currentIndex === onboardingData.length - 1 ? 'Başla' : 'İleri'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Onboarding;