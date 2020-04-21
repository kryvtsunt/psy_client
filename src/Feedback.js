import React, { Component } from "react";
import { View, StyleSheet, Button, Text } from "react-native";

const styles = StyleSheet.create({
  buttonArea: {
    marginTop: 20
  },
  container: {
    flex: 1,
    justifyContent: "center",
    width: 300,
    paddingBottom: 20
  },
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default class Feedback extends Component {
  static navigationOptions = { title: "Welcome", header: null };

  constructor(props) {
    super(props);

    this.state = {
      correct: 0,
      incorrect: 0
    };

    this.state.correct = props.navigation.state.params.correct;
    this.state.incorrect = props.navigation.state.params.incorrect;
  }

  render() {
    const { buttonArea, container, outerContainer } = styles;
    const { navigate } = this.props.navigation;
    return (
      <View style={outerContainer}>
        <View style={container}>
          <View style={buttonArea}>
            <Text style={{ fontSize: 20 }}>Thank you for playing</Text>
            <Text style={{ fontSize: 20 }}>Correct: {this.state.correct}</Text>
            <Text style={{ fontSize: 20 }}>
              Incorrect: {this.state.incorrect}
            </Text>
            <View style={buttonArea}>
              <Button title="Ok" onPress={() => navigate("Home")} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
