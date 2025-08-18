// jest.setup.js
const mockedNavigate = jest.fn();
const mockedReset = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
      reset: mockedReset,
    }),
  };
});

// Mock Image Picker
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchCameraAsync: jest.fn().mockResolvedValue({
    cancelled: false,
    assets: [{ uri: 'test-uri', base64: 'base64string' }],
  }),
}));

// Mock Location API
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 12.9716, longitude: 77.5946 },
  }),
  reverseGeocodeAsync: jest.fn().mockResolvedValue([
    { city: 'Test City', country: 'Test Country' },
  ]),
  Accuracy: {
    Lowest: 1,
    Low: 2,
    Balanced: 3,
    High: 4,
    Highest: 5,
  },
}));


global.mockedNavigate = mockedNavigate;
global.mockedReset = mockedReset;

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    headers: { get: () => 'application/json' },
    json: () => Promise.resolve({ plantInfo: 'Test Plant Info' }),
    text: () => Promise.resolve(JSON.stringify({ plantInfo: 'Test Plant Info' })),
  })
);
