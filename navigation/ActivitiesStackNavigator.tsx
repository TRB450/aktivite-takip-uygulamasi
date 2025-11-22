import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActivitiesScreen from "@/screens/ActivitiesScreen";
import AddActivityScreen from "@/screens/AddActivityScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ActivitiesStackParamList = {
  Activities: undefined;
  AddActivity: { activityId?: string } | undefined;
};

const Stack = createNativeStackNavigator<ActivitiesStackParamList>();

export default function ActivitiesStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Aktivite Takip" />,
        }}
      />
      <Stack.Screen
        name="AddActivity"
        component={AddActivityScreen}
        options={{
          presentation: "modal",
          headerTitle: "Yeni Aktivite",
          headerTransparent: false,
        }}
      />
    </Stack.Navigator>
  );
}
