import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "@/screens/DashboardScreen";
import FilterScreen from "@/screens/FilterScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type DashboardStackParamList = {
  Dashboard: undefined;
  Filter: undefined;
};

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export default function DashboardStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerTitle: "İstatistikler",
        }}
      />
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{
          presentation: "modal",
          headerTitle: "Filtre",
          headerTransparent: false,
        }}
      />
    </Stack.Navigator>
  );
}
