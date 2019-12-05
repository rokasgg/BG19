import React, { Component } from "react";
import Modal from "react-native-modal";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Picker
} from "react-native";
import { moderateScale } from "./ScaleElements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";
import FlashMessage from "react-native-flash-message";
import firebase, { firestore } from "firebase";
import "firebase/firestore";

export default class modalReserved extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = this.props.navigation.state.params.data;

    return (

        <View style={{   
          backgroundColor: "white",
          alignItems: "center",
          width:Dimensions.get("window").width,
          height:Dimensions.get("window").height,
          paddingBottom:moderateScale(70)}}>
        <View style={styles.topHalf}>
          <MapView
            style={{
              height: moderateScale(500),
              width: Dimensions.get("window").width
            }}
            region={{
              latitude: 54.70298303,
              longitude: 25.26908684,
              longitudeDelta: 0.0421,
              latitudeDelta: 0.0922
            }}
            showsUserLocation={true}
          >
            <Marker
              image={require("../pictures/kamuolys.png")}
              coordinate={{
                latitude: 54.70298303,
                longitude: 25.26908684,
                longitudeDelta: 0.0421,
                latitudeDelta: 0.0922
              }}
            />
          </MapView>
        </View>
        <View style={styles.bottomHalf}>
          <View
            style={{
              height: moderateScale(150),
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                borderColor: "hsl(186, 62%, 40%)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Pavadinimas:</Text>
              {data? (
                <Text style={styles.textRight}>
                  {data.stadiumName}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                borderColor: "hsl(186, 62%, 40%)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Rezervacijos diena:</Text>
              {data ? (
                <Text style={styles.textRight}>
                  {data.reservationDate}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                borderColor: "hsl(186, 62%, 40%)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Rezervacijos ID:</Text>
              {data ? (
                <Text style={styles.textRight}>
                  {data.reservationId}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                borderColor: "hsl(186, 62%, 40%)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Rezervacijos laikas:</Text>
              {data ? (
                <Text style={styles.textRight}>
                  {data.reservationTime}
                </Text>
              ) : null}
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-around',
              alignItems: "center",
              flexDirection:'row',
              marginBottom: moderateScale(15)
            }}
          >
            <TouchableOpacity
              style={[styles.button1,{backgroundColor:'white', borderWidth:1, borderColor:'hsl(186, 62%, 40%)'}]}
              onPress={()=>this.props.navigation.goBack()}
            >
              <Text style={{ fontSize: moderateScale(17), color: "hsl(186, 62%, 40%)" }}>
                Grižti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button1}
              onPress={()=>this.cancelReservation(data.reservationId)}
            >
              <Text style={{ fontSize: moderateScale(17), color: "#fff" }}>
                Atšaukti rezervaciją
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* //</Modal>  */}
        {/* <FlashMessage ref="war" position="top" /> */}
        </View>
    );
  }
  showWarn = () => {
    this.refs.war.showMessage({
      message: "Rezervacija atlitka sėkmingai!",
      type: "success",
      duration: 10000,
      autoHide: true,
      hideOnPress: true
    });
  };
  cancelReservation = (reservationId)=>{
    this.props.navigation.state.params.onGoBack(reservationId);
    this.props.navigation.goBack()
    
    firebase
      .firestore()
      .collection("reservations")
      .doc(reservationId)
      .delete();
  }
  componentDidMount() {
    console.log("PROPSAI", this.props.data,this.props.navigation
    );

  }
}
const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    height: moderateScale(230)
  },

  topHalf: {
    flex: 2,
    flexDirection: "column",
    backgroundColor:'yellow'
  },
  bottomHalf: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    width: Dimensions.get("window").width
  },
  button1: {
    width: moderateScale(170),
    height: 40,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 5
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
