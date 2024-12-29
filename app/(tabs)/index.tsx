import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';
import Constants from 'expo-constants/src/Constants';

const TodosScreen = () => {
    const { todos, fetchTodos } = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };
        loadTodos();
    }, []);

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both title and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description,
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
        } catch (error) {
            setDialogMessage('Failed to add todo');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete todo');
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title} type="title">ToDo List</ThemedText>
                {loading ? (
                    <View style={styles.loading}>
                        <ActivityIndicator animating={true} size="large" color="#007bff" />
                        <Text style={styles.loadingText}>Loading todos...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={todos}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <Card style={styles.card} elevation={6} onPress={() => router.push(`../todo/${item._id}`)}>
                                <Card.Content>
                                    <Text variant="titleLarge" style={styles.cardTitle}>{item.title}</Text>
                                    <Text variant="bodyMedium" style={styles.cardDescription}>{item.description}</Text>
                                </Card.Content>
                                <Card.Actions>
                                    <Button onPress={() => handleDeleteTodo(item._id)} mode="outlined" style={styles.deleteButton}>Delete</Button>
                                </Card.Actions>
                            </Card>
                        )}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
                {isAdding && (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputContainer}>
                        <TextInput
                            label="Title"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                            mode="outlined"
                            autoFocus
                            theme={{ colors: { primary: '#007bff' } }}
                        />
                        <TextInput
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            style={styles.input}
                            mode="outlined"
                            multiline
                            theme={{ colors: { primary: '#007bff' } }}
                        />
                        <Button mode="contained" onPress={handleAddTodo} style={styles.addButton}>Add Todo</Button>
                        <Button onPress={() => setIsAdding(false)} style={styles.cancelButton}>Cancel</Button>
                    </KeyboardAvoidingView>
                )}
                {!isAdding && (
                    <FAB style={styles.fab} icon="plus" onPress={() => setIsAdding(true)} label="Add Todo" />
                )}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Alert</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#fff',
    },
    title: {
        marginTop: 16,
        marginHorizontal: 16,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007bff', // Blue color for the title
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 80, // To prevent content being hidden behind FAB
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#333',
    },
    cardDescription: {
        marginTop: 8,
        color: '#666',
    },
    deleteButton: {
        color: '#d9534f',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#007bff',
    },
    inputContainer: {
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 6,
    },
    input: {
        marginBottom: 12,
    },
    addButton: {
        marginTop: 16,
        backgroundColor: '#007bff',
    },
    cancelButton: {
        marginTop: 8,
        backgroundColor: '#f1f1f1',
        color: '#007bff',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 16,
        color: '#007bff',
    },
});

export default TodosScreen;
