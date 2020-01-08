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
import FlashMessage from "react-native-flash-message";
import Spinner from "react-native-loading-spinner-overlay";

class RegistrationScreen extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      name: "",
      signInErrorMessage: null,
      loadingIndicator: false,
      spinner:false
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
  startSpinner = () => {
    this.setState({ spinner: true });
  };
  finishSpinner = () => {
    setTimeout(() => {
      this.setState({ spinner: false }, () => {
        this.setState({ signInErrorMessage: "bhy" });
        this.props.navigation.navigate("Loginn", {success:true});
      });
    }, 3000);
  };

  regNewUser = () => {
    if(this.state.email!=='',this.state.password!=='',this.state.name!=='')
    {this.startSpinner();
    this.props
      .register(
        this.state.email,
        this.state.password,
        this.state.name,
      )
      .then(isRegSuccess => {
        if (isRegSuccess === true) {
          this.finishSpinner();
        } else {
          this.setState({
            signInErrorMessage: isRegSuccess.message,spinner:false,
            loadingIndicator: false
          },()=>this.showWarn(isRegSuccess.code));
        }
      });}else this.showWarn();

  };
  showSuccess=()=>{
    this.refs.errorMessage.showMessage({
      message: 'Sėkmingai užsiregistravote!',
      type: "success",
      duration: 6000,
      autoHide: true,
      hideOnPress: true
    });
  }
  showWarn = message => {
    if(message==="auth/invalid-email"){
      this.refs.errorMessage.showMessage({
        message: 'Elektroninis paštas blogai suformatuotas!',
        type: "warning",
        duration: 6000,
        autoHide: true,
        hideOnPress: true
      });
    }else  if(message==="auth/email-already-in-use"){
      this.refs.errorMessage.showMessage({
        message: 'Elektroninis paštas jau yra naudojamas!',
        type: "warning",
        duration: 6000,
        autoHide: true,
        hideOnPress: true
      });
    }else  if(message==="auth/weak-password"){
      this.refs.errorMessage.showMessage({
        message: 'Slaptažodi turi sudaryti bent 6 simboliai!',
        type: "warning",
        duration: 6000,
        autoHide: true,
        hideOnPress: true
      });
    }else{
      this.refs.errorMessage.showMessage({
        message: 'Prašome užpildyti visus privalomus registracijos laukelius!',
        type: "warning",
        duration: 6000,
        autoHide: true,
        hideOnPress: true
      });
    }
    
  };

  render() {
    return (
      <ImageBackground
        source={require("../pictures/bg_login2.jpg")}
        style={styles.bg_image}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Elektroninis paštas"
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
          keyboardType='email-address'
        />
        <TextInput
          style={styles.textInput}
          placeholder="Vardas"
          onChangeText={text => this.setState({ name: text })}
          value={this.state.name}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Slaptažodis"
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
          secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={this.regNewUser}
          style={{
            height: moderateScale(30),
            width: moderateScale(200),
            backgroundColor:'#215740',
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
          style={[styles.okButton, { marginTop: moderateScale(5),backgroundColor:'#3f6655' }]}
        >
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
            <Spinner
          visible={this.state.spinner}
          textContent={"Registruojama..."}
          textStyle={{ color: "#fff" }}
          overlayColor="rgba(0, 0, 0, 0.5)"
        />
            <FlashMessage ref="errorMessage" position="top" />
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
  //   isLoading : state.auth.isLoading
});
export default connect(mapStateToProps, { register })(RegistrationScreen);
