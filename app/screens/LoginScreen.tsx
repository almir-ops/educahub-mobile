import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleLogin = async () => {
    try {
      await login(email, password); // Enviando email e senha corretamente
      navigation.navigate('Home'); // Redireciona para a Home após login bem-sucedido
    } catch (error:any) {
      Alert.alert('Erro de Login', error.message || 'Ocorreu um erro ao fazer login');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/LOGO_EDUCAHUB_2.png')} style={styles.logo} />
      <Text style={styles.title}>Entrar</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: '#2563eb',
    fontSize: 16,
  },
});

export default LoginScreen;
