import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import { moderateScale } from "../components/ScaleElements";
import register from "../redux/actions/regAction";
import { connect } from "react-redux";
import firebase from "firebase";

class RegistrationScreen extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      name: "",
      position: "",
      signInErrorMessage: null,
      loadingIndicator: false
    };
  }
  componentDidMount() {
    if (!firebase.apps.length) {
      const firebaseConfig = {
        apiKey: "AIzaSyDB9hw4AiCtwCg-uGiU7CP1KinqDY95ucM",
        authDomain: "football-4ec64.firebaseapp.com",
        databaseURL: "https://football-4ec64.firebase.com",
        projectId: "football-4ec64",
        storageBucket: "football-4ec64.appspot.com",
        // messagingSenderId: 'XXXX',
        appId: "1:155644706361:android:bc866be94a2e85f13197e8"
      };

      firebase.initializeApp(firebaseConfig);
    }
  }
  navigateToRegForm = () => {
    this.props.navigation.goBack();
  };

  regNewUser = () => {
    this.props
      .register(
        this.state.email,
        this.state.password,
        this.state.name,
        this.state.position
      )
      .then(isRegSuccess => {
        if (isRegSuccess === true) {
          this.props.navigation.navigate("Loginn");
        } else {
          this.setState({
            signInErrorMessage: isRegSuccess.message,
            loadingIndicator: false
          });
        }
      });
  };

  render() {
    return (
      <ImageBackground
        source={require("../pictures/bg_login2.jpg")}
        style={styles.bg_image}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Vartotojo vardas"
          onChangeText={text => this.setState({ name: text })}
          value={this.state.name}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Elektroninis paštas"
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Pozicija"
          onChangeText={text => this.setState({ position: text })}
          value={this.state.position}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Slaptažodis"
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
        />
        <TouchableOpacity
          onPress={this.regNewUser}
          style={{
            height: moderateScale(30),
            width: moderateScale(200),
            backgroundColor: "green",
            borderColor: "white",
            borderWidth: 2,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: moderateScale(12),
              fontWeight: "600"
            }}
          >
            Registruotis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.navigateToRegForm}
          style={{ justifyContent: "center", alignItems: "flex-end" }}
        >
          <Text
            style={{
              color: "white",
              fontSize: moderateScale(12),
              fontWeight: "600"
            }}
          >
            Jau esatę prisiregistravęs?
          </Text>
        </TouchableOpacity>
        <Text style={{ color: "white" }}>{this.state.signInErrorMessage}</Text>

        {/* <ActivityIndicator style={styles.activityIndicator}
            animating={this.props.isLoading}
            color = 'white'
            size = "large"
            /> */}
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
    borderRadius: 10
  }
});
const mapStateToProps = state => ({
  //   isLoading : state.auth.isLoading
});
export default connect(mapStateToProps, { register })(RegistrationScreen);
