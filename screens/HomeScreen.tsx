// screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadedImage, setPlantInfo } from '../store/plantSlice';
import { RootState } from '../store/index';
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';

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
  background-color: #fff;
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
  const dispatch = useDispatch();
  const uploadedImage = useSelector(
    (state: RootState) => state.plant.uploadedImage
  );
  const plantInfo = useSelector((state: RootState) => state.plant.plantInfo);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const localImages = [
    require('../assets/1.jpg'),
    require('../assets/2.jpg'),
    require('../assets/3.jpg'),
    require('../assets/4.jpg'),
    require('../assets/5.jpg'),
    require('../assets/6.jpg'),
  ];

  const uploadImageToSupabase = async (uri: string) => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      Alert.alert('Authentication Error', 'You must be logged in to upload.');
      return null;
    }

    const userId = session.user.id;
    const ext = uri.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `${userId}/${fileName}`;

    try {
      setLoading(true);

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fileBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      const { error } = await supabase.storage
        .from('plant-images')
        .upload(filePath, fileBytes, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from('plant-images')
        .getPublicUrl(filePath);

      console.log('✅ Image uploaded successfully:', data.publicUrl);

      return data.publicUrl;
    } catch (err: any) {
      console.error('❌ Upload failed:', err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleImageResult = async (imageResult: ImagePicker.ImagePickerResult) => {
    if (!imageResult.canceled) {
      const asset = imageResult.assets[0];
      setLocalUri(asset.uri);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setLocation(loc);

        const addressResult = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (addressResult.length > 0) {
          const a = addressResult[0];
          setAddress(
            `${a.name}, ${a.street}, ${a.city}, ${a.region}, ${a.postalCode}, ${a.country}`
          );
        }
      }
    }
  };

  const takePictureHandler = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera access is needed.');
      return;
    }
    const imageResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    handleImageResult(imageResult);
  };

  const uploadFromGalleryHandler = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Gallery access is needed.');
      return;
    }
    const imageResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    handleImageResult(imageResult);
  };

const sendPictureHandler = async () => {
  if (!localUri) {
    Alert.alert('No image', 'Please select an image first.');
    return;
  }

  const publicUrl = await uploadImageToSupabase(localUri);

  if (publicUrl) {
    dispatch(setUploadedImage(publicUrl));
    dispatch(
      setPlantInfo(
        'Uploaded successfully to Supabase. Plant recognition not connected yet.'
      )
    );

    // ✅ Reset UI to fresh state
    setLocalUri(null);
    setLocation(null);
    setAddress(null);
  }
};


  return (
    <SafeWrapper>
      <Container>
        <Header>
          <Logo>🌿 Plant Lense</Logo>
          <Description>
            Identify plants and learn about their care. Take a photo or upload
            an image to get started.
          </Description>
        </Header>

        <CustomButton onPress={takePictureHandler}>
          <ButtonText>Take a Picture</ButtonText>
        </CustomButton>

        <CustomButton onPress={uploadFromGalleryHandler}>
          <ButtonText>Upload from Gallery</ButtonText>
        </CustomButton>

        {localUri && (
          <>
            <StyledImage source={{ uri: localUri }} />
            {location && (
              <StyledText>
                Location: {location.coords.latitude.toFixed(5)},{' '}
                {location.coords.longitude.toFixed(5)}
              </StyledText>
            )}
            {address && <StyledText>Address: {address}</StyledText>}
            <CustomButton onPress={sendPictureHandler} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#809D3C" />
              ) : (
                <ButtonText>Send Picture</ButtonText>
              )}
            </CustomButton>
          </>
        )}

        <BottomSpacing />

        <InfoCard>
          <SectionTitle>Plant Information</SectionTitle>

          <Label>Native plant images</Label>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Row>
              {localImages.map((img, i) => (
                <ThumbImage key={i} source={img} />
              ))}
            </Row>
          </ScrollView>

          <Label>Identified Plant Info</Label>
          <InfoText>
            {plantInfo || 'Upload an image to get plant information.'}
          </InfoText>

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
