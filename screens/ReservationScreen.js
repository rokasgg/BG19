import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Button
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";

import { connect } from "react-redux";
import { moderateScale } from "../components/ScaleElements";
import ModalReserved from "../components/modalReserved";
import ReservationList from "../components/reservationList";
import MCIcons from "react-native-vector-icons/MaterialCommunityIcons";

import firebase, { firestore } from "firebase";
import "firebase/firestore";

class ReservationScreen extends React.Component {
  static navigationOptions = { header: null };

  state = {
    modalOn: false,
    long: 25.29470536,
    lat: 54.6685367,
    date: {
      stadiumName: "",
      reservationDate: "",
      reservationTime: ""
    },
    modalReservationVisible: false,
    allEvents:[],
        data:[],
        modalReservationVisiblee:false
  };  
  render() {
    const { navigate } = this.props.navigation;

    const { dummyReducer = {} } = this.props;
    const { text = "" } = dummyReducer;
    console.log(text);
    return this.state.allEvents.length === 0 ? (
      <View style={styles.container}>
        <View style={styles.all}>
          <Ionicons name="md-information-circle-outline" size={45} color="#555" />
          <Text style={{ fontSize: 25, color: "lightgrey" }}>
            Nėra aktyvių rezervacijų :[
          </Text>
          <TouchableOpacity
            onPress={() => navigate("Main")}
            style={[styles.button1, { marginTop: 100 }]}
          >
            <Text style={{ fontSize: moderateScale(17), color: "#fff" }}>
              Ieškoti aikštelės
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("Events")}
            style={[
              styles.button1,
              { backgroundColor: "lightgrey", marginTop: 15 }
            ]}
          >
            <Text style={{ fontSize: moderateScale(17), color: "black" }}>
              Ieškoti žaidejų
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
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
            Aktyvios rezervacijos
          </Text>
        </View>
          <View style={{justifyContent:'flex-end', alignItems:'center'}}>
            <TouchableOpacity onPress={()=>this.setState({modalCreateEventVisible:true})}>
              {/* <Ionicons name="plus" size={25} color="#90c5df" /> */}
            </TouchableOpacity>
          </View>
      </View>

      <FlatList
        style={{ marginTop: 2, flex: 1 }}
        data={this.state.allEvents}
        renderItem={this.renderItems}
        keyExtractor={item => item.id}
      />
      {/* <ModalReserved
        visible={this.state.modalReservationVisiblee}
        data={this.state.data}
        closeModal={this.reservationModalClose}
        createEvent={this.createEvent}
    /> */}
    </View>
      
      
    );
  }
  
  componentDidMount() {
    console.log("EJO PROPSAI ",this.props.userId, this.props.navigation.getParam("data"));
    const ifPropsComing = this.props.navigation.getParam("data");
    this.getUserReservations();
    if (ifPropsComing !== undefined) {
      this.setState(
        {
          modalReservationVisible: true,
          data: this.props.navigation.getParam("data")
        },
        () =>
          console.log(
            ifPropsComing,
            "true ifas",
            this.props,
            this.props.navigation.state.params.data
          )
      );
    }
    console.log(ifPropsComing, "whateva ifas");
  }
  getUserReservations = async () =>{
    let eventList= Array.from(this.state.allEvents)
    await firebase.firestore().collection("reservations")
    .where("userId", "==", this.props.userId).get().then(res=>
      {console.log("IESKOT ID RES", res)
      if(res.docs.length >0){
        res.forEach(data=>{
          console.log("IESKOT ID RES", data)
          let eventDetails = {
            stadiumId: data._document.proto.fields.stadiumId.stringValue,
            stadiumName:data._document.proto.fields.stadiumName.stringValue,
            reservationTime: data._document.proto.fields.time.stringValue,
            reservationDate: data._document.proto.fields.date.stringValue,
            userId: data._document.proto.fields.userId.stringValue,
            reservationId:data.id
          };
          eventList.push(eventDetails);
          console.log(eventList)
        })
      }else{
        eventList=[]
      }
    }
  );
    this.setState({allEvents:eventList})
}

deleteReservation =(reservationId)=>{
  // console.log('PIRMAS CHEKAS', reservationId)
  this.getUserReservations();

  // let allReservations = Array.from(this.state.allEvents);
  // const index = allReservations.findIndex(item=>{
  //   item.reservationId === reservationId
  // });
  // allReservations.slice(index, 1);
  // console.log('ANTRAS CHEKAS', allReservations)

  // this.setState({allEvents:allReservations}, ()=>console.log('PIRMAS CHEKAS', this.state.allEvents));
}
  moreResDetails =(item)=>{
    this.props.navigation.navigate('ReservationDetails', {onGoBack:()=>this.deleteReservation(),data:item})
  }

  reservationModalClose = () => {
    firebase
      .firestore()
      .collection("reservations")
      .doc(this.state.data.reservationId.id)
      .delete();
    this.setState({ modalReservationVisible: false });
  };

  reservationModalClose=()=>{
    this.setState({modalReservationVisiblee:false})
  }
  

  renderItems = ({ item }) => {

    return (
      <View style={{ flexDirection: "row", width: moderateScale(330), flex:1, height: 80, marginTop: 20, borderRadius: 5, borderColor: "#90c5df", borderBottomWidth: 2, justifyContent:'space-evenly' }}>
        <View style={{borderColor: "#90c5df",justifyContent: "center",alignItems: "center", flex:1}}>
          <MCIcons name="calendar-clock" size={moderateScale(32)} color="#55A6CE" />  
        </View>
        
        <View style={{flexDirection: "column",alignItems: "flex-start",justifyContent: "center",flex:3 }}> 
          <Text style={{color:'black', fontSize:moderateScale(14), fontWeight:'600'}}>{item.reservationDate}</Text>
          <Text style={{color:'black', fontSize:moderateScale(14)}}>{item.reservationTime}</Text>
          <Text style={{color:'black', fontSize:moderateScale(14)}}>{item.stadiumName}</Text>
        </View>

        <View style={{flexDirection: "row",alignItems: "center",justifyContent: 'center',flex:1,  }}>
          <TouchableOpacity style={{ flexDirection: "row" }} onPressIn={()=>{this.moreResDetails(item)}}>
            <Ionicons name="ios-more" size={25} color="hsl(126, 62%, 40%)" />
          </TouchableOpacity>
        </View>
        
      </View>
    );
  };



}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  topHalf: {
    flex: 2,
    flexDirection: "column"
  },
  bottomHalf: {
    flex: 1,
    flexDirection: "column"
  },

  button1: {
    width: moderateScale(200),
    height: 40,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 5
  },
  text: {
    color: "black",
    fontSize: moderateScale(15)
  },
  all: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column"
  },

  textLeft: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 5,
    marginTop: 5,
    textAlign: "left",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 5
  },
  textRight: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 5,
    marginTop: 5,
    textAlign: "right",
    justifyContent: "flex-end",
    paddingRight: 5
  }
});
const mapStateToProps = state => ({
  userId:state.auth.userUid

});
export default connect(
  mapStateToProps
)(ReservationScreen);

