import React from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux'
import { moderateScale } from '../components/ScaleElements';
import logout from '../redux/actions/logoutAction';
import firebase from 'firebase';
import 'firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';


class Login extends React.Component {
  static navigationOption = {
    title: 'Where to',
  }
  constructor(){
    super()
    this.state={
      name:''
    }
  }
  
  componentDidMount(){
    console.log(this.props.user.auth, "DASDASD");
    
    firebase.firestore().collection('users').doc(`${this.props.user.auth.userUid}`).get().then((snap)=>{
      console.log(snap._document.proto.fields)
       this.setState({
          name:snap._document.proto.fields.name.stringValue,
          email:snap._document.proto.fields.email.stringValue,
          position:snap._document.proto.fields.position.stringValue,
        })
    }, ()=>{console.log('NAME:',this.state.name)})
    
    console.log("Data from firebase", this.state.name);
  }
  logoutFunction = () => {
    this.props.logout().then(res =>{
      if(res)
      this.props.navigation.navigate('Auth')
      else
      alert("Beach!")
  
    });
    
  }

  changeUsersData = ()=>{
    const usersData = {
      name:this.state.name,
      position:this.state.position
    }
    firebase.firestore().collection('users').doc(`${this.props.user.auth.userUid}`).update(usersData)
  }

  

  render() {
    const { navigate } = this.props.navigation;
    const {user} =this.props;
    return (
      <View style={styles.container}>


        <View style={{ flex: 1, flexDirection: "column", justifyContent:'flex-start', alignItems:'center' }}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
              <Text style={styles.textLeft}>Naudotojo vardas:</Text>
              <TextInput
                style={styles.textRight}
                onChangeText={text=>{this.setState({name:text})}}
                value={this.state.name}
              />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340),borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
              <Text style={styles.textLeft}>Elektronins paštas:</Text>
              <TextInput
                style={styles.textRight}
                onChangeText={text=>{this.setState({email:text})}}
                value={this.state.email}
              />
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
              <Text style={styles.textLeft}>Žaidėjo pozicija:</Text>
              <TextInput
                style={styles.textRight}
                onChangeText={text=>{this.setState({position:text})}}
                value={this.state.position}
              />
          </View>
        
          <TouchableOpacity style={[styles.button,{marginTop:20, flexDirection:'row',width:moderateScale(110), justifyContent:'space-evenly'}]} onPress={this.changeUsersData}>
            <Icon name='save' color='gray' size={15}/>
            <Text style={{ color: "hsl(186, 62%, 40%)", fontSize: moderateScale(17) }}>Išsaugoti</Text>
          </TouchableOpacity>
        </View>

        <View style={{alignItems:'flex-end'}}>
          <TouchableOpacity style={[styles.button,{marginTop:20, flexDirection:'row',width:moderateScale(110), justifyContent:'space-evenly'}]} onPress={this.logoutFunction}>
            <Icon name='log-out' color='gray' size={15}/>
            <Text style={{ color: "hsl(186, 62%, 40%)", fontSize: moderateScale(17) }}>Atsijungti</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textLeft:{
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 5,
    marginTop:5,
    textAlign:'left',
    justifyContent:'flex-start', 
    alignItems:'center', 
    paddingLeft:5

  },
  textRight:{
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 5,
    marginTop:5,
    textAlign:'right',
    justifyContent:'flex-end', 
    paddingRight:5

  },
  button: {
    width: moderateScale(200),
    height: moderateScale(35),
    backgroundColor: "white",
    borderColor:'hsl(186, 62%, 40%)',
    borderWidth:2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 5
  },
});
const mapStateToProps = state => ({
  user:state

});
export default connect(
  mapStateToProps,
  {logout}
)(Login);