import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface ActivityCardProps {
  name: string;
  isActive: boolean;
  elapsedTime?: number;
  lastSession?: string;
  onStart: () => void;
  onStop: () => void;
  onPress: () => void;
}

export function ActivityCard({
  name,
  isActive,
  elapsedTime = 0,
  lastSession,
  onStart,
  onStop,
  onPress,
}: ActivityCardProps) {
  const { theme } = useTheme();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isActive ? theme.success : theme.textSecondary },
          ]}
        >
          <ThemedText style={styles.statusText}>
            {isActive ? "Aktif" : "Durduruldu"}
          </ThemedText>
        </View>
      </View>

      {isActive ? (
        <ThemedText
          style={[styles.timer, { color: theme.success, fontFamily: "monospace" }]}
        >
          {formatTime(elapsedTime)}
        </ThemedText>
      ) : null}

      {lastSession ? (
        <ThemedText style={[styles.lastSession, { color: theme.textSecondary }]}>
          Son: {lastSession}
        </ThemedText>
      ) : null}

      <Pressable
        onPress={isActive ? onStop : onStart}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: isActive ? theme.danger : theme.success,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Feather
          name={isActive ? "square" : "play"}
          size={20}
          color={theme.buttonText}
        />
        <ThemedText style={[styles.buttonText, { color: theme.buttonText }]}>
          {isActive ? "Durdur" : "Başla"}
        </ThemedText>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  timer: {
    fontSize: 32,
    fontWeight: "700",
    marginVertical: Spacing.sm,
  },
  lastSession: {
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: BorderRadius.xs,
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
