import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Modal, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { API_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface CustomJwtPayload extends JwtPayload {
  id: string; 
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false); 
  const [newPostTitle, setNewPostTitle] = useState<string>(""); 
  const [newPostContent, setNewPostContent] = useState<string>(""); 
  const [categoryId, setCategoryId] = useState<string>(""); 
  const [isEditing, setIsEditing] = useState<boolean>(false); 
  const [currentPost, setCurrentPost] = useState<any>(null); 
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    const getUserIdFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('@user'); 
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
    setCurrentPost(post); 
    setNewPostTitle(post.title); 
    setNewPostContent(post.content); 
    setCategoryId(post.categoryId); 
    setIsEditing(true); 
    setModalVisible(true); 
  };

  const openCreatePostModal = () => {
    setCurrentPost(null); 
    setNewPostTitle("");
    setNewPostContent("");
    setCategoryId(""); 
    setIsEditing(false);
    setModalVisible(true);
  };

  const createNewPost = async () => {
    if (newPostTitle && newPostContent && categoryId) {
      try {
        const response = await fetch(`${API_URL}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newPostTitle,
            content: newPostContent,
            categoryId: categoryId,
            userId: userData.id,
            author: userData.name,
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

  const updatePost = async () => {
    if (newPostTitle && newPostContent && categoryId && currentPost) {
      try {
        const response = await fetch(`${API_URL}/posts/${currentPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newPostTitle,
            content: newPostContent,
            categoryId: categoryId,
            author: userData.name, 
            userId: userData.id,  
          }),
        });
  
        if (!response.ok) {
          // Captura a mensagem de erro da API
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao atualizar post");
        }
  
        const updatedPost = await response.json();
        setPosts(posts.map((post: any) => (post.id === updatedPost.id ? updatedPost : post))); // Atualiza o post na lista
        setModalVisible(false); // Fecha o modal
      } catch (error: any) {
        console.error("Erro ao atualizar post:", error.message); // Exibe a mensagem de erro no console
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
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Perfil de Professor</Text>
          <Text style={{ fontSize: 18, marginVertical: 8 }}>Nome: {userData.name}</Text>
          <Text style={{ fontSize: 18, marginVertical: 2 }}>Email: {userData.email}</Text>
        </View>
      )}

      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Posts</Text>
        <Button title="Criar Novo Post" onPress={openCreatePostModal} />
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <View key={post.id} style={{ marginTop: 10, marginBottom: 16, padding: 12, backgroundColor: "#fff", borderRadius: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{post.title}</Text>
              <Text>{post.content}</Text>
              <View style={{ marginTop: 10 }}>
                <Button title="Editar" onPress={() => openEditPostModal(post)} />
              </View>
              <View style={{ marginTop: 10 }}>
                <Button title="Excluir" onPress={() => handleDeletePost(post.id)} color="red" />
              </View>
            </View>
          ))
        ) : (
          <Text>Nenhum post encontrado</Text>
        )}
      </View>

      {/* Modal para criar/editar post */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
            {isEditing ? "Editar Post" : "Criar Novo Post"}
          </Text>
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
              <select onChange={(e) => setCategoryId(e.target.value)} value={categoryId}>
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
                value={categoryId}
              />
            )}
          </View>

          <Button
            title={isEditing ? "Atualizar Post" : "Criar Post"}
            onPress={isEditing ? updatePost : createNewPost}
          />
          <View style={{ marginTop: 10 }}>
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;