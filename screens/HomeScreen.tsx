import { TouchableHighlight } from 'react-native';
import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

const SafeWrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: #f9f9f9;
`;

const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 24,
    flexGrow: 1, 
  },
})``;


const Header = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.Text`
  font-size: 30px;
  
  color:rgb(62, 61, 61);
  text-shadow: 1.5px 1.5px 1.5px rgb(78, 76, 76);
`;

const Description = styled.Text`
  text-align: center;
  font-size: 16px;
  color:rgb(153, 149, 149);
  margin-top: 8px;
`;

const CustomButton = styled(TouchableHighlight).attrs({
  underlayColor: '#9EDF9C', 
})`  background-color:rgb(255, 255, 255);
  width: 85%;
  align-self: center;
  padding: 14px;
  border-radius: 25px;
  margin-vertical: 10px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 4;
  border-width: 1px;
  border-color: #809D3C;

`;

const ButtonText = styled.Text`
  color: #809D3C;
  font-size: 17px;
  font-weight: 600;
  
`;

const StyledImage = styled.Image`
  width: 100%;
  height: 300px;
  border-radius: 12px;
  margin: 16px 0;
`;

const StyledText = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
`;

const BottomSpacing = styled.View`
  margin-bottom: ${Platform.OS === 'ios' ? '40px' : '20px'};
`;
const InfoCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-top: 24px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const ThumbImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 8px;
`;

const Label = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #444;
  margin-top: 12px;
`;

const InfoText = styled.Text`
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
`;


export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  
  const takePictureHandler = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera access is needed.');
      return;
    }

    const imageResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    handleImageResult(imageResult);
  };

  const uploadFromGalleryHandler = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Gallery access is needed.');
      return;
    }

    const imageResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    handleImageResult(imageResult);
  };

  const handleImageResult = async (imageResult: ImagePicker.ImagePickerResult) => {
    if (!imageResult.canceled) {
      const asset = imageResult.assets[0];
      setImage(asset.uri);
      setBase64Image(asset.base64 || null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location access is needed.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 0,
      });

      setLocation(loc);

      const addressResult = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (addressResult.length > 0) {
        const a = addressResult[0];
        const full = `${a.name}, ${a.street}, ${a.city}, ${a.region}, ${a.postalCode}, ${a.country}`;
        setAddress(full);
      } else {
        setAddress('Address not found');
      }
    }
  };

  return (
    <SafeWrapper>
      <Container>
        <Header>
          <Logo>🌿 Plant Lense</Logo>
          <Description>
            Identify plants and learn about their care. Take a photo or upload an image to get started.
          </Description>
        </Header>

        <CustomButton onPress={takePictureHandler}>
          <ButtonText>Take a Picture</ButtonText>
        </CustomButton>

        <CustomButton onPress={uploadFromGalleryHandler}>
          <ButtonText>Upload from Gallery</ButtonText>
        </CustomButton>

        {image && (
          <>
            <StyledImage source={{ uri: image }} />
            {location && (
              <StyledText>
                Location: {location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}
              </StyledText>
            )}
            {address && <StyledText>Address: {address}</StyledText>}

            <CustomButton
              onPress={() => {
                if (base64Image) {
                  const dataUri = `data:image/jpeg;base64,${base64Image}`;
                  console.log('Base64 Preview:', dataUri.slice(0, 100) + '...');
                  Alert.alert('Ready to upload', 'Base64 image is prepared.');
                } else {
                  Alert.alert('No image', 'Please take or upload a photo first.');
                }
              }}
            >
              <ButtonText>Send Picture</ButtonText>
            </CustomButton>
          </>
        )}

        <BottomSpacing />
        <InfoCard>
  <SectionTitle>Plant Information</SectionTitle>

  <Label>Native plant images</Label>
  <Row>
    {[1, 2, 3, 4].map((_, index) => (
      <ThumbImage
        key={index}
        source={{ uri: 'https://via.placeholder.com/60x60.png?text=🌿' }}
      />
    ))}
  </Row>

  <Label>Species</Label>
  <InfoText>Some plant species</InfoText>

  <Label>Care Requirements</Label>

  <Label>Watering</Label>
  <InfoText>Water every 2 weeks</InfoText>

  <Label>Sunlight</Label>
  <InfoText>Indirect sunlight</InfoText>
</InfoCard>

      </Container>
    </SafeWrapper>
  );
}
