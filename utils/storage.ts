import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  USER_NAME: "@user_name",
  ACTIVITIES: "@activities",
  SESSIONS: "@sessions",
  HAS_COMPLETED_ONBOARDING: "@has_completed_onboarding",
  SELECTED_ACTIVITY_IDS: "@selected_activity_ids",
};

export interface Activity {
  id: string;
  name: string;
  createdAt: string;
  color?: string;
}

export interface Session {
  id: string;
  activityId: string;
  startTime: string;
  endTime: string | null;
}

export const storage = {
  async getUserName(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.USER_NAME);
    } catch (error) {
      console.error("Error getting user name:", error);
      return null;
    }
  },

  async setUserName(name: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_NAME, name);
    } catch (error) {
      console.error("Error setting user name:", error);
    }
  },

  async getHasCompletedOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEYS.HAS_COMPLETED_ONBOARDING);
      return value === "true";
    } catch (error) {
      console.error("Error getting onboarding status:", error);
      return false;
    }
  },

  async setHasCompletedOnboarding(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        KEYS.HAS_COMPLETED_ONBOARDING,
        completed.toString()
      );
    } catch (error) {
      console.error("Error setting onboarding status:", error);
    }
  },

  async getActivities(): Promise<Activity[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting activities:", error);
      return [];
    }
  },

  async saveActivities(activities: Activity[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (error) {
      console.error("Error saving activities:", error);
    }
  },

  async addActivity(activity: Activity): Promise<void> {
    try {
      const activities = await this.getActivities();
      activities.push(activity);
      await this.saveActivities(activities);
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  },

  async updateActivity(activityId: string, updates: Partial<Activity>): Promise<void> {
    try {
      const activities = await this.getActivities();
      const index = activities.findIndex((a) => a.id === activityId);
      if (index !== -1) {
        activities[index] = { ...activities[index], ...updates };
        await this.saveActivities(activities);
      }
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  },

  async deleteActivity(activityId: string): Promise<void> {
    try {
      const activities = await this.getActivities();
      const filtered = activities.filter((a) => a.id !== activityId);
      await this.saveActivities(filtered);
      
      const sessions = await this.getSessions();
      const filteredSessions = sessions.filter((s) => s.activityId !== activityId);
      await this.saveSessions(filteredSessions);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  },

  async getSessions(): Promise<Session[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting sessions:", error);
      return [];
    }
  },

  async saveSessions(sessions: Session[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error("Error saving sessions:", error);
    }
  },

  async startSession(activityId: string): Promise<Session> {
    try {
      const session: Session = {
        id: Date.now().toString(),
        activityId,
        startTime: new Date().toISOString(),
        endTime: null,
      };
      const sessions = await this.getSessions();
      sessions.push(session);
      await this.saveSessions(sessions);
      return session;
    } catch (error) {
      console.error("Error starting session:", error);
      throw error;
    }
  },

  async endSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getSessions();
      const index = sessions.findIndex((s) => s.id === sessionId);
      if (index !== -1) {
        sessions[index].endTime = new Date().toISOString();
        await this.saveSessions(sessions);
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  },

  async getActiveSession(activityId: string): Promise<Session | null> {
    try {
      const sessions = await this.getSessions();
      return sessions.find((s) => s.activityId === activityId && s.endTime === null) || null;
    } catch (error) {
      console.error("Error getting active session:", error);
      return null;
    }
  },

  async getSelectedActivityIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SELECTED_ACTIVITY_IDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting selected activity ids:", error);
      return [];
    }
  },

  async saveSelectedActivityIds(activityIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SELECTED_ACTIVITY_IDS, JSON.stringify(activityIds));
    } catch (error) {
      console.error("Error saving selected activity ids:", error);
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.USER_NAME,
        KEYS.ACTIVITIES,
        KEYS.SESSIONS,
        KEYS.HAS_COMPLETED_ONBOARDING,
        KEYS.SELECTED_ACTIVITY_IDS,
      ]);
    } catch (error) {
      console.error("Error clearing all data:", error);
    }
  },
};
