import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { useLoading } from "../context/LoadingContext";

const Loading: React.FC = () => {
  const { loading } = useLoading();

  return (
    <Modal transparent visible={loading} animationType="fade">
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default Loading;
