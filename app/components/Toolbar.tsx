import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Definindo as rotas da aplicação
type RootStackParamList = {
  Login: undefined; // A tela de login não precisa de parâmetros
  Home: undefined;  // Exemplo: caso tenha uma tela "Home"
  Profile: undefined;  // Exemplo: caso tenha uma tela "Home"

};

// Tipagem correta do navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Toolbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>(); // Tipagem correta

  return (
    <View style={styles.toolbar}>
      <Text style={styles.message}>Bem-vindo ao EducaHub</Text>

      {user ? (
        <View style={styles.userContainer}>
          <Text style={styles.username}>{user.name}</Text>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Profile")}>
            <Text style={styles.buttonText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6200ea",
    padding: 15,
  },
  message: {
    color: "#fff",
    fontSize: 16,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "#fff",
    marginRight: 10,
  },
  button: {
    backgroundColor: "#3700b3",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default Toolbar;
