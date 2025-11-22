import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Pressable, Alert, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ActivitiesStackParamList } from "@/navigation/ActivitiesStackNavigator";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ActivityCard } from "@/components/ActivityCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { storage, Activity, Session } from "@/utils/storage";

type NavigationProp = NativeStackNavigationProp<ActivitiesStackParamList>;

export default function ActivitiesScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeSessions, setActiveSessions] = useState<Map<string, Session>>(new Map());
  const [elapsedTimes, setElapsedTimes] = useState<Map<string, number>>(new Map());

  const loadData = async () => {
    const loadedActivities = await storage.getActivities();
    setActivities(loadedActivities);

    const sessionsMap = new Map<string, Session>();
    for (const activity of loadedActivities) {
      const activeSession = await storage.getActiveSession(activity.id);
      if (activeSession) {
        sessionsMap.set(activity.id, activeSession);
      }
    }
    setActiveSessions(sessionsMap);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = new Map<string, number>();
      activeSessions.forEach((session, activityId) => {
        const elapsed = Math.floor(
          (Date.now() - new Date(session.startTime).getTime()) / 1000
        );
        newTimes.set(activityId, elapsed);
      });
      setElapsedTimes(newTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSessions]);

  const handleStart = async (activityId: string) => {
    try {
      const session = await storage.startSession(activityId);
      setActiveSessions(new Map(activeSessions.set(activityId, session)));
    } catch (error) {
      Alert.alert("Hata", "Aktivite başlatılamadı");
    }
  };

  const handleStop = async (activityId: string) => {
    const session = activeSessions.get(activityId);
    if (session) {
      try {
        await storage.endSession(session.id);
        const newSessions = new Map(activeSessions);
        newSessions.delete(activityId);
        setActiveSessions(newSessions);
        const newTimes = new Map(elapsedTimes);
        newTimes.delete(activityId);
        setElapsedTimes(newTimes);
      } catch (error) {
        Alert.alert("Hata", "Aktivite durdurulamadı");
      }
    }
  };

  const handleEdit = (activityId: string) => {
    navigation.navigate("AddActivity", { activityId });
  };

  const getLastSessionText = async (activityId: string): Promise<string> => {
    const sessions = await storage.getSessions();
    const activitySessions = sessions
      .filter((s) => s.activityId === activityId && s.endTime)
      .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime());

    if (activitySessions.length === 0) return "";

    const lastSession = activitySessions[0];
    const date = new Date(lastSession.endTime!);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [lastSessions, setLastSessions] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const loadLastSessions = async () => {
      const map = new Map<string, string>();
      for (const activity of activities) {
        const text = await getLastSessionText(activity.id);
        if (text) map.set(activity.id, text);
      }
      setLastSessions(map);
    };
    loadLastSessions();
  }, [activities]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate("AddActivity")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            marginRight: Spacing.sm,
          })}
        >
          <Feather name="plus" size={24} color={theme.text} />
        </Pressable>
      ),
    });
  }, [navigation, theme]);

  return (
    <ScreenScrollView style={{ backgroundColor: theme.backgroundRoot }}>
      {activities.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="clock" size={64} color={theme.textSecondary} />
          <ThemedText
            style={[styles.emptyText, { color: theme.textSecondary }]}
          >
            Henüz aktivite eklemediniz
          </ThemedText>
          <ThemedText
            style={[styles.emptySubtext, { color: theme.textSecondary }]}
          >
            Üstteki + butonuna basarak yeni aktivite ekleyin
          </ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              name={activity.name}
              isActive={activeSessions.has(activity.id)}
              elapsedTime={elapsedTimes.get(activity.id) || 0}
              lastSession={lastSessions.get(activity.id)}
              onStart={() => handleStart(activity.id)}
              onStop={() => handleStop(activity.id)}
              onPress={() => handleEdit(activity.id)}
            />
          ))}
        </View>
      )}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing["5xl"],
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
});
