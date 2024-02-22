import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Slot } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return (
    <FontAwesome
      size={28}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Slot />
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    //     // Disable the static render of the header on web
    //     // to prevent a hydration error in React Navigation v6.
    //     headerShown: false,
    //     tabBarShowLabel: false,
    //   }}
    // >
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: 'Countdown',
    //       tabBarIcon: ({ color }) => (
    //         <TabBarIcon
    //           name="clock-o"
    //           color={color}
    //         />
    //       ),
    //       headerRight: () => (
    //         <Link
    //           href="/modal"
    //           asChild
    //         >
    //           <Pressable>
    //             {({ pressed }) => (
    //               <FontAwesome
    //                 name="info-circle"
    //                 size={25}
    //                 color={Colors[colorScheme ?? 'light'].text}
    //                 style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
    //               />
    //             )}
    //           </Pressable>
    //         </Link>
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="two"
    //     options={{
    //       title: 'Stopwatch',
    //       tabBarIcon: ({ color }) => (
    //         <TabBarIcon
    //           name="stop-circle-o"
    //           color={color}
    //         />
    //       ),
    //     }}
    //   />
    // </Tabs>
  );
}
