import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
                tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].secondary,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: [
                    styles.tabBar,
                    Platform.select({
                        ios: {
                            position: 'absolute',
                            borderTopWidth: 0,
                            borderRadius: 30,
                            marginBottom: 10,
                        },
                        default: {},
                    }),
                ],
                tabBarBackground: () => (
                    <View
                        style={[styles.tabBarBackground, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
                    />
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Todos',
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            style={[
                                styles.iconContainer,
                                focused && styles.iconFocused,
                                { backgroundColor: focused ? Colors[colorScheme ?? 'light'].primary : 'transparent' },
                            ]}
                        >
                            <IconSymbol size={30} name="list.fill" color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            style={[
                                styles.iconContainer,
                                focused && styles.iconFocused,
                                { backgroundColor: focused ? Colors[colorScheme ?? 'light'].primary : 'transparent' },
                            ]}
                        >
                            <IconSymbol size={30} name="person.fill" color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'transparent',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: -4 },
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 10,
    },
    tabBarBackground: {
        ...StyleSheet.absoluteFillObject,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 25,
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s ease-in-out',
    },
    iconFocused: {
        backgroundColor: 'rgba(0, 122, 255, 0.1)', // Light blue background when focused
        borderRadius: 25,
    },
});
