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
  ActivityIndicator,
  CheckBox
} from "react-native";
import { moderateScale } from "../components/ScaleElements";
import login from "../redux/actions/authAction";
import { connect } from "react-redux";
import firebase from "firebase";
import {debounce} from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import { throwStatement } from "@babel/types";

class LoginScreen extends React.Component {
  static navigationOptions = { header: null }
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      signInErrorMessage: null,
      loadingIndicator:false,
      isRemembered:false,
    };

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
    
    firebase.initializeApp(firebaseConfig);}
    this.autoSignIn();

  }

  autoSignIn = async () => {
    const userInfo = []
    await AsyncStorage.multiGet(['username', 'password'],(err,res)=>{res.map((result)=>{
      console.log("Ivyko")
          userInfo.push(result[1]);
          }
        )    
      }
    )
    console.log(userInfo[0], userInfo[1])
    if(userInfo[0] !== null && userInfo[1] !== null ){
      console.log("Neivyko tikiuos", userInfo)
      this.props.login(userInfo[0], userInfo[1])
      .then(isLogginSuccess => {
        console.log("Asd", isLogginSuccess)
        if(typeof(isLogginSuccess) !== 'object' && isLogginSuccess === true) {
          this.setState({signInErrorMessage:"bhy"})
          this.props.navigation.navigate('App');
        }
        else{
          this.setState({signInErrorMessage:isLogginSuccess.message})
        }
      })
    }
  }

  navigateToRegForm = () => {
    this.props.navigation.navigate('Registration')
  } 
  
  signInUser = () => {
     this.props.login(this.state.username, this.state.password, this.state.isRemembered)
    .then(isLogginSuccess => {
      console.log("Asd", isLogginSuccess)
      if(typeof(isLogginSuccess) !== 'object' && isLogginSuccess === true) {
        this.setState({signInErrorMessage:"bhy"})
        this.props.navigation.navigate('App');
      }
      else{
        this.setState({signInErrorMessage:isLogginSuccess.message})
      }
    })
  
    // firebase
    //   .auth()
    //   .signInWithEmailAndPassword(this.state.username, this.state.password)
    //   .then(res => this.setState({ signInErrorMessage: res.user.email }))
    //   .catch(error => this.setState({ signInErrorMessage: error.message }));
  };
  onIsRememberedChange = ()=>{
    this.setState({isRemembered:!this.state.isRemembered})  
  }

  render() {
    return (
        <ImageBackground source={require("../pictures/bg_login2.jpg")} style={styles.bg_image} >
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
            
          />
          <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center'}}><Text
              style={{
                color: "white",
                fontSize: moderateScale(12),
                fontWeight: '600',
                justifyContent:'flex-end'
              }}
            >Prisiminti</Text>
          <CheckBox
          style={{color:'white'}}
            onChange={this.onIsRememberedChange}
            value={this.state.isRemembered}
          /></View>
          <TouchableOpacity
            onPress={this.signInUser}
            style={styles.okButton}
          >
            <Text
              style={{
                color: "white",
                fontSize: moderateScale(12),
                fontWeight: '600'
              }}
            >
              Prisijungti
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.navigateToRegForm}
            style={{justifyContent:'flex-end', alignItems:'flex-end'}}
          >
            <Text
              style={{
                color: "white",
                fontSize: moderateScale(12),
                fontWeight: '300'
              }}
            >
              Neturite paskyros?
            </Text>
          </TouchableOpacity>
          <Text style={{color:'white'}}>{this.state.signInErrorMessage}</Text>
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
  bg_image:{
    flex:1,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
 },
  textInput:{
    height: moderateScale(35),
    width: moderateScale(200),
    backgroundColor: "white",
    marginBottom: 15,
    borderRadius:10,
    paddingLeft:10
  },
  okButton:{
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
  isLoading : state.auth.isLoading,
  isLoggedIn : state.auth.isLoggedIn
});
export default connect(
  mapStateToProps,
  { login }
)(LoginScreen);
