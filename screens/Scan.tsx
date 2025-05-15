import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

const Container = styled.ScrollView`
  flex: 1;
  padding: 24px;
  background-color: #f9f9f9;
`;

const SafeWrapper = styled(SafeAreaView)`
  flex: 1;
`;

const CustomButton = styled.TouchableOpacity`
  background-color: #4CAF50;
  padding: 14px;
  border-radius: 12px;
  margin-vertical: 10px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
  shadow-offset: 0px 3px;
  elevation: 4;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const ButtonContainer = styled.View`
  margin-top: 180px;
  margin-bottom: 20px;
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

export default function ScanScreen() {
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
        <ButtonContainer>
          <CustomButton onPress={takePictureHandler}>
            <ButtonText>📷 TAKE PICTURE</ButtonText>
          </CustomButton>

          <CustomButton onPress={uploadFromGalleryHandler}>
            <ButtonText>🖼️ UPLOAD FROM GALLERY</ButtonText>
          </CustomButton>
        </ButtonContainer>

        {image && (
          <>
            <StyledImage source={{ uri: image }} />
            {location && (
              <StyledText>
                📍 Location: {location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}
              </StyledText>
            )}
            {address && <StyledText>🏠 Address: {address}</StyledText>}

            <CustomButton
              onPress={() => {
                if (base64Image) {
                  const dataUri = `data:image/jpeg;base64,${base64Image}`;
                  console.log('Uploading base64 image preview:', dataUri.slice(0, 100) + '...');
                  Alert.alert('Ready to upload', 'Base64 image is prepared.');
                } else {
                  Alert.alert('No image', 'Please take or upload a photo first.');
                }
              }}
            >
              <ButtonText>🚀 SEND PICTURE</ButtonText>
            </CustomButton>
          </>
        )}

        <BottomSpacing />
      </Container>
    </SafeWrapper>
  );
}
