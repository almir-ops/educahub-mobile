import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet } from "react-native";
import { API_URL } from "../config/api";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag para verificar se o componente está montado

    fetch(`${API_URL}/categories`)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) setCategories(data); // Só atualiza se o componente estiver montado
      })
      .catch((error) => console.error("Erro ao buscar categorias:", error));

    fetch(`${API_URL}/posts`)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setPosts(data);
          setFilteredPosts(data);
        }
      })
      .catch((error) => console.error("Erro ao buscar posts:", error));

    return () => {
      isMounted = false; // Quando o componente desmonta, desabilitamos a atualização do estado
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
        <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
          <Text style={styles.buttonText}>Filtro</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postCategory}>{item.categoryName}</Text>
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
  postCategory: { fontSize: 14, color: "gray" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 5, width: "80%" },
  categoryItem: { padding: 10, fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#ddd" }
});
