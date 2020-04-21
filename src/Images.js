import React, { Component } from "react";
import {
  Dimensions,
  Text,
  StyleSheet,
  Image,
  View,
  Animated,
  Easing,
} from "react-native";
import Loader from "./Loader";
import GestureRecognizer from "react-native-swipe-gestures";
import { PanGestureHandler, State } from "react-native-gesture-handler";
// import Animated from "react-native-reanimated";

// const {
//   event,
//   Clock,
//   Value,
//   cond,
//   eq,
//   set,
//   clockRunning,
//   startClock,
//   stopClock,
//   spring,
//   greaterThan,
//   lessThan,
//   and,
//   neq,
//   call,
// } = Animated;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  img: {
    height: Dimensions.get("window").height - 100,
    width: Dimensions.get("window").width - 100,
    resizeMode: "contain",
  },
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

// function runSpring(clock, value, velocity, dest) {
//   const state = {
//     finished: new Value(0),
//     velocity: new Value(0),
//     position: new Value(0),
//     time: new Value(0),
//   };
//   const config = {
//     damping: 7,
//     mass: 1,
//     stiffness: 121.6,
//     overshootClamping: false,
//     resetSpeedThreshold: 0.001,
//     resetDisplacementThreshold: 0.001,
//     toValue: new Value(0),
//   };
//   return [
//     cond(clockRunning(clock), 0, [
//       set(state.finished, 0),
//       set(state.velocity, velocity),
//       set(state.position, value),
//       set(config.toValue, dest),
//       startClock(clock),
//     ]),
//     spring(clock, state, config),
//     cond(state.finished, stopClock(clock)),
//     state.position,
//   ];
// }

