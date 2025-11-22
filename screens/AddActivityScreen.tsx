import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, Pressable, Alert, Platform } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ActivitiesStackParamList } from "@/navigation/ActivitiesStackNavigator";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { storage, Activity } from "@/utils/storage";

type RoutePropType = RouteProp<ActivitiesStackParamList, "AddActivity">;
type NavigationProp = NativeStackNavigationProp<ActivitiesStackParamList>;

export default function AddActivityScreen() {
  const { theme } = useTheme();
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const activityId = route.params?.activityId;
  const isEditing = !!activityId;

  useEffect(() => {
    if (isEditing) {
      loadActivity();
    }
  }, [activityId]);

  const loadActivity = async () => {
    if (!activityId) return;
    const activities = await storage.getActivities();
    const activity = activities.find((a) => a.id === activityId);
    if (activity) {
      setName(activity.name);
    }
  };

  const handleSave = React.useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Hata", "Lütfen aktivite adını girin");
      return;
    }

    setLoading(true);
    try {
      if (isEditing && activityId) {
        await storage.updateActivity(activityId, { name: name.trim() });
      } else {
        const newActivity: Activity = {
          id: Date.now().toString(),
          name: name.trim(),
          createdAt: new Date().toISOString(),
        };
        await storage.addActivity(newActivity);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Hata", "Aktivite kaydedilemedi");
    } finally {
      setLoading(false);
    }
  }, [name, isEditing, activityId, navigation]);

  const handleDelete = React.useCallback(async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        "Bu aktiviteyi ve tüm kayıtlarını silmek istediğinize emin misiniz?"
      );
      if (confirmed && activityId) {
        await storage.deleteActivity(activityId);
        navigation.goBack();
      }
    } else {
      Alert.alert(
        "Aktiviteyi Sil",
        "Bu aktiviteyi ve tüm kayıtlarını silmek istediğinize emin misiniz?",
        [
          { text: "İptal", style: "cancel" },
          {
            text: "Sil",
            style: "destructive",
            onPress: async () => {
              if (activityId) {
                await storage.deleteActivity(activityId);
                navigation.goBack();
              }
            },
          },
        ]
      );
    }
  }, [activityId, navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: isEditing ? "Aktiviteyi Düzenle" : "Yeni Aktivite",
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
            marginLeft: Spacing.sm,
          })}
        >
          <ThemedText style={{ color: theme.primary }}>İptal</ThemedText>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={({ pressed }) => ({
            opacity: pressed || loading ? 0.5 : 1,
            marginRight: Spacing.sm,
          })}
        >
          <ThemedText
            style={{ color: theme.primary, fontWeight: "600" }}
          >
            Kaydet
          </ThemedText>
        </Pressable>
      ),
    });
  }, [navigation, theme, loading, isEditing, handleSave]);

  return (
    <ScreenKeyboardAwareScrollView
      style={{ backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={styles.content}
    >
      <ThemedText style={styles.label}>Aktivite Adı</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Örn: Kitap Okuma, Spor, Kod Yazma"
        placeholderTextColor={theme.textSecondary}
        value={name}
        onChangeText={setName}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />

      {isEditing ? (
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            {
              borderColor: theme.danger,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ThemedText style={[styles.deleteText, { color: theme.danger }]}>
            Aktiviteyi Sil
          </ThemedText>
        </Pressable>
      ) : null}
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  deleteButton: {
    marginTop: Spacing["4xl"],
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
