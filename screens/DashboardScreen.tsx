import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DashboardStackParamList } from "@/navigation/DashboardStackNavigator";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BarChart, ChartData } from "@/components/BarChart";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, Activity, Session } from "@/utils/storage";

type NavigationProp = NativeStackNavigationProp<DashboardStackParamList>;
type TimeScale = "daily" | "weekly" | "monthly";

export default function DashboardScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [timeScale, setTimeScale] = useState<TimeScale>("weekly");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const loadData = async () => {
    const loadedActivities = await storage.getActivities();
    const loadedSessions = await storage.getSessions();
    
    const savedSelectedIds = await storage.getSelectedActivityIds();
    const selectedIds = savedSelectedIds.length > 0 
      ? savedSelectedIds 
      : loadedActivities.map((a) => a.id);
    
    setActivities(loadedActivities);
    setSessions(loadedSessions);
    setSelectedActivities(selectedIds);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const calculateChartData = useCallback(() => {
    const filteredSessions = sessions.filter(
      (s) => s.endTime && selectedActivities.includes(s.activityId)
    );

    const data: ChartData[] = [];

    if (timeScale === "daily") {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        date.setHours(0, 0, 0, 0);
        return date;
      });

      last7Days.forEach((date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const daySessions = filteredSessions.filter((s) => {
          const sessionDate = new Date(s.startTime);
          return sessionDate >= date && sessionDate < nextDay;
        });

        const totalHours = daySessions.reduce((sum, s) => {
          const duration =
            (new Date(s.endTime!).getTime() - new Date(s.startTime).getTime()) /
            (1000 * 60 * 60);
          return sum + duration;
        }, 0);

        data.push({
          label: date.toLocaleDateString("tr-TR", { weekday: "short" }),
          value: totalHours,
        });
      });
    } else if (timeScale === "weekly") {
      const last4Weeks = Array.from({ length: 4 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (3 - i) * 7);
        date.setHours(0, 0, 0, 0);
        const dayOfWeek = date.getDay();
        const monday = new Date(date);
        monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        return monday;
      });

      last4Weeks.forEach((monday, index) => {
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 7);

        const weekSessions = filteredSessions.filter((s) => {
          const sessionDate = new Date(s.startTime);
          return sessionDate >= monday && sessionDate < sunday;
        });

        const totalHours = weekSessions.reduce((sum, s) => {
          const duration =
            (new Date(s.endTime!).getTime() - new Date(s.startTime).getTime()) /
            (1000 * 60 * 60);
          return sum + duration;
        }, 0);

        data.push({
          label: `H${index + 1}`,
          value: totalHours,
        });
      });
    } else {
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date;
      });

      last6Months.forEach((month) => {
        const nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const monthSessions = filteredSessions.filter((s) => {
          const sessionDate = new Date(s.startTime);
          return sessionDate >= month && sessionDate < nextMonth;
        });

        const totalHours = monthSessions.reduce((sum, s) => {
          const duration =
            (new Date(s.endTime!).getTime() - new Date(s.startTime).getTime()) /
            (1000 * 60 * 60);
          return sum + duration;
        }, 0);

        data.push({
          label: month.toLocaleDateString("tr-TR", { month: "short" }),
          value: totalHours,
        });
      });
    }

    setChartData(data);
  }, [sessions, selectedActivities, timeScale]);

  useEffect(() => {
    if (sessions.length > 0 || selectedActivities.length > 0) {
      calculateChartData();
    }
  }, [calculateChartData]);

  const totalHours = chartData.reduce((sum, d) => sum + d.value, 0);
  const avgHours = chartData.length > 0 ? totalHours / chartData.length : 0;
  
  const formatTime = (hours: number) => {
    if (hours === 0) {
      return "0 dakika";
    }
    if (hours < 1) {
      const minutes = Math.max(1, Math.round(hours * 60));
      return `${minutes} dakika`;
    }
    return `${hours.toFixed(1)} saat`;
  };

  const activityBreakdown = React.useMemo(() => {
    const breakdown: { activityId: string; name: string; totalHours: number }[] = [];
    
    selectedActivities.forEach((activityId) => {
      const activity = activities.find((a) => a.id === activityId);
      if (!activity) return;
      
      const activitySessions = sessions.filter(
        (s) => s.activityId === activityId && s.endTime
      );
      
      const total = activitySessions.reduce((sum, s) => {
        const duration =
          (new Date(s.endTime!).getTime() - new Date(s.startTime).getTime()) /
          (1000 * 60 * 60);
        return sum + duration;
      }, 0);
      
      if (total > 0) {
        breakdown.push({ activityId, name: activity.name, totalHours: total });
      }
    });
    
    return breakdown.sort((a, b) => b.totalHours - a.totalHours);
  }, [activities, sessions, selectedActivities]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate("Filter")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            marginRight: Spacing.sm,
          })}
        >
          <Feather name="filter" size={24} color={theme.text} />
        </Pressable>
      ),
    });
  }, [navigation, theme]);

  const timeScales: { key: TimeScale; label: string }[] = [
    { key: "daily", label: "Günlük" },
    { key: "weekly", label: "Haftalık" },
    { key: "monthly", label: "Aylık" },
  ];

  return (
    <ScreenScrollView style={{ backgroundColor: theme.backgroundRoot }}>
      <View style={styles.content}>
        <View style={styles.filterChips}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {timeScales.map((scale) => (
              <Pressable
                key={scale.key}
                onPress={() => setTimeScale(scale.key)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor:
                      timeScale === scale.key
                        ? theme.primary
                        : theme.backgroundDefault,
                    borderColor: theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: timeScale === scale.key ? "#FFFFFF" : theme.text,
                    fontWeight: timeScale === scale.key ? "600" : "400",
                  }}
                >
                  {scale.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <ThemedView
          style={[styles.card, { backgroundColor: theme.backgroundDefault }]}
        >
          <BarChart data={chartData} unit="saat" />
        </ThemedView>

        <View style={styles.statsGrid}>
          <ThemedView
            style={[
              styles.statCard,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            ]}
          >
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              Toplam Süre
            </ThemedText>
            <ThemedText style={styles.statValue}>
              {formatTime(totalHours)}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.statCard,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            ]}
          >
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              Ortalama
            </ThemedText>
            <ThemedText style={styles.statValue}>
              {formatTime(avgHours)}
            </ThemedText>
          </ThemedView>
        </View>

        {activityBreakdown.length > 0 ? (
          <View style={styles.breakdownSection}>
            <ThemedText style={[styles.breakdownTitle, { color: theme.text }]}>
              Aktivite Bazlı Süre Dökümü
            </ThemedText>
            {activityBreakdown.map((item) => (
              <ThemedView
                key={item.activityId}
                style={[
                  styles.breakdownItem,
                  { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
                ]}
              >
                <ThemedText style={styles.breakdownName}>{item.name}</ThemedText>
                <ThemedText style={[styles.breakdownValue, { color: theme.primary }]}>
                  {formatTime(item.totalHours)}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        ) : null}

        {selectedActivities.length === 0 ? (
          <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
            Filtre seçin
          </ThemedText>
        ) : totalHours === 0 ? (
          <View style={styles.hintContainer}>
            <Feather name="info" size={20} color={theme.textSecondary} />
            <ThemedText style={[styles.hintText, { color: theme.textSecondary }]}>
              Henüz aktivite kaydı yok. Aktiviteler sekmesinden bir aktivite
              başlatıp durdurun, burada görünecektir.
            </ThemedText>
          </View>
        ) : null}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
  },
  filterChips: {
    marginBottom: Spacing.lg,
  },
  chipScroll: {
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    marginTop: Spacing["2xl"],
    fontSize: 16,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  breakdownSection: {
    marginTop: Spacing["2xl"],
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  breakdownName: {
    fontSize: 16,
    flex: 1,
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: "700",
  },
});
