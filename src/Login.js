import React, { Component } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { MKTextField, MKColor } from "react-native-material-kit";
import Loader from "./Loader";
import Home from "./Home";
import Register from "./Register";

const styles = StyleSheet.create({
  fieldStyles: {
    height: 40
  },
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
  },
  errorMessage: {
    marginTop: 15,
    fontSize: 15,
    color: "red",
    alignSelf: "center"
  }
});

export default class Login extends Component {
  state = {
    userName: "",
    password: "",
    loading: false,
    error: ""
  };

  renderLoader() {
    if (this.state.loading) {
      return <Loader size="large" />;
    } else {
      return <Button title="Login" onPress={this.onLogin.bind(this)} />;
    }
  }
  onLogin() {
    this.setState({ error: "", loading: true });

    var formBody = [];
    for (var property in this.state) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(this.state[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(
      "http://testpsych-env.6mijsua8pr.us-east-2.elasticbeanstalk.com/AuthenticatingUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: formBody
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success === "1") {
          this.setState({
            loading: false,
            error: ""
          });
          this.props.navigation.navigate("Home", {
            id: responseJson.userId,
            tgId: responseJson.tgId
          });
        } else {
          this.setState({
            loading: false,
            error: "Invalid credentials."
          });
        }
        return responseJson;
      });
  }

  static navigationOptions = { title: "Welcome", header: null };

  render() {
    const {
      fieldStyles,
      buttonArea,
      errorMessage,
      container,
      outerContainer
    } = styles;
    const { navigate } = this.props.navigation;
    return (
      <View style={outerContainer}>
        <View style={container}>
          <MKTextField
            text={this.state.userName}
            onTextChange={userName => this.setState({ userName })}
            textInputStyle={fieldStyles}
            placeholder={"Username"}
            tintColor={MKColor.Black}
          />
          <MKTextField
            text={this.state.password}
            onTextChange={password => this.setState({ password })}
            textInputStyle={fieldStyles}
            placeholder={"Password"}
            tintColor={MKColor.Black}
            password={true}
          />
          <Text style={errorMessage}>{this.state.error}</Text>
          <View style={buttonArea}>{this.renderLoader()}</View>
          <View style={buttonArea}>
            <Button title="Register" onPress={() => navigate("Register")} />
          </View>
        </View>
      </View>
    );
  }
}
