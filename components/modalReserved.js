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
export default class modalReserved extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      //       <Modal
      //       visible={this.props.visible}
      //       onSwipeComplete={this.props.closeModal}

      //       backdropColor='black'
      //       backdropOpacity={0.8}
      //       style={{justifyContent:'center', backgroundColor:'black', alignItems: "center"}}
      // >
      <View
        style={{
          justifyContent: "center",
          backgroundColor: "black",
          alignItems: "center",
          flex: 1
        }}
      >
        <View style={styles.topHalf}>
          <MapView
            style={{
              height: moderateScale(500),
              width: Dimensions.get("window").width
            }}
            region={{
              latitude: this.props.data.latitude,
              longitude: this.props.data.longitude,
              longitudeDelta: 0.0421,
              latitudeDelta: 0.0922
            }}
            showsUserLocation={true}
          >
            <Marker
              image={require("../pictures/kamuolys.png")}
              coordinate={{
                latitude: this.props.data.latitude,
                longitude: this.props.data.longitude,

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
              {this.props.data ? (
                <Text style={styles.textRight}>
                  {this.props.data.stadiumName}
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
              {this.props.data ? (
                <Text style={styles.textRight}>
                  {this.props.data.reservationDate}
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
              {this.props.data ? (
                <Text style={styles.textRight}>
                  {this.props.data.reservationId.id}
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
              {this.props.data ? (
                <Text style={styles.textRight}>
                  {this.props.data.reservationTime}
                </Text>
              ) : null}
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: moderateScale(10)
            }}
          >
            <TouchableOpacity
              style={styles.button1}
              onPress={this.props.closeModal}
            >
              <Text style={{ fontSize: moderateScale(17), color: "#fff" }}>
                Atšaukti rezervaciją
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* //</Modal>  */}
        <FlashMessage ref="war" position="top" />
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

  componentDidMount() {
    console.log("PROPSAI", this.props.data);
    this.showWarn();
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
    flexDirection: "column"
  },
  bottomHalf: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    width: Dimensions.get("window").width
  },
  button1: {
    width: moderateScale(200),
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