export default class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tgId: "",
      sessionId: "",
      userId: "",
      positiveColor: [],
      negativeColor: [],
      neutralColor: [],
      images: [],
      index: 0,
      resp: [],
      posShown: false,
      negShown: false,
      loading: false,
      error: "",
      correct: 0,
      incorrect: 0,
    };
    // this.translationY = new Value(0);
    // this.velocityY = new Value(0);
    // this.gestureState = new Value(State.UNDETERMINED);
    // this.onGestureEvent = event(
    //   [
    //     {
    //       nativeEvent: {
    //         translationY: this.translationY,
    //         velocityY: this.velocityY,
    //         state: this.gestureState,
    //       },
    //     },
    //   ],
    //   { useNativeDriver: true }
    // );
    // this.init();
    console.log(props.navigation.state.params.positiveColor);
    this.state.positiveColor = props.navigation.state.params.positiveColor;
    this.state.negativeColor = props.navigation.state.params.negativeColor;
    this.state.neutralColor = props.navigation.state.params.neutralColor;
    this.state.sessionId = props.navigation.state.params.sessionId;
    this.state.tgId = props.navigation.state.params.tgId;
    this.state.userId = props.navigation.state.params.userId;
    this.animatedValue = new Animated.Value(0);
  }

  handleAnimationUp = () => {
    Animated.timing(this.animatedValue, {
      toValue: -1,
      duration: 2000,
      easing: Easing.ease,
    }).start(() => {
      this.animatedValue.setValue(0);
      this.onSwipeUp(this.state.images[this.state.index]);
    });
  };

  handleAnimationDown = () => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.ease,
    }).start(() => {
      this.animatedValue.setValue(0);
      this.onSwipeDown(this.state.images[this.state.index]);
    });
  };

  handleAnimationSide = () => {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 100,
      easing: Easing.linear,
    }).start(() => {
      this.animatedValue.setValue(0);
      this.onSwipeUp(this.state.images[this.state.index]);
    });
  };

  static navigationOptions = { title: "Welcome", header: null };

  init() {
    const { gestureState, translationY, velocityY } = this;
    const clockY = new Clock();

    this.translationY.setValue(0);
    this.velocityY.setValue(0);
    this.gestureState.setValue(State.UNDETERMINED);

    const snapPoint = cond(
      and(lessThan(translationY, 0), lessThan(velocityY, -10)),
      -height,
      cond(
        and(greaterThan(translationY, 0), greaterThan(velocityY, 10)),
        height,
        0
      )
    );
    this.translateY = cond(
      eq(gestureState, State.END),
      [
        set(
          translationY,
          runSpring(clockY, translationY, velocityY, snapPoint)
        ),
        cond(
          and(eq(clockRunning(clockY), 0), neq(translationY, 0)),
          call([translationY], this.onSwipe)
        ),
        translationY,
      ],
      translationY
    );
  }

  componentDidMount() {
    this.setState({ error: "", loading: true });

    fetch(
      "http://testpsych-env.6mijsua8pr.us-east-2.elasticbeanstalk.com/imageData/ImageFetcher?tgId=" +
        this.state.tgId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("images:" + JSON.stringify(responseJson));
        console.log("posColor:" + JSON.stringify(this.state.positiveColor));
        console.log("negColor:" + JSON.stringify(this.state.negativeColor));

        this.setState({
          // time: new Date.getMilliseconds(),
          images: responseJson.images,
          loading: false,
        });
      });
  }

  sendResp() {
    var formBody = [];
    var encodedKey = encodeURIComponent("participantId");
    var encodedValue = encodeURIComponent(this.state.userId);
    formBody.push(encodedKey + "=" + encodedValue);
    encodedKey = encodeURIComponent("sessionId");
    encodedValue = encodeURIComponent(this.state.sessionId);
    formBody.push(encodedKey + "=" + encodedValue);

    encodedKey = encodeURIComponent("responses");
    encodedValue = encodeURIComponent("[" + this.state.resp.join(",") + "]");
    formBody.push(encodedKey + "=" + encodedValue);

    formBody = formBody.join("&");

    console.log("send:" + formBody);

    fetch(
      "http://testpsych-env.6mijsua8pr.us-east-2.elasticbeanstalk.com/imageData/ImageDataServlet",
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
        } else {
          this.setState({
            loading: false,
            error: responseJson.save,
          });
        }
        return responseJson;
      });
  }

  onSwipe = ([translateY]) => {
    const isSwipeUp = translateY > 0;
    console.log({ isSwipeUp });
    isSwipeUp ? this.onSwipeUp() : this.onSwipeDown();
    this.setState(this.init);
  };

  onSwipeUp() {
    const item = this.state.images[this.state.index];
    console.log("up");
    console.log(item);

    var timeDif = new Date().getMilliseconds() - this.state.time;
    var encodedKey = "imageTypeId";
    var encodedValue = item.imageTypeId;
    var val = '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "responseTime";
    encodedValue = timeDif;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "backGroundColor";
    encodedValue = null;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "imageId";
    encodedValue = item.imageId;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "participantId";
    encodedValue = this.state.userId;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "correctness";
    encodedValue = item.imageType === "Negative";
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "imageCategoryId";
    encodedValue = item.imageCategoryId;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "isAttempted";
    encodedValue = true;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"';

    this.state.resp.push("{" + val + "}");
    this.setState({ time: new Date().getMilliseconds() });

    if (item.imageType === "Negative") this.state.correct++;
    else this.state.incorrect++;

    if (this.state.index === this.state.images.length - 1) {
      this.sendResp();
      this.props.navigation.navigate("Game2", {
        tgId: this.state.tgId,
        sessionId: this.state.sessionId,
        userId: this.state.userId,
        correct: this.state.correct,
        incorrect: this.state.incorrect,
      });
    } else {
      this.setState({
        index: this.state.index + 1,
      });
    }
  }

  onSwipeDown() {
    const item = this.state.images[this.state.index];
    console.log("down");

    var timeDif = new Date().getMilliseconds();
    -this.state.time;
    var encodedKey = "imageTypeId";
    var encodedValue = item.imageTypeId;
    var val = '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "responseTime";
    encodedValue = timeDif;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "backGroundColor";
    encodedValue = null;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "imageId";
    encodedValue = item.imageId;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "participantId";
    encodedValue = this.state.userId;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "correctness";
    encodedValue = item.imageType === "Negative";
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "imageCategoryId";
    encodedValue = item.imageCategoryId;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"' + ",";

    encodedKey = "isAttempted";
    encodedValue = true;
    val = val + '"' + encodedKey + '"' + ":" + '"' + encodedValue + '"';

    this.state.resp.push("{" + val + "}");
    this.setState({ time: new Date().getMilliseconds() });

    if (item.imageType === "Positive") this.state.correct++;
    else this.state.incorrect++;

    if (this.state.index === this.state.images.length - 1) {
      this.sendResp();
      this.props.navigation.navigate("Game2", {
        tgId: this.state.tgId,
        sessionId: this.state.sessionId,
        userId: this.state.userId,
        correct: this.state.correct,
        incorrect: this.state.incorrect,
      });
    } else {
      this.setState({
        index: this.state.index + 1,
      });
    }
  }

  render() {
    const { onGestureEvent, translateY } = this;

    const style = {
      ...StyleSheet.absoluteFillObject,
      transform: [{ translateY }],
    };
    const config = {
      velocityThreshold: 0.2,
      directionalOffsetThreshold: 90,
    };

    if (this.state.loading) {
      return <Loader size="large" />;
    } else if (!this.state.posShown) {
      return (
        <GestureRecognizer
          onSwipeDown={() => {
            console.log("down");
            this.setState({
              posShown: true,
            });
          }}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: this.state.positiveColor,
          }}
          config={config}
        >
          <Text style={{ color: "white", fontSize: 15 }}>
            Please swipe down if you see this color
          </Text>
        </GestureRecognizer>
      );
    } else if (!this.state.negShown) {
      return (
        <GestureRecognizer
          onSwipeUp={() => {
            console.log("up");
            this.setState({
              negShown: true,
              time: new Date().getSeconds(),
            });
          }}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: this.state.negativeColor,
          }}
          config={config}
        >
          <Text style={{ color: "white", fontSize: 15 }}>
            Please swipe up if you see this color
          </Text>
        </GestureRecognizer>
      );
    } else if (this.state.images.length !== 0) {
      // if (this.state.images[this.state.index].imageType === "Positive") {
      return (
        <GestureRecognizer
          onSwipeUp={this.handleAnimationUp}
          onSwipeDown={this.handleAnimationDown}
          onSwipeLeft={this.handleAnimationSide}
          config={config}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              this.state.images[this.state.index].imageType === "Positive"
                ? this.state.positiveColor
                : this.state.negativeColor,
          }}
        >
          <Animated.Image
            resizeMode="cover"
            style={{
              height: Dimensions.get("window").height - 100,
              width: Dimensions.get("window").width - 100,
              resizeMode: "contain",
              transform: [
                {
                  scaleX: this.animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 2],
                  }),
                },
                {
                  scaleY: this.animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 2],
                  }),
                },
              ],
            }}
            source={{
              uri:
                "http://testpsych-env.6mijsua8pr.us-east-2.elasticbeanstalk.com/imageUpload?imagePath=" +
                this.state.images[this.state.index].imagePath +
                "&source=android",
            }}
          />
        </GestureRecognizer>
        // <View
        //   style={{
        //     flex: 1,
        //     justifyContent: "center",
        //     alignItems: "center",
        //     backgroundColor: this.state.positiveColor,
        //   }}
        // >
        //   <PanGestureHandler
        //     {...{ onGestureEvent }}
        //     // onHandlerStateChange={onGestureEvent}
        //   >
        //     <Animated.View {...{ style }}>
        //       <View style={StyleSheet.absoluteFill}>
        //         <Image
        //           style={styles.img}
        //           source={{
        //             uri:
        //               "http://testpsych-env.6mijsua8pr.us-east-2.elasticbeanstalk.com/imageUpload?imagePath=" +
        //               this.state.images[this.state.index].imagePath +
        //               "&source=android",
        //           }}
        //         />
        //       </View>
        //     </Animated.View>
        //   </PanGestureHandler>
        // </View>
      );
      // } else {
      //   return (
      //     <GestureRecognizer
      //       onSwipeUp={this.handleAnimationUp}
      //       onSwipeDown={this.handleAnimationDown}
      //       onSwipeSide={this.handleAnimationSide}
      //       config={config}
      //       style={{
      //         flex: 1,
      //         justifyContent: "center",
      //         alignItems: "center",
      //         backgroundColor: this.state.negativeColor,
      //       }}
      //     >
      //       <Animated.Image
      //         resizeMode="cover"
      //         style={{
      //           height: Dimensions.get("window").height - 100,
      //           width: Dimensions.get("window").width - 100,
      //           resizeMode: "contain",
      //           transform: [
      //             {
      //               scaleX: this.animatedValue.interpolate({
      //                 inputRange: [0, 1],
      //                 outputRange: [1, 2],
      //               }),
      //             },
      //             {
      //               scaleY: this.animatedValue.interpolate({
      //                 inputRange: [0, 1],
      //                 outputRange: [1, 2],
      //               }),
      //             },
      //           ],
      //         }}
      //         source={{
      //           uri:
      //             "http://testpsych-env.6mijsua8pr.us-east-2.elasticbeanstalk.com/imageUpload?imagePath=" +
      //             this.state.images[this.state.index].imagePath +
      //             "&source=android",
      //         }}
      //       />
      //     </GestureRecognizer>
      //   );
      // }
    } else {
      return null;
    }
  }
}
