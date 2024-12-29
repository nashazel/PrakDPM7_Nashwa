import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "@/config/config";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0)); // Used for dialog animation
    const router = useRouter();

    const handleLogin = async () => {
        if (!username || !password) {
            setDialogMessage("Username and password cannot be empty.");
            setIsSuccess(false);
            setDialogVisible(true);
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
            const { token } = response.data.data;
            await AsyncStorage.setItem("token", token);
            setDialogMessage("Login successful! Redirecting...");
            setIsSuccess(true);
            setDialogVisible(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            setDialogMessage(errorMessage);
            setIsSuccess(false);
            setDialogVisible(true);
        }
    };

    const handleDialogDismiss = () => {
        setDialogVisible(false);
        if (isSuccess) {
            router.replace("/(tabs)");
        }
    };

    // Fade-in animation for the dialog
    const animateDialog = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    // Trigger the fade animation once dialog is visible
    React.useEffect(() => {
        if (dialogVisible) {
            animateDialog();
        }
    }, [dialogVisible]);

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Log in to your account</Text>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/auth/RegisterScreen")}>
                        <Text style={styles.registerButtonText}>Don’t have an account? Register</Text>
                    </TouchableOpacity>
                </View>

                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={handleDialogDismiss} style={styles.dialogContainer}>
                        <Dialog.Title>{isSuccess ? "Success" : "Error"}</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleDialogDismiss} color={isSuccess ? "#4CAF50" : "#D32F2F"}>
                                OK
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f9", // Light gray background
        paddingHorizontal: 24,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
        resizeMode: "contain",
    },
    title: {
        fontSize: 34,
        fontWeight: "700",
        color: "#333",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: "#777",
        marginBottom: 40,
    },
    formContainer: {
        width: "100%",
        alignItems: "center",
    },
    input: {
        width: "100%",
        height: 55,
        borderColor: "#e0e0e0", // Light border
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: "#fff",
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    loginButton: {
        width: "100%",
        height: 55,
        backgroundColor: "#6200EE", // Purple gradient button
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    registerButton: {
        marginTop: 10,
    },
    registerButtonText: {
        color: "#6200EE",
        fontSize: 14,
        fontWeight: "500",
    },
    dialogContainer: {
        borderRadius: 12,
        elevation: 6,
    },
});
