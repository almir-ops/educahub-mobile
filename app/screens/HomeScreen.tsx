import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, ActivityIndicator } from "react-native";
import { API_URL } from "../config/api";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true); 

      try {
        const categoriesResponse = await fetch(`${API_URL}/categories`);
        const categoriesData = await categoriesResponse.json();

        const postsResponse = await fetch(`${API_URL}/posts`);
        const postsData = await postsResponse.json();

        if (isMounted) {
          setCategories(categoriesData);
          setPosts(postsData);
          setFilteredPosts(postsData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilter = () => {
    let filtered = posts;

    if (filterCategory) {
      filtered = filtered.filter((post: any) => post.categoryName === filterCategory);
    }

    if (filterTitle) {
      filtered = filtered.filter((post: any) => post.title.toLowerCase().includes(filterTitle.toLowerCase()));
    }

    setFilteredPosts(filtered);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Filtrar por título da postagem"
          value={filterTitle}
          onChangeText={setFilterTitle}
        />
        <TouchableOpacity style={styles.button} onPress={handleFilter}>
          <Text style={styles.buttonText}>Pesquisar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postCategory}>{item.Category.name}</Text>
            <Text style={styles.postContent}>{item.content}</Text>
          </View>
        )}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {categories.map((category) => (
              <TouchableOpacity key={category} onPress={() => { setFilterCategory(category); setShowModal(false); handleFilter(); }}>
                <Text style={styles.categoryItem}>{category}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.button} onPress={() => setShowModal(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  searchContainer: { flexDirection: "row", marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 5 },
  button: { backgroundColor: "blue", padding: 10, marginLeft: 8, borderRadius: 5 },
  buttonText: { color: "white" },
  postCard: { padding: 16, borderWidth: 1, borderColor: "#ddd", marginBottom: 8, borderRadius: 5 },
  postTitle: { fontSize: 16, fontWeight: "bold" },
  postContent: { fontSize: 16, marginTop: 8, color: "gray"},
  postCategory: { fontSize: 14, color: "gray" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 5, width: "80%" },
  categoryItem: { padding: 10, fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  }
});
