import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined; 
  Home: undefined;  
  Profile: undefined;  
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Toolbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image 
          source={require('../assets/images/LOGO_EDUCAHUB_2.png')} 
          style={styles.logo} 
        />
      </TouchableOpacity>

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
    backgroundColor: "#1f2937",
    padding: 10,
  },
  logo: {
    height: 40,
    width: 120, 
    resizeMode: "contain", 
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
    backgroundColor: "blue",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default Toolbar;
