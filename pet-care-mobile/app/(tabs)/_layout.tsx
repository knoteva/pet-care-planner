import { SymbolView } from "expo-symbols";
import { Link, Tabs } from "expo-router";
import { Platform, Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
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
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 15 }}>
                {({ pressed }) => (
                  <SymbolView
                    name={{ ios: "info.circle", android: "info", web: "info" }}
                    size={25}
                    tintColor={Colors[colorScheme].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: "Любимци",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "heart",
                android: "favorite",
                web: "favorite",
              }}
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
              name={{
                ios: "person.3",
                android: "groups",
                web: "groups",
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          title: "Вход",
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
    </Tabs>
  );
}
