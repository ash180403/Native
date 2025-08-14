import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HomeScreen from '../screens/HomeScreen';
import plantReducer, { setUploadedImage, setPlantInfo } from '../store/plantSlice';
import { Alert } from 'react-native';
import { act } from '@testing-library/react-native';


// Mock the Redux store to be able to test state changes
const mockStore = configureStore({
  reducer: {
    plant: plantReducer,
  },
});

// Mock the fetch API to simulate network requests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    headers: {
      get: () => 'application/json'
    },
    json: () => Promise.resolve({ plantInfo: 'Test Plant Info' }),
    text: () => Promise.resolve(JSON.stringify({ plantInfo: 'Test Plant Info' })),
  })
) as jest.Mock;

describe('HomeScreen', () => {
  it('should render the initial UI elements correctly', () => {
    const { getByText, getByRole } = render(
      <Provider store={mockStore}>
        <HomeScreen />
      </Provider>
    );

    expect(getByText('🌿 Plant Lense')).toBeTruthy();
    expect(getByText('Take a Picture')).toBeTruthy();
    expect(getByText('Upload from Gallery')).toBeTruthy();
    expect(getByText('Plant Information')).toBeTruthy();
  });

  it('should display the uploaded image and location after taking a picture', async () => {
    const { getByText, getByTestId, findByText } = render(
      <Provider store={mockStore}>
        <HomeScreen />
      </Provider>
    );

    // Mock the Expo ImagePicker module
    const mockImagePicker = jest.requireMock('expo-image-picker');
    mockImagePicker.launchCameraAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{
        uri: 'test-image-uri',
        base64: 'base64string'
      }]
    });

    // Mock Expo Location module
    const mockLocation = jest.requireMock('expo-location');
    mockLocation.getCurrentPositionAsync.mockResolvedValueOnce({
      coords: { latitude: 12.9716, longitude: 77.5946 },
    });
    mockLocation.reverseGeocodeAsync.mockResolvedValueOnce([
      { city: 'Test City', country: 'Test Country' }
    ]);
    
    fireEvent.press(getByText('Take a Picture'));

    await waitFor(() => {
        expect(mockImagePicker.launchCameraAsync).toHaveBeenCalled();
        // Check if the image and location text is rendered after the action
        expect(mockLocation.getCurrentPositionAsync).toHaveBeenCalled();
    });
    
    // Check if the "Send Picture" button appears
    expect(getByText('Send Picture')).toBeTruthy();
  });

  it('should successfully upload an image to the server and update plant info', async () => {
    const { getByText, getByTestId, rerender } = render(
      <Provider store={mockStore}>
        <HomeScreen />
      </Provider>
    );

    // Set an image in the Redux store to make the "Send Picture" button visible
await act(async () => {
  mockStore.dispatch(setUploadedImage('test-uri'));
});    
rerender(
      <Provider store={mockStore}>
        <HomeScreen />
      </Provider>
    );
    

    fireEvent.press(getByText('Send Picture'));
    
    // Wait for the mock fetch to complete and UI to update
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://ko74vhyi5gk6pcuooycyk4oqvi0eedei.lambda-url.ap-southeast-2.on.aws/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ image: 'base64string' }),
        })
      );
    });
    
    // Assert that the plant info is updated in the Redux store
    expect(mockStore.getState().plant.plantInfo).toBe('Test Plant Info');
  });

  it('should show an alert on upload failure', async () => {
    // Mock Alert.alert
    const mockAlert = jest.spyOn(Alert, 'alert');

    // Override the global fetch mock to simulate a network error
(global.fetch as jest.Mock).mockImplementationOnce(() =>
  Promise.reject("Network error")
);

    const { getByText, rerender } = render(
      <Provider store={mockStore}>
        <HomeScreen />
      </Provider>
    );

    // Set an image in the Redux store to make the "Send Picture" button visible
    mockStore.dispatch(setUploadedImage('test-uri'));
    rerender(
      <Provider store={mockStore}>
        <HomeScreen />
      </Provider>
    );
    
    fireEvent.press(getByText('Send Picture'));

    await waitFor(() => {
      // Assert that an alert was shown
      expect(mockAlert).toHaveBeenCalledWith(
        'Upload Failed',
        'Something went wrong while uploading.'
      );
    });
    
    // Clean up the mock
    mockAlert.mockRestore();
  });
});
