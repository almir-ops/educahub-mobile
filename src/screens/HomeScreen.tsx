import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';

interface Post {
  id: string;
  title: string;
  author: string;
}

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('API_URL/posts', {
        params: { search },
      });
      setPosts(response.data);
    };

    fetchPosts();
  }, [search]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar posts"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.author}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  postItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
