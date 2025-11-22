import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - Spacing.lg * 4;
const CHART_HEIGHT = 200;

export interface ChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
  unit?: string;
}

export function BarChart({ data, unit = "saat" }: BarChartProps) {
  const { theme } = useTheme();

  if (data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText style={{ color: theme.textSecondary }}>
          Henüz veri yok
        </ThemedText>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = CHART_WIDTH / data.length - Spacing.sm;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * CHART_HEIGHT;

          return (
            <View key={index} style={styles.barContainer}>
              <View style={[styles.barWrapper, { height: CHART_HEIGHT }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: barWidth,
                      height: barHeight,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
              <ThemedText
                style={[
                  styles.label,
                  {
                    color: theme.textSecondary,
                    width: barWidth + Spacing.sm,
                  },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </ThemedText>
              <ThemedText
                style={[
                  styles.value,
                  {
                    color: theme.text,
                    width: barWidth + Spacing.sm,
                  },
                ]}
              >
                {item.value < 1 
                  ? `${Math.max(1, Math.round(item.value * 60))}dk`
                  : item.value.toFixed(1)}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.sm,
  },
  barContainer: {
    alignItems: "center",
  },
  barWrapper: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  label: {
    fontSize: 12,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: Spacing.lg,
  },
});
