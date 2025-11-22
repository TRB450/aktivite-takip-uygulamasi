import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DashboardStackParamList } from "@/navigation/DashboardStackNavigator";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, Activity } from "@/utils/storage";

type NavigationProp = NativeStackNavigationProp<DashboardStackParamList>;

export default function FilterScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const loadedActivities = await storage.getActivities();
    setActivities(loadedActivities);
    
    const savedSelectedIds = await storage.getSelectedActivityIds();
    if (savedSelectedIds.length > 0) {
      setSelectedIds(new Set(savedSelectedIds));
    } else {
      setSelectedIds(new Set(loadedActivities.map((a) => a.id)));
    }
  };

  const toggleActivity = async (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    await storage.saveSelectedActivityIds(Array.from(newSelected));
  };

  const toggleAll = async () => {
    let newSelected: Set<string>;
    if (selectedIds.size === activities.length) {
      newSelected = new Set();
    } else {
      newSelected = new Set(activities.map((a) => a.id));
    }
    setSelectedIds(newSelected);
    await storage.saveSelectedActivityIds(Array.from(newSelected));
  };

  const handleApply = async () => {
    await storage.saveSelectedActivityIds(Array.from(selectedIds));
    navigation.goBack();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      await storage.saveSelectedActivityIds(Array.from(selectedIds));
    });

    return unsubscribe;
  }, [navigation, selectedIds]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => (
        <Pressable
          onPress={handleApply}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            marginRight: Spacing.sm,
          })}
        >
          <ThemedText
            style={{ color: theme.primary, fontWeight: "600", fontSize: 16 }}
          >
            Uygula
          </ThemedText>
        </Pressable>
      ),
    });
  }, [navigation, theme, handleApply]);

  return (
    <ScreenScrollView
      style={{ backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={styles.content}
    >
      <Pressable
        onPress={toggleAll}
        style={({ pressed }) => [
          styles.toggleAllButton,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: theme.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <ThemedText style={styles.toggleAllText}>
          {selectedIds.size === activities.length
            ? "Tümünü Kaldır"
            : "Tümünü Seç"}
        </ThemedText>
      </Pressable>

      {activities.map((activity) => {
        const isSelected = selectedIds.has(activity.id);
        return (
          <Pressable
            key={activity.id}
            onPress={() => toggleActivity(activity.id)}
            style={({ pressed }) => [
              styles.checkboxItem,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: isSelected ? theme.primary : theme.border,
                  backgroundColor: isSelected ? theme.primary : "transparent",
                },
              ]}
            >
              {isSelected ? (
                <Feather name="check" size={16} color="#FFFFFF" />
              ) : null}
            </View>
            <ThemedText style={styles.activityName}>{activity.name}</ThemedText>
          </Pressable>
        );
      })}

      {activities.length === 0 ? (
        <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
          Henüz aktivite eklemediniz
        </ThemedText>
      ) : null}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
  },
  toggleAllButton: {
    height: 48,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  toggleAllText: {
    fontSize: 16,
    fontWeight: "600",
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  activityName: {
    fontSize: 16,
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: Spacing["2xl"],
    fontSize: 16,
  },
});
