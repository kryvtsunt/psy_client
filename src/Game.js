import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Slider,
  Button,
} from "react-native";
import Loader from "./Loader";

const styles = StyleSheet.create({
  buttonArea: {
    marginBottom: 20,
  },
  errorMessage: {
    marginTop: 15,
    fontSize: 15,
    color: "red",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    width: 350,
    paddingBottom: 20,
    paddingTop: 100,
  },
  outerContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  img: {
    height: 20,
    width: 20,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tgId: "",
      participantId: "",
      questions: [],
      checked: [],
      slider: [],
      loading: false,
      error: "",
    };

    this.state.participantId = props.navigation.state.params.id;
    this.state.tgId = props.navigation.state.params.tgId;
  }

  onUpdate(item, index) {
    let a = this.state.checked;
    a[index] = item;
    this.setState({
      checked: a,
    });
  }

  renderIf(item, index) {
    console.log(item);
    if (item.responseType === "Categorical") {
      return (
        <View>
          <View style={styles.btn}>
            {this.state.checked[index] == item.startLabel ? (
              <TouchableOpacity style={{ flex: 1, flexDirection: "row" }}>
                <Image
                  style={styles.img}
                  source={{ uri: "https://i.stack.imgur.com/OWcpX.png" }}
                />
                <Text> {item.startLabel}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row" }}
                onPress={() => {
                  this.onUpdate(item.startLabel, index);
                }}
              >
                <Image
                  style={styles.img}
                  source={{ uri: "https://i.stack.imgur.com/Kn8zA.png" }}
                />
                <Text> {item.startLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.btn}>
            {this.state.checked[index] == item.endLabel ? (
              <TouchableOpacity style={{ flex: 1, flexDirection: "row" }}>
                <Image
                  style={styles.img}
                  source={{ uri: "https://i.stack.imgur.com/OWcpX.png" }}
                />
                <Text> {item.endLabel}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row" }}
                onPress={() => {
                  this.onUpdate(item.endLabel, index);
                }}
              >
                <Image
                  style={styles.img}
                  source={{ uri: "https://i.stack.imgur.com/Kn8zA.png" }}
                />
                <Text> {item.endLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.btn}>
            {this.state.checked[index] == item.additionalLabel ? (
              <TouchableOpacity style={{ flex: 1, flexDirection: "row" }}>
                <Image
                  style={styles.img}
                  source={{ uri: "https://i.stack.imgur.com/OWcpX.png" }}
                />
                <Text> {item.additionalLabel}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ flex: 1, flexDirection: "row" }}
                onPress={() => {
                  this.onUpdate(item.additionalLabel, index);
                }}
              >
                <Image
                  style={styles.img}
                  source={{ uri: "https://i.stack.imgur.com/Kn8zA.png" }}
                />
                <Text> {item.additionalLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.btn}>
          <Text style={{ marginLeft: -10 }}> {item.startLabel}</Text>
          <Slider
            style={{ width: 200 }}
            step={1}
            minimumValue={0}
            maximumValue={5}
            value={this.state.slider[index]}
            onValuechange={(val) => {
              let a = this.state.slider;
              a[index] = val;
              this.setState({
                slider: a,
              });
            }}
            onSlidingComplete={(val) => {
              let a = this.state.slider;
              a[index] = val;
              this.setState({
                slider: a,
              });
            }}
          />
          <Text> {item.endLabel}</Text>
        </View>
      );
    }
  }

  componentDidMount() {
    this.setState({ error: "", loading: true });
    // console.log(this.state.id);
    fetch(
      "http://testpsych-env.6mijsua8pr.us-east-2.elasticbeanstalk.com/question?targetGroupId=" +
        this.state.tgId +
        "&source=android",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.results);
        if (responseJson.status === "200") {
          this.setState({
            questions: responseJson.results.filter((e) => e.followup == "0"),
            error: "",
          });
          var a = [];
          var b = [];
          for (var i = 0; i < this.state.questions.length; i++) {
            a.push(this.state.questions[i].startLabel);
            b.push(0);
          }
          this.setState({
            checked: a,
            slider: b,
            loading: false,
          });
        } else {
          this.setState({
            loading: false,
            error: "Could not fetch questions.",
          });
        }
      });
  }

  static navigationOptions = { title: "Welcome", header: null };

  renderLoader() {
    if (this.state.loading) {
      return <Loader size="large" />;
    } else {
      return <Button title="Next" onPress={this.sendResp.bind(this)} />;
    }
  }

  sendResp() {
    var formBody = [];
    var encodedKey = encodeURIComponent("tgId");
    var encodedValue = encodeURIComponent(this.state.tgId);
    formBody.push(encodedKey + "=" + encodedValue);
    encodedKey = encodeURIComponent("participantId");
    encodedValue = encodeURIComponent(this.state.participantId);
    formBody.push(encodedKey + "=" + encodedValue);
    encodedKey = encodeURIComponent("sessionId");
    encodedValue = encodeURIComponent(null);
    formBody.push(encodedKey + "=" + encodedValue);
    encodedKey = encodeURIComponent("questionSession");
    encodedValue = encodeURIComponent("0");
    formBody.push(encodedKey + "=" + encodedValue);

    var formBody1 = [];
    for (var i = 0; i < this.state.questions.length; i++) {
      var encodedKey = "questionId";
      var encodedValue = this.state.questions[i].questionId;

      var val = '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

      if (this.state.questions[i].responseType === "Categorical") {
        encodedKey = "response";
        encodedValue = this.state.checked[i];
      } else {
        encodedKey = "response";
        encodedValue = this.state.slider[i];
      }

      val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

      encodedKey = "responseType";
      encodedValue = this.state.questions[i].responseType;

      val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"';

      formBody1.push("{" + val + "}");
    }
    formBody1 = formBody1.join(",");

    encodedKey = encodeURIComponent("responses");
    encodedValue = encodeURIComponent("[" + formBody1 + "]");
    formBody.push(encodedKey + "=" + encodedValue);

    formBody = formBody.join("&");
    console.log(formBody);
    console.log(formBody1);

    fetch(
      "http://testpsych-env.6mijsua8pr.us-east-2.elasticbeanstalk.com/Questionnaire",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: formBody,
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.save === "successful") {
          this.setState({
            loading: false,
            error: "",
          });
          this.props.navigation.navigate("Images", {
            tgId: this.state.tgId,
            userId: this.state.participantId,
            positiveColor: responseJson.positiveColor,
            negativeColor: responseJson.negativeColor,
            neutralColor: responseJson.neutralColor,
            sessionId: responseJson.sessionId,
          });
        } else {
          this.setState({
            loading: false,
            error: responseJson.save,
            loggedIn: false,
          });
        }
        return responseJson;
      });
  }

  render() {
    const { buttonArea, container, outerContainer, errorMessage } = styles;
    if (this.state.loading) {
      return <Loader size="large" />;
    }
    return (
      <View style={outerContainer}>
        <View style={container}>
          <ScrollView>
            {this.state.questions.map((item, index) => {
              return (
                <View key={index} style={buttonArea}>
                  <Text>
                    {index + 1}. {`${item.questionName}`}
                  </Text>
                  {this.renderIf(item, index)}
                </View>
              );
            })}
            <View style={buttonArea}>{this.renderLoader()}</View>
            <Text style={errorMessage}>{this.state.error}</Text>
          </ScrollView>
        </View>
      </View>
    );
  }
}
