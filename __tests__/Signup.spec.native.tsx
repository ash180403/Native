import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupScreen from '../screens/SignupScreen';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

describe('SignupScreen', () => {
  it('should render all input fields and buttons', () => {
    const { getByPlaceholderText, getByText } = render(
      <SignupScreen />,
      { wrapper: NavigationWrapper }
    );
    
    expect(getByPlaceholderText('Full Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Contact Number')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();

    expect(getByText('Signup')).toBeTruthy();
    expect(getByText('Already have an account? Login')).toBeTruthy();
  });

  it('should navigate to the Login screen on successful signup', async () => {
    const { getByPlaceholderText, getByText } = render(
      <SignupScreen />,
      { wrapper: NavigationWrapper }
    );

    const mockAlert = jest.spyOn(Alert, 'alert');

    fireEvent.changeText(getByPlaceholderText('Full Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Contact Number'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    fireEvent.press(getByText('Signup'));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Account Created', 'You can now login!');
      expect(global.mockedNavigate).toHaveBeenCalledWith('Login');
    });
  });

  it('should show an alert if any field is missing', async () => {
    const { getByText } = render(
      <SignupScreen />,
      { wrapper: NavigationWrapper }
    );

    const mockAlert = jest.spyOn(Alert, 'alert');

    fireEvent.press(getByText('Signup'));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error', 'Please fill all fields.');
    });

    mockAlert.mockRestore();
  });
});
