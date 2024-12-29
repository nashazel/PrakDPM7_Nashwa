import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !password || !email) {
            setDialogMessage("All fields are required.");
            setIsSuccess(false);
            setDialogVisible(true);
            return;
        }

        try {
            await axios.post(`${API_URL}/api/auth/register`, { username, password, email });
            setDialogMessage("Registration successful! You can now log in.");
            setIsSuccess(true);
            setDialogVisible(true);
        } catch (error) {
            const errorMessage = (error.response?.data?.message || "An error occurred");
            setDialogMessage(errorMessage);
            setIsSuccess(false);
            setDialogVisible(true);
        }
    };

    const handleDialogDismiss = () => {
        setDialogVisible(false);
        if (isSuccess) {
            router.replace("/auth/LoginScreen");
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Create an Account</Text>
                <Text style={styles.subtitle}>Join us and get started</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/auth/LoginScreen")}>
                    <Text style={styles.loginButtonText}>Already have an account? Log in</Text>
                </TouchableOpacity>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={handleDialogDismiss} style={styles.dialogContainer}>
                        <Dialog.Title>{isSuccess ? "Success" : "Registration Failed"}</Dialog.Title>
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
        padding: 16,
        backgroundColor: "#FAFAFA", // Light gray background
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 24,
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        color: "#777",
        marginBottom: 24,
    },
    input: {
        width: "100%",
        height: 55,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 16,
        backgroundColor: "#fff",
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    registerButton: {
        width: "100%",
        height: 55,
        backgroundColor: "#6200EE", // Purple gradient button
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    loginButton: {
        width: "100%",
        height: 55,
        borderWidth: 1,
        borderColor: "#6200EE",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButtonText: {
        color: "#6200EE",
        fontSize: 16,
        fontWeight: "600",
    },
    dialogContainer: {
        borderRadius: 12,
        elevation: 6,
    },
});
