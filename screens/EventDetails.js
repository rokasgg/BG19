import React from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome';

import Modal from 'react-native-modalbox';
import { moderateScale } from '../components/ScaleElements';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class EventDetails extends React.Component {

  constructor() {
    super()
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,

      isOpen2: true,
      userJoined:false,
      buttonText:'Prisijungti',
      buttonIcon:'user-plus',
      buttonColor:'hsl(186, 62%, 40%)'
    }
  }
  static navigationOption = {
    title: 'Where to',
  }

  joinEvent = ()=>{
    if(this.state.userJoined===false){
      this.setState({
        buttonIcon:'times',
        buttonText:'Atšaukti',
        buttonColor:'red',
        userJoined:true
      })
    }else{
      this.setState({
        buttonText:'Prisijungti',
        buttonIcon:'user-plus',
        buttonColor:'hsl(186, 62%, 40%)',
        userJoined:false
      })
    }
    
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.topHalf}>
          <Image style={{ width: moderateScale(300), height: moderateScale(100) , resizeMode:'contain'}} source={require("../pictures/pitch4.png")} />
          
        </View>
        <View style={styles.bottomHalf}>

        <View style={{ flex: 1, flexDirection: "column",
        justifyContent:'center', alignItems:'center' }}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                  <Text style={styles.textLeft}>Stadiono pavadinimas:</Text>
                  <Text style={styles.textRight}>{this.props.navigation.state.params.item1.stadiumName}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340),borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                  <Text style={styles.textLeft}>Adresas:</Text>
                  <Text style={styles.textRight}>{this.props.navigation.state.params.item1.stadiumAdress}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                  <Text style={styles.textLeft}>Ieškomų žmonių skaičius:</Text>
                  <Text style={styles.textRight}>{this.props.navigation.state.params.item1.peopleNeed}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                  <Text style={styles.textLeft}>Data:</Text>
                  <Text style={styles.textRight}>{this.props.navigation.state.params.item1.reservationTime}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                  <Text style={styles.textLeft}>Laikas:</Text>
                  <Text style={styles.textRight}>{this.props.navigation.state.params.item1.time}</Text>
              </View>
          </View>
          
          <View style={styles.half2}>
            <TouchableOpacity style={[styles.button1, {borderColor:this.state.buttonColor}]} onPress={this.joinEvent}>
              <Icon name={this.state.buttonIcon} size={20} color={this.state.buttonColor}/>
              <Text style={{ fontSize: moderateScale(15), color: this.state.buttonColor }}>{this.state.buttonText}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  topHalf: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    height:moderateScale(200),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderBottomWidth: 2,
    borderColor: '#90c5df',
    width: moderateScale(350),
  },
  text: {
    color: 'black',
    fontSize: moderateScale(13)
  },
  post1: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  post2: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  half1: {
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexDirection: 'row',
    flex: 1,
    width: moderateScale(350),
  },
  half2: {
    justifyContent: 'center',
    alignItems:'flex-end',
    flexDirection: 'row',
    width: moderateScale(350),
    marginBottom:10,
  },
  button1: {
    width: moderateScale(110),
    height: moderateScale(30),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth:2,
    flexDirection:'row',
    borderRadius: 5,

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
});