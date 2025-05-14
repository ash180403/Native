import React, { useState } from 'react';
import { Button, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const Container = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;
const ButtonContainer = styled.View`
 margin-top: 350px;

`;

const StyledImage = styled.Image`
  width: 100%;
  height: 300px;
  border-radius: 10px;
  margin: 16px 0;
`;

const StyledText = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
`;

export default function ScanScreen() {
  const [image, setImage] = useState<string | null>(null);
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
    });

    if (!imageResult.canceled) {
      setImage(imageResult.assets[0].uri);

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
    <Container>
        <ButtonContainer>
            <Button title="TAKE PICTURE" onPress={takePictureHandler} />
        </ButtonContainer>
      {image && (
        <>
          <StyledImage source={{ uri: image }} />
          {location && (
            <StyledText>
              Location: {location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}
            </StyledText>
          )}
          {address && <StyledText>Address: {address}</StyledText>}
          <Button title="SEND PICTURE" onPress={() => {}} />
        </>
      )}
    </Container>
  );
}
