import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  ImageBackground
} from "react-native";
import { moderateScale } from "../components/ScaleElements";
import login from "../redux/actions/authAction";
import checkIfBanned from "../redux/actions/checkIfBannedAuth";
import { connect } from "react-redux";
import firebase from "firebase";
import AsyncStorage from "@react-native-community/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import FlashMessage from "react-native-flash-message";
import { CheckBox } from "native-base";

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Example App",
        message: "Example App access to your location "
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the");
    } else {
      console.log("location permission denied");
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}

class LoginScreen extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      signInErrorMessage: null,
      loadingIndicator: false,
      isRemembered: false,
      spinner: false
    };
  }
  async componentWillMount() {
    await requestLocationPermission();
  }
  componentDidMount() {
    if (!firebase.apps.length) {
      const firebaseConfig = {
        apiKey: "AIzaSyDB9hw4AiCtwCg-uGiU7CP1KinqDY95ucM",
        // authDomain: 'XXXX',
        // databaseURL: 'XXXX',
        projectId: "football-4ec64",
        // storageBucket: '',
        // messagingSenderId: 'XXXX',
        appId: "1:155644706361:android:bc866be94a2e85f13197e8"
      };

      firebase.initializeApp(firebaseConfig);
    }
    this.autoSignIn();
  }

  autoSignIn = async () => {
    const userInfo = [];
    await AsyncStorage.multiGet(["username", "password"], (err, res) => {
      res.map(result => {
        console.log("Ivyko");
        userInfo.push(result[1]);
      });
    });
    console.log(userInfo[0], userInfo[1]);
    if (userInfo[0] !== null && userInfo[1] !== null) {
      this.startSpinner();
      console.log("Neivyko tikiuos", userInfo);
      this.props.login(userInfo[0], userInfo[1]).then(isLogginSuccess => {
        console.log("Asd", isLogginSuccess);
        if (typeof isLogginSuccess !== "object" && isLogginSuccess === true) {
          this.finishSpinner();
        } else {
          this.setState(
            {
              signInErrorMessage: isLogginSuccess.message,
              spinner: false
            },
            () => this.showWarn(isLogginSuccess.message)
          );
        }
      });
    }
  };

  showWarn = message => {
    this.refs.loginMessage.showMessage({
      message: message,
      type: "warning",
      duration: 8000,
      autoHide: true,
      hideOnPress: true
    });
  };

  navigateToRegForm = () => {
    this.props.navigation.navigate("Registration");
  };

  signInUser = () => {
    this.startSpinner();
    this.props
      .login(this.state.username, this.state.password, this.state.isRemembered)
      .then(isLogginSuccess => {
        console.log("Asd", isLogginSuccess);
        if (typeof isLogginSuccess !== "object" && isLogginSuccess === true) {
          this.setState({ signInErrorMessage: "bhy", spinner: false });
          this.props.navigation.navigate("App");
        } else {
          this.setState({ signInErrorMessage: isLogginSuccess.message }, () =>
            this.showWarn(isLogginSuccess.message)
          );
        }
      });
  };

  onIsRememberedChange = () => {
    this.setState({ isRemembered: !this.state.isRemembered });
  };

  startSpinner = () => {
    this.setState({ spinner: true });
  };
  finishSpinner = () => {
    setTimeout(() => {
      this.setState({ spinner: false }, () => {
        this.setState({ signInErrorMessage: "bhy" });
        this.props.navigation.navigate("App");
      });
    }, 3000);
  };

  render() {
    return (
      <ImageBackground
        source={require("../pictures/bg_login2.jpg")}
        style={styles.bg_image}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Elektroninis pašas"
          onChangeText={text => this.setState({ username: text })}
          value={this.state.username}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Slaptažodis"
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: moderateScale(100)
          }}
          onPress={this.onIsRememberedChange}
        >
          <Text
            style={{
              color: "white",
              fontSize: moderateScale(12),
              fontWeight: "600"
            }}
          >
            Prisiminti
          </Text>
          <CheckBox color="gray" checked={this.state.isRemembered} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.signInUser} style={styles.okButton}>
          <Text
            style={{
              color: "white",
              fontSize: moderateScale(12),
              fontWeight: "600"
            }}
          >
            Prisijungti
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.navigateToRegForm}
          style={[styles.okButton, { marginTop: moderateScale(5) }]}
        >
          <Text
            style={{
              color: "white",
              fontSize: moderateScale(12),
              fontWeight: "600"
            }}
          >
            Dar neturite paskyros ?
          </Text>
        </TouchableOpacity>
        <Text style={{ color: "white" }}>{this.state.signInErrorMessage}</Text>
        <Spinner
          visible={this.state.spinner}
          textContent={"Vykdoma..."}
          textStyle={{ color: "#fff" }}
          overlayColor="rgba(0, 0, 0, 0.5)"
        />
        <FlashMessage ref="loginMessage" position="top" />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2"
  },
  bg_image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
    height: 80
  },
  textInput: {
    height: moderateScale(35),
    width: moderateScale(200),
    backgroundColor: "white",
    marginBottom: 15,
    borderRadius: 10,
    paddingLeft: 10
  },
  okButton: {
    height: moderateScale(30),
    width: moderateScale(200),
    backgroundColor: "green",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});
const mapStateToProps = state => ({
  isLoading: state.auth.isLoading,
  isLoggedIn: state.auth.isLoggedIn,
  userId: state.auth.userId
});
export default connect(mapStateToProps, { login, checkIfBanned })(LoginScreen);
