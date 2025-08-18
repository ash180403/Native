import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>{children}</NavigationContainer>
);

describe('LoginScreen', () => {
  it('should render the login form', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen />,
      { wrapper: NavigationWrapper }
    );
    
    expect(getByText('Welcome Back 👋')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't have an account? Signup")).toBeTruthy();
  });

  it('should navigate to Main on successful login', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen />,
      { wrapper: NavigationWrapper }
    );
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'demo@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(global.mockedReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    });
  });

  it('should show an alert with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen />,
      { wrapper: NavigationWrapper }
    );

    const mockAlert = jest.spyOn(Alert, 'alert');

    fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Invalid Credentials',
        'Email or password is incorrect.'
      );
    });

    mockAlert.mockRestore();
  });

  it('should navigate to Signup screen', () => {
    const { getByText } = render(
      <LoginScreen />,
      { wrapper: NavigationWrapper }
    );

    fireEvent.press(getByText("Don't have an account? Signup"));
    expect(global.mockedNavigate).toHaveBeenCalledWith('Signup');
  });
});
