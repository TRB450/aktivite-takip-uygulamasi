import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import WelcomeScreen from "@/screens/WelcomeScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { storage } from "@/utils/storage";

export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const completed = await storage.getHasCompletedOnboarding();
    setHasCompletedOnboarding(completed);
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  if (hasCompletedOnboarding === null) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            {hasCompletedOnboarding ? (
              <NavigationContainer>
                <MainTabNavigator />
              </NavigationContainer>
            ) : (
              <WelcomeScreen onComplete={handleOnboardingComplete} />
            )}
            <StatusBar style="auto" />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
