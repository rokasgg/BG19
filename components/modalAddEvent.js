import React, { Component } from "react";
import Modal from "react-native-modal";

import {
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  Picker
} from "react-native";
import {moderateScale} from './ScaleElements';
import DateTimePicker from 'react-native-datepicker';
import NumberCounter from './numberCounter';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class modalReservation extends React.Component {
  constructor(props){
    super(props)
    this.state={
        dateTime:null,
        peopleNeeded:null,
        stadiumName:'',
        stadiumAddress:''

    }
  }
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ dateTime: moment(date).format("YYYY Do MMMM, HH:mm") });
    console.log(this.state.dateTime);
    this.hideDateTimePicker();
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  onCounterChange = (counter)=>{
      this.setState({peopleNeeded:counter})
  }

  onCreateEvent=()=>{
      console.log(this.state.stadiumName, this.state.stadiumAddress, this.state.peopleNeeded, this.state.dateTime)
      let searchDetails={
          stadiumName:this.state.stadiumName,
          stadiumAddress:this.state.stadiumAddress,
          peopleNeeded:this.state.peopleNeeded,
          dateTime:this.state.dateTime
      }
      this.props.createEvent(searchDetails)
  }


  render() {
    return (

        <Modal
            visible={this.props.visible}
            onSwipeComplete={this.props.closeModal}
            hasBackdrop={false}
            backdropColor='black'
            backdropOpacity={0.8}
            animationInTiming={10000}
            animationOutTiming={10000}
            backdropTransitionInTiming={2000}
            backdropTransitionOutTiming={2000}
            style={{justifyContent:'flex-end', margin:0, backgroundColor:'white', alignItems: "center", backgroundColor:'#f2f2f2', height: moderateScale(230)}}
      >
        <View style={{ flex: 1, flexDirection: "column",
        justifyContent:'center', alignItems:'center' }}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', height:moderateScale(45) ,width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                <Text style={styles.textLeft}>Stadiono pavadinimas:</Text>
                <TextInput
                    placeholder={"Stadium Name"}
                    style={styles.textRight}
                    onChangeText={text => this.setState({ stadiumName:text })}
                />
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',height:moderateScale(45) , width:moderateScale(340),borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                <Text style={styles.textLeft}>Adresas:</Text>
                <TextInput
              placeholder={"Adress"}
              style={styles.textRight}
              onChangeText={text => this.setState({ stadiumAddress:text })}
            />
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', height:moderateScale(45) ,width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                <Text style={styles.textLeft}>Data:</Text>
                <DateTimePicker
                    style={{color: "black",
                    fontSize: moderateScale(15),
                    marginBottom: 5,
                    marginTop:5,
                    textAlign:'right',
                    justifyContent:'flex-end', 
                    paddingRight:5}}
                    customStyles={{
                        
                        dateText:{
                            fonstSize:moderateScale(13)
                        },
                        dateInput:{
                            alignItems:'flex-end'
                            ,borderWidth:0,
                            paddingLeft:4,
                            marginRight:4,
                            flex:1
                        },
                        dateIcon:{display:"none"}
                    }}
                    mode={"datetime"}
                    mode='date'
                    date={this.state.dateTime}
                    androidMode='spinner'
                    onDateChange={val =>{this.setState({dateTime:val})}}
                    confirmBtnText='Pick'
                    cancelBtnText='Cancel'
                />
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                <Text style={styles.textLeft}>Ieškomų žmonių skaičius:</Text>
                <NumberCounter finishCount={(count)=>this.onCounterChange(count)} />
            </View>
          </View>

        
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
             width:moderateScale(350)
          }}
        >
          <TouchableOpacity style={[styles.button,{flexDirection:'row', justifyContent:'space-around'}]} onPress={this.props.closeModal}>
            <Icon name='times' size={18} color='#fff'/>
            <Text style={{ color: "#fff", fontSize: 22 }}>Atšaukti</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button,{flexDirection:'row', justifyContent:'space-around'}]}  onPress={this.onCreateEvent}>
            <Icon name='search-plus' size={18} color='#fff'/>
            <Text style={{ color: "#fff", fontSize: 22 }}>Ieškoti</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    );
  }
}
// } <TouchableOpacity style={styles.button} onPress={this.confirmData}>
const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'#f2f2f2',
    flex:1
  },
  modalEvent: {
    height: 600
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
  modalView1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: moderateScale(25)
  },
  modalView2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: moderateScale(25)
  },

  text: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 10
  },
  button: {
    width: moderateScale(120),
    height: moderateScale(35),
    backgroundColor: "hsl(186, 62%, 40%)",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 5
  },
  buttonEdit: {
    backgroundColor: "orange",
    marginLeft: 10
  }
});

