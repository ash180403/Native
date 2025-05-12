import React, { useState } from 'react';
import { View, Button, Text, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function App() {
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

      // Get address from coordinates
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

  const sendPictureHandler = () => {

    console.log('Sending picture with location and address...');
  };

  return (
    <View style={styles.container}>
      <Button title="TAKE PICTURE" onPress={takePictureHandler} />
      {image && (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          {location && (
            <Text style={styles.text}>
              Location: {location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}
            </Text>
          )}
          {address && <Text style={styles.text}>Address: {address}</Text>}
          <Button title="SEND PICTURE" onPress={sendPictureHandler} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    marginVertical: 15,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
