// screens/HomeScreen.tsx
import React, { useState } from 'react';
import { Alert, Platform, TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // Import hooks
import { setUploadedImage, setPlantInfo } from '../store/plantSlice'; // Import actions
import { RootState } from '../store/index'; // Import RootState type

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
  color: rgb(62, 61, 61);
  text-shadow: 1px 1px 1px rgb(78, 76, 76);
`;

const Description = styled.Text`
  text-align: center;
  font-size: 16px;
  color: rgb(153, 149, 149);
  margin-top: 8px;
`;

const CustomButton = styled(TouchableHighlight).attrs({
  underlayColor: '#9EDF9C',
})`
  background-color: rgb(255, 255, 255);
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
  width: 70px;
  height: 70px;
  border-radius: 8px;
  margin-right: 8px;
  flex: 1;
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
  // Use Redux state for image and plant info instead of local state
  const dispatch = useDispatch();
  const uploadedImage = useSelector((state: RootState) => state.plant.uploadedImage);
  const plantInfo = useSelector((state: RootState) => state.plant.plantInfo);

  // Keep local state for transient data like location, address, and base64 string
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [currentBase64Image, setCurrentBase64Image] = useState<string | null>(null); // To hold base64 for upload

  const localImages = [
    require('../assets/1.jpg'),
    require('../assets/2.jpg'),
    require('../assets/3.jpg'),
    require('../assets/4.jpg'),
    require('../assets/5.jpg'),
    require('../assets/6.jpg'),
  ];

  const handleImageResult = async (imageResult: ImagePicker.ImagePickerResult) => {
    if (!imageResult.canceled) {
      const asset = imageResult.assets[0];
      // Dispatch action to update Redux store
      dispatch(setUploadedImage(asset.uri));
      setCurrentBase64Image(asset.base64 || null); // Store base64 locally for upload

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

  const uploadImageToServer = async () => {
    if (!currentBase64Image) { // Use the local base64 for the upload
      Alert.alert('No image selected', 'Please take or select an image first.');
      return;
    }

    const cleanedBase64 = currentBase64Image.replace(/^data:image\/[a-z]+;base64,/, '');

    try {
      const response = await fetch(
        'https://ko74vhyi5gk6pcuooycyk4oqvi0eedei.lambda-url.ap-southeast-2.on.aws/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: cleanedBase64,
          }),
        }
      );

      const contentType = response.headers.get('content-type');
      const rawResponse = await response.text();

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Raw response body:', rawResponse);

      if (contentType && contentType.includes('application/json')) {
        const data = JSON.parse(rawResponse);
        console.log('Parsed JSON response:', data);
        Alert.alert('Upload Success', 'Image uploaded successfully!');
        // Assuming the API returns plant info in 'data.plantInfo' or similar
        // Dispatch action to save plant info to Redux store
        dispatch(setPlantInfo(data.plantInfo || 'Plant info not provided'));
      } else {
        console.warn('Server response is not JSON:', rawResponse);
        Alert.alert('Upload Failed', 'Server returned non-JSON response.');
        dispatch(setPlantInfo('Error: Server returned non-JSON response.'));
      }
    } catch (error) {
      console.error('Upload failed with error:', error);
      Alert.alert('Upload Failed', 'Something went wrong while uploading.');
      dispatch(setPlantInfo('Error during upload.'));
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

        {uploadedImage && ( // Use uploadedImage from Redux
          <>
            <StyledImage source={{ uri: uploadedImage }} />
            {location && (
              <StyledText>
                Location: {location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}
              </StyledText>
            )}
            {address && <StyledText>Address: {address}</StyledText>}

            <CustomButton onPress={uploadImageToServer}>
              <ButtonText>Send Picture</ButtonText>
            </CustomButton>
          </>
        )}

        <BottomSpacing />
        <InfoCard>
          <SectionTitle>Plant Information</SectionTitle>

          <Label>Native plant images</Label>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Row>
              {localImages.map((imgSrc, index) => (
                <ThumbImage key={index} source={imgSrc} />
              ))}
            </Row>
          </ScrollView>

          {/* Display plantInfo from Redux store */}
          <Label>Identified Plant Info</Label>
          <InfoText>{plantInfo || 'Upload an image to get plant information.'}</InfoText>

          {/* Original hardcoded plant info, you might replace these with data from Redux if available */}
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