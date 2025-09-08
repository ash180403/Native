import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, ActivityIndicator, Platform, Pressable, Text } from 'react-native';
import styled from 'styled-components/native';
import { supabase } from '../lib/supabase';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using Expo for this library

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f0f4f8;
`;

const Form = styled(ScrollView).attrs({
  contentContainerStyle: { padding: 24 },
})``;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #4b5563;
  margin-top: 16px;
  margin-bottom: 6px;
`;

const Input = styled.TextInput`
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  background-color: #fff;
  color: #374151;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const Dropdown = styled.View`
  border: 1px solid #d1d5db;
  border-radius: 12px;
  margin-top: 8px;
  background-color: #fff;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #809D3C;
  padding: 16px;
  border-radius: 25px;
  align-items: center;
  margin-top: 40px;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 5;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: #ef4444;
  padding: 14px 24px;
  border-radius: 20px;
  margin-top: 20px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  elevation: 3;
`;

const LogoutText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const DateInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  margin-top: 8px;
  background-color: #fff;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 2;
`;

const DateTextInput = styled.TextInput`
  flex: 1;
  padding: 14px;
  font-size: 16px;
  color: #374151;
`;

const CalendarIconContainer = styled.TouchableOpacity`
  padding: 14px;
`;


export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>({
    full_name: '',
    email: '',
    contact: '',
    country_code: '+91',
    dob: '',
    gender: 'Other',
    address: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'User not found');
      setLoading(false);
      return;
    }

    setProfile(p => ({ ...p, email: user.email }));

    const { data, error } = await supabase
      .from('profile-details')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      Alert.alert('Error', error.message);
    } else if (data) {
      setProfile(p => ({ ...p, ...data }));
    }

    setLoading(false);
  };

  const saveProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'User not logged in');
      setLoading(false);
      return;
    }

    const payload = {
      full_name: profile.full_name,
      contact: profile.contact,
      country_code: profile.country_code,
      dob: profile.dob,
      gender: profile.gender,
      address: profile.address,
      user_id: user.id,
    };

    const { error } = await supabase
      .from('profile-details')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Profile saved successfully');
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      console.log('✅ User logged out successfully');
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setProfile({ ...profile, dob: formattedDate });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Container>
      <Form>
        <Title>My Profile</Title>

        <Label>Full Name</Label>
        <Input
          value={profile.full_name}
          onChangeText={(text) => setProfile({ ...profile, full_name: text })}
        />

        <Label>Email</Label>
        <Input value={profile.email} editable={false} />

        <Label>Phone</Label>
        <Input
          value={profile.contact}
          keyboardType="phone-pad"
          onChangeText={(text) => setProfile({ ...profile, contact: text })}
        />

        <Label>Country Code</Label>
        <Dropdown>
          <Picker
            selectedValue={profile.country_code}
            onValueChange={(value) => setProfile({ ...profile, country_code: value })}
          >
            <Picker.Item label="+91 India" value="+91" />
            <Picker.Item label="+1 USA" value="+1" />
            <Picker.Item label="+44 UK" value="+44" />
            <Picker.Item label="+61 Australia" value="+61" />
          </Picker>
        </Dropdown>

        <Label>Date of Birth</Label>
        <DateInputContainer>
          <DateTextInput
            value={profile.dob}
            onChangeText={(text) => setProfile({ ...profile, dob: text })}
            placeholder="YYYY-MM-DD"
          />
          <CalendarIconContainer onPress={() => setShowDatePicker(true)}>
            <FontAwesome name="calendar" size={24} color="#4b5563" />
          </CalendarIconContainer>
        </DateInputContainer>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={profile.dob ? new Date(profile.dob) : new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Label>Gender</Label>
        <Dropdown>
          <Picker
            selectedValue={profile.gender}
            onValueChange={(value) => setProfile({ ...profile, gender: value })}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </Dropdown>

        <Label>Address</Label>
        <Input
          multiline
          value={profile.address}
          onChangeText={(text) => setProfile({ ...profile, address: text })}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#809D3C" style={{ marginTop: 20 }} />
        ) : (
          <SaveButton onPress={saveProfile}>
            <ButtonText>Save Profile</ButtonText>
          </SaveButton>
        )}

        <LogoutButton onPress={handleLogout}>
          <LogoutText>Logout</LogoutText>
        </LogoutButton>
      </Form>
    </Container>
  );
}
 