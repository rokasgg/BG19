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
import Ionicons from "react-native-vector-icons/Entypo";
import MapView, { Marker } from "react-native-maps";

import { connect } from "react-redux";
import Geolocation, { watchPosition } from "react-native-geolocation-service";
import { isTSAnyKeyword } from "@babel/types";
import { isEqual } from "date-fns";
import { dummyReducer } from "../redux/reducers/dummyReducer";
import { moderateScale } from "../components/ScaleElements";
import Modal from "react-native-modal";
import ModalReserved from "../components/modalReserved";
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
    modalReservationVisible: false
  };
  render() {
    const { navigate } = this.props.navigation;

    const { dummyReducer = {} } = this.props;
    const { text = "" } = dummyReducer;
    console.log(text);
    return !this.state.modalReservationVisible ? (
      <View style={styles.container}>
        <View style={styles.all}>
          <Ionicons name="info-with-circle" size={45} color="#555" />
          <Text style={{ fontSize: 25, color: "lightgrey" }}>
            Nėra aktyvios rezervacijos :[
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
      <ModalReserved
        visible={this.state.modalReservationVisible}
        data={this.state.data}
        closeModal={this.reservationModalClose}
        createEvent={this.createEvent}
      />
    );
  }
  componentDidMount() {
    console.log("EJO PROPSAI ", this.props.navigation.getParam("data"));
    const ifPropsComing = this.props.navigation.getParam("data");
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
  reservationModalClose = () => {
    firebase
      .firestore()
      .collection("reservations")
      .doc(this.state.data.reservationId.id)
      .delete();
    this.setState({ modalReservationVisible: false });
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

export default connect(({ dummyReducer }) => ({ dummyReducer }))(
  ReservationScreen
);
