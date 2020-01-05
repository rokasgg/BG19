import React, { Component } from "react";
import Modal from "react-native-modal";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Picker,
  Alert
} from "react-native";
import { moderateScale } from "./ScaleElements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import firebase, { firestore } from "firebase";
import "firebase/firestore";
import AskPerm from "../components/askPerm";
import ModalCreateSearch from "../components/modalCreateSearch";
import { getTodaysTime } from "../components/getTodaysTime";
import { getTimeSeconds } from "../components/getTimeSeconds";
import FlashMessage from "react-native-flash-message";

class ReservedDetails extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      spinnerText: "",
      askPermVisible: false,
      modalCreateSearch: false
    };
  }

  render() {
    const data = this.props.navigation.state.params.data;

    return (
      <View
        style={{
          backgroundColor: "white",
          alignItems: "center",
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          paddingBottom: moderateScale(70)
        }}
      >
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
              height: moderateScale(165),
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f2f2f2"
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
              {data ? (
                <Text style={styles.textRight}>{data.stadiumName}</Text>
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
                <Text style={styles.textRight}>{data.reservationDate}</Text>
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
              <Text style={styles.textLeft}>Rezervacijos pradžia:</Text>
              {data ? (
                <Text style={styles.textRight}>{data.reservationStart}</Text>
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
              <Text style={styles.textLeft}>Rezervacijos pabaiga:</Text>
              {data ? (
                <Text style={styles.textRight}>{data.reservationFinish}</Text>
              ) : null}
            </View>
            {data.active ? (
              data.started ? null : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: moderateScale(340),
                    borderColor: "hsl(186, 62%, 40%)",
                    borderBottomWidth: 1,
                    marginTop: moderateScale(5),
                    marginBottom:moderateScale(3)
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.button1,
                      {
                        backgroundColor: "white",
                        borderWidth: 1,
                        borderColor: "hsl(186, 62%, 40%)",
                        height:moderateScale(25),
                        width:moderateScale(110),marginBottom:moderateScale(2),marginRight:moderateScale(5)
                      
                      }
                    ]}
                    onPress={this.navToEvents}
                  >
                    <Text
                      style={{
                        fontSize: moderateScale(13),
                        color: "hsl(186, 62%, 40%)"
                      }}
                    >
                      Trūksta žaidėjų?
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : null}
          </View>

          <View
            style={{
              justifyContent: "space-around",
              alignItems: 'flex-start',
              flexDirection: "row",
              marginBottom: moderateScale(20),
              height:moderateScale(35)
            }}
          >
            <TouchableOpacity
              style={[
                styles.button1,
                {
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "hsl(186, 62%, 40%)"
                }
              ]}
              onPress={this.goingBack}
            >
              <Text
                style={{
                  fontSize: moderateScale(17),
                  color: "hsl(186, 62%, 40%)"
                }}
              >
                Grįžti
              </Text>
            </TouchableOpacity>
            {data.active ? (
              data.started ? null : (
                <TouchableOpacity
                  style={styles.button1}
                  onPress={() => this.askPermToDelete()}
                >
                  <Text style={{ fontSize: moderateScale(17), color: "#fff", fontWeight:'500' }}>
                    Atšaukti
                  </Text>
                </TouchableOpacity>
              )
            ) : null}
          </View>
          <Spinner
            visible={this.state.spinner}
            textContent={this.state.spinnerText}
            textStyle={styles.spinnerTextStyle}
            overlayColor="rgba(0,0,0,0.5)"
          />
        </View>
        <AskPerm
          visible={this.state.askPermVisible}
          acceptBtnText="Atšaukti"
          declineBtnText="Grįžti"
          message="Ar tikrai norite atšaukti rezervaciją ?"
          accept={this.cancelReservation}
          decline={() => {
            this.setState({ askPermVisible: false });
          }}
        />

        <FlashMessage ref="warnning" position="top" />
      </View>
    );
  }
  goingBack = () => {
    // this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
  };

  showWarn = () => {
    this.refs.war.showMessage({
      message: "Rezervacija atlitka sėkmingai!",
      type: "success",
      duration: 10000,
      autoHide: true,
      hideOnPress: true
    });
  };
  deleteItem = async () => {
    let data = this.props.navigation.state.params.data;
    console.log(data.reservationId, "blabalbal");
    await firebase
      .firestore()
      .collection("reservations")
      .doc(data.reservationId)
      .delete();
  };
  startSpinner = text => {
    this.setState({ spinnerText: text, spinner: true, askPermVisible: false });
  };
  finishSpinner = () => {
    setTimeout(() => {
      this.setState({ spinner: false }, () => {
        this.props.navigation.goBack();
      });
    }, 5000);
  };
  cancelReservation = async reservationId => {
    this.startSpinner("Atšaukiama rezervacija...");
    this.props.navigation.state.params.onGoBack(reservationId);
    this.deleteItem(reservationId);

    this.finishSpinner();
  };
  navToEvents = () => {
    let data = this.props.navigation.state.params.data;

    console.log("navToEvents", data, getTodaysTime());
    this.props.navigation.navigate("Events", {
      success: true,
      reservationData: data,
      dateTime: getTimeSeconds(),
      resId: data.reservationId
    });
  };

  askPermToDelete = () => {
    this.setState({ askPermVisible: true });
  };

  componentDidMount() {
    console.log("PROPSAI", this.props, this.props.navigation);
    if(this.props.navigation.state.params.reserved){
      this.refs.warnning.showMessage({
        message: 'Aikštelė užrezervuota sėkmingai!',
        type: "success",
        duration: 7000,
        autoHide: true,
        hideOnPress: true
      });
    }
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
  },
  bottomHalf: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    width: Dimensions.get("window").width
  },
  button1: {
    width: moderateScale(115),
    height: moderateScale(28),
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
  },
  spinnerTextStyle: {
    color: "#fff"
  }
});
const mapStateToProps = state => ({
  userId: state.auth.userUid
});
export default connect(mapStateToProps)(ReservedDetails);
