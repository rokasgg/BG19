import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  FlatList,
  TextInput,
  Picker
} from "react-native";

import Ionicons from "react-native-vector-icons/FontAwesome5";

import Modal from "react-native-modalbox";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import { HeaderStyleInterpolator } from "react-navigation";
import ModalCreateEvent from '../components/modalAddEvent';
import { moderateScale } from "../components/ScaleElements";
import firebase from 'firebase';
import 'firebase/firestore';

const coolColor ='#90c5df';

export default class Events extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,

      isOpen2: false,

      //Flatlist Data
      eventDetails: {
        stadiumName: "Name",
        reservationTime: "TIME",
        stadiumRating: "10/50",
        stadiumImage: "dsa",
        peopleNeed: "10",
        id: "10",
        comment: "dsadad"
      },

      //Flatlist DATA
      eventsArray: [],
      allEvents: [],
      ok: [],

      //Modal values
      modalCreateEventVisible: false,
      isDisabled: false,
      swipeToClose: true,

      //DataPICKER VALUES
      isDateTimePickerVisible: false,
      dateTime: ["Set time"],

      //BlankVALUES
      peopleNumber: "",
      text1: "",
      text2: ""
    };
  }
  static navigationOption = {
    title: "Here you can see your events?"
  };

  render() {
    const { navigate } = this.props.navigation;
    return (

        <View style={{ flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",flexDirection: "column" }}>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "stretch",
              marginLeft: 10,
              marginTop: 30,
              width: moderateScale(330)
            }}
          >
            <View style={{justifyContent:'flex-start', alignItems:'center'}}>
              <Text style={{ fontSize: 20, color: "black" }}>
                Žaidėjų paieška
              </Text>
            </View>
              <View style={{justifyContent:'flex-end', alignItems:'center'}}>
                <TouchableOpacity onPress={()=>this.setState({modalCreateEventVisible:true})}>
                  <Ionicons name="plus" size={25} color="#90c5df" />
                </TouchableOpacity>
              </View>
          </View>

          <FlatList
            style={{ marginTop: 2, flex: 1 }}
            data={this.state.allEvents}
            renderItem={this.renderItems}
            keyExtractor={item => item.id}
          />
          <ModalCreateEvent
           visible={this.state.modalCreateEventVisible}
            //  data={this.state.markersData}
           closeModal={this.closeModalCreateEvent}
           createEvent={this.createEvent}
          />
        </View>

    );
  }
  //CREATING AN EVENT-------------------------------------

  closeModalCreateEvent =()=>{
    this.setState({
      modalCreateEventVisible:false
    })
  }
  createEvent1=(eventsInfo)=>{
    this.setState({
      modalCreateEventVisible:false
    })
  }

  createEvent =  (eventsInfo) => {
    console.log("Yoooo", eventsInfo);
    let eventDetails = {
      stadiumName: eventsInfo.stadiumName,
      reservationTime: eventsInfo.dateTime,
      stadiumAdress: eventsInfo.stadiumAddress,
      peopleNeed: eventsInfo.peopleNeeded,
      id: "1"
    };
    // var newStateArray = this.state.ok;
    // newStateArray.push(eventDetails);
    console.log(this.state.allEvents)
    let eventList= Array.from(this.state.allEvents)
    eventList.push(eventDetails);


    // var heloo = await AsyncStorage.getItem("event");
    // heloo = JSON.parse(heloo);
    // if(heloo !==null){
    //   heloo.push(eventDetails);
    // console.log(heloo);
    // }

    // console.log("VA CIA VISI KAS TEN YRA", heloo);
    // AsyncStorage.setItem("event", JSON.stringify(heloo));

    // let user = await AsyncStorage.getItem("event");
    // let next = await JSON.parse(user);
    this.setState({ allEvents: eventList, modalCreateEventVisible:false }, ()=>console.log("Ir cia visi eventai:", this.state.allEvents));

    // let heloos = await AsyncStorage.getItem("event");

    // console.log("VA CIA VISI KAS TEN YRA", heloos);
  };

  //-------------------------------------CREATING AN EVENT
  newEvenet = async () =>{
    let eventList= Array.from(this.state.allEvents)
    await firebase.firestore().collection('events').get().then(res=>res.forEach(data=>{
      let eventDetails = {
        stadiumName: data._document.proto.fields.stadiumName.stringValue,
        reservationTime: data._document.proto.fields.date.stringValue,
        stadiumAdress: data._document.proto.fields.address.stringValue,
        peopleNeed: data._document.proto.fields.peopleNeeded.integerValue,
        id: "1"
      };
      eventList.push(eventDetails);
      console.log(eventList)
    }));
    this.setState({allEvents:eventList})
  }


  componentDidMount (){
    this.newEvenet();
  }

  //EVENT SETTER-------------------------------------
  
  renderItems = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flexDirection: "row", width: moderateScale(330), flex:1, height: 80, marginTop: 20, borderRadius: 5, borderColor: "#90c5df", borderBottomWidth: 2, justifyContent:'space-evenly' }}>
        <View style={{borderColor: "#90c5df",justifyContent: "center",alignItems: "center", flex:2}}>
          <Image
            style={{ width: 100, height: 60, resizeMode:'contain' }}
            source={require("../pictures/new.jpg")}
          />
        </View>
        
        <View style={{flexDirection: "column",alignItems: "flex-start",justifyContent: "center",flex:3 }}> 
          <Text style={{color:'black', fontSize:moderateScale(14), fontWeight:'600'}}>{item.reservationTime}</Text>
          <Text style={{color:'black', fontSize:moderateScale(14)}}>{item.stadiumName}</Text>
          <Text style={{color:'black', fontSize:moderateScale(14)}}>{item.stadiumAdress}</Text>
        </View>

        <View style={{flexDirection: "row",alignItems: "center",justifyContent: 'center',flex:1,  }}>
          <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigate("EventsDetails", { item1: item })}>
            <Ionicons name="user-plus" size={25} color="hsl(126, 62%, 40%)" />
            <Text style={{ fontSize: 17, color: "black", marginLeft: 5 }}>
              {item.peopleNeed}
            </Text>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  };

  //-------------------------------------EVENT SETTER

  //DATA PICKER-------------------------------------
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

  ////-------------------------------------DATA PICKER
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  modal4: {
    height: 400
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  modalView1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 50
  },
  modalView2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: 50
  },

  text: {
    color: "black",
    fontSize: 22
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
});
