import { SymbolView } from "expo-symbols";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Табло",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "calendar",
                android: "calendar_month",
                web: "calendar_month",
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: "Любимци",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "heart", android: "favorite", web: "favorite" }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Групи",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "person.3", android: "groups", web: "groups" }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          title: "Профил",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "person.crop.circle",
                android: "account_circle",
                web: "account_circle",
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{ href: null, title: "Регистрация" }}
      />
    </Tabs>
  );
}
