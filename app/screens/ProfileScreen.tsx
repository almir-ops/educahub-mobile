import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Modal, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { API_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importando AsyncStorage
import { Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface CustomJwtPayload extends JwtPayload {
  id: string; // Tipo de dado do ID no token
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Estado do modal
  const [newPostTitle, setNewPostTitle] = useState<string>(""); // Título do novo post
  const [newPostContent, setNewPostContent] = useState<string>(""); // Conteúdo do novo post
  const [categoryId, setCategoryId] = useState<string>(""); // Categoria selecionada
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    const getUserIdFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('@user'); // Usando AsyncStorage
        if (token) {
          const decoded = jwtDecode<CustomJwtPayload>(token);
          return decoded.id;
        }
        return null;
      } catch (error) {
        console.error('Erro ao decodificar o token JWT:', error);
        return null;
      }
    };

    const fetchUserData = async () => {
      const userIdFromToken = await getUserIdFromToken();
      if (userIdFromToken) {
        console.log(userIdFromToken);
        
        try {
          const response = await fetch(`${API_URL}/auth/profile/${userIdFromToken}`);
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        console.error('Erro ao buscar dados do usuário: null');
      }
    };

    const fetchUserPosts = async () => {
      const userIdFromToken = await getUserIdFromToken();
      if (userIdFromToken) {
        try {
          const response = await fetch(`${API_URL}/posts/user/${userIdFromToken}`);
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error('Erro ao buscar posts do usuário:', error);
        }
      } else {
        console.error('Erro ao buscar posts do usuário: null');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchUserData();
    fetchUserPosts();
    fetchCategories();
    setIsLoading(false);
  }, []);

  const handleEditUser = async (newData: any) => {
    try {
      const response = await fetch(`${API_URL}/users/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      if (!response.ok) {
        throw new Error("Erro ao editar usuário");
      }
      const updatedUser = await response.json();
      setUserData(updatedUser);
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
    }
  };

  const handleDeletePost = async (postId: any) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao excluir post");
      }
      setPosts(posts.filter((post: any) => post.id !== postId));
    } catch (error) {
      console.error("Erro ao excluir post:", error);
    }
  };

  const openEditPostModal = (post: any) => {
    navigation.navigate("EditPost", { post });
  };

  const openCreatePostModal = () => {
    setModalVisible(true); // Abre o modal
  };

  const createNewPost = async () => {
    if (newPostTitle && newPostContent && categoryId) { // Verificando se a categoria foi selecionada
      try {
        console.log('das');

        const response = await fetch(`${API_URL}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: 'newPostTitle',
            content: newPostContent,
            categoryId: categoryId, // Incluindo categoria no corpo da requisição
            userId: userData.id,
            author: userData.name
        }),
    });
        
        if (!response.ok) {
          throw new Error("Erro ao criar post");
        }
        const newPost = await response.json();
        setPosts([newPost, ...posts]); // Adiciona o novo post à lista
        setModalVisible(false); // Fecha o modal
      } catch (error) {
        console.error("Erro ao criar post:", error);
      }
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {userData && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Perfil de {userData.name}</Text>
          <Text style={{ fontSize: 18, marginVertical: 8 }}>Email: {userData.email}</Text>
          <Button title="Editar Perfil" onPress={() => handleEditUser({ name: "Novo Nome", email: "novoemail@example.com" })} />
        </View>
      )}

      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Posts</Text>
        <Button title="Criar Novo Post" onPress={openCreatePostModal} />
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <View key={post.id} style={{ marginBottom: 16, padding: 12, backgroundColor: "#fff", borderRadius: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{post.title}</Text>
              <Text>{post.content}</Text>
              <Button title="Editar" onPress={() => openEditPostModal(post)} />
              <Button title="Excluir" onPress={() => handleDeletePost(post.id)} color="red" />
            </View>
          ))
        ) : (
          <Text>Nenhum post encontrado</Text>
        )}
      </View>

      {/* Modal para criar novo post */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Criar Novo Post</Text>
          <TextInput
            placeholder="Título do Post"
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            style={{ borderWidth: 1, marginBottom: 16, padding: 8 }}
          />
          <TextInput
            placeholder="Conteúdo do Post"
            value={newPostContent}
            onChangeText={setNewPostContent}
            style={{ borderWidth: 1, marginBottom: 16, padding: 8, height: 100 }}
            multiline
          />

          <View>
            <Text>Selecione uma categoria</Text>
            {Platform.OS === 'web' ? (
              <select onChange={(e) => setCategoryId(e.target.value)}>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            ) : (
              <RNPickerSelect
                onValueChange={(itemValue) => setCategoryId(itemValue)}
                items={categories.map((category: any) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
            )}
          </View>
          
          <Button title="Criar Post" onPress={createNewPost} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
