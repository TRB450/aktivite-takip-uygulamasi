import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Alert, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage } from "@/utils/storage";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    const name = await storage.getUserName();
    if (name) setUserName(name);
  };

  const handleExportData = async () => {
    try {
      console.log("[EXPORT] Starting export...");
      const activities = await storage.getActivities();
      const sessions = await storage.getSessions();
      const userName = await storage.getUserName();
      console.log("[EXPORT] Data loaded:", { activities: activities.length, sessions: sessions.length });
      
      const exportData = {
        exportDate: new Date().toISOString(),
        userName,
        activities,
        sessions,
        version: "1.0.0",
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `aktivite-takip-${new Date().toISOString().split('T')[0]}.json`;
      console.log("[EXPORT] Filename:", fileName, "Platform:", Platform.OS);
      
      if (Platform.OS === 'web') {
        console.log("[EXPORT] Creating blob and download link...");
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        console.log("[EXPORT] Clicking download link...");
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("[EXPORT] Download triggered successfully!");
      } else {
        Alert.alert("Bilgi", "Export özelliği şu anda sadece web sürümünde kullanılabilir. Lütfen telefonunuzdaki Expo Go uygulaması yerine web tarayıcınızdan deneyin.");
      }
    } catch (error) {
      console.error("[EXPORT] Export error:", error);
      Alert.alert("Hata", "Veriler dışa aktarılırken bir hata oluştu");
    }
  };

  const handleClearData = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        "Tüm aktiviteleriniz ve kayıtlarınız silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?"
      );
      if (confirmed) {
        await storage.clearAllData();
        setUserName("");
        window.alert("Tüm verileriniz temizlendi. Sayfa yeniden yüklenecek.");
        window.location.reload();
      }
    } else {
      Alert.alert(
        "Verileri Temizle",
        "Tüm aktiviteleriniz ve kayıtlarınız silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?",
        [
          { text: "İptal", style: "cancel" },
          {
            text: "Temizle",
            style: "destructive",
            onPress: async () => {
              await storage.clearAllData();
              setUserName("");
              Alert.alert("Başarılı", "Tüm verileriniz temizlendi");
            },
          },
        ]
      );
    }
  };

  const MenuItem = ({
    icon,
    title,
    onPress,
    danger = false,
  }: {
    icon: keyof typeof Feather.glyphMap;
    title: string;
    onPress: () => void;
    danger?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Feather
        name={icon}
        size={20}
        color={danger ? theme.danger : theme.text}
      />
      <ThemedText
        style={[styles.menuText, danger ? { color: theme.danger } : null]}
      >
        {title}
      </ThemedText>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );

  return (
    <ScreenScrollView
      style={{ backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={styles.content}
    >
      <View style={styles.profileHeader}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.primary, borderColor: theme.border },
          ]}
        >
          <ThemedText style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <ThemedText style={styles.userName}>{userName}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          HESAP
        </ThemedText>
        <MenuItem
          icon="user"
          title="Profil Bilgileri"
          onPress={() => Alert.alert("Bilgi", "Yakında eklenecek")}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          VERİ
        </ThemedText>
        <MenuItem
          icon="download"
          title="Verileri Dışa Aktar"
          onPress={handleExportData}
        />
        <MenuItem
          icon="trash-2"
          title="Tüm Verileri Temizle"
          onPress={handleClearData}
          danger
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          HAKKINDA
        </ThemedText>
        <MenuItem
          icon="info"
          title="Sürüm"
          onPress={() => Alert.alert("Sürüm", "1.0.0")}
        />
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
});
