import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
    ActivityIndicator,
    Button,
    Dialog,
    Portal,
    Text,
    Card,
    Provider as PaperProvider,
} from 'react-native-paper';
import API_URL from '@/config/config';

type UserProfile = {
    username: string;
    email: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    if (loading) {
        return (
            <PaperProvider>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} size="large" color="#6200ee" />
                </View>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <View style={styles.container}>
                {profile ? (
                    <Card style={styles.card}>
                        <Card.Title
                            title="Your Profile"
                            subtitle="View your details"
                            style={styles.cardTitle}
                        />
                        <Card.Content>
                            <Text style={styles.label}>Username:</Text>
                            <Text style={styles.value}>{profile.username}</Text>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{profile.email}</Text>
                        </Card.Content>
                        <Card.Actions style={styles.cardActions}>
                            <Button
                                mode="contained"
                                onPress={handleLogout}
                                style={styles.logoutButton}
                                color="#d32f2f"
                            >
                                Log Out
                            </Button>
                        </Card.Actions>
                    </Card>
                ) : (
                    <Text style={styles.noProfileText}>No profile data available</Text>
                )}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Logout</Dialog.Title>
                        <Dialog.Content>
                            <Text>Are you sure you want to logout?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)} color="#6200ee">
                                Cancel
                            </Button>
                            <Button onPress={confirmLogout} color="#d32f2f">
                                OK
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f4f4f4',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        elevation: 6,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    cardTitle: {
        backgroundColor: '#6200ee',
        color: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
        color: '#333',
    },
    value: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    cardActions: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    logoutButton: {
        width: '60%',
        marginTop: 16,
    },
    noProfileText: {
        fontSize: 18,
        color: '#999',
    },
});

export default ProfileScreen;
