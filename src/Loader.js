import React from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

const Loader = ({ size }) => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size={size || "small"} />
    </View>
  );
};

export default Loader;
