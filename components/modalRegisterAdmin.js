import React, { Component } from "react";
import Modal from "react-native-modal";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from "react-native";
import { moderateScale } from "./ScaleElements";
import DateTimePicker from "react-native-datepicker";
import NumberCounter from "./numberCounter";
import Icon from "react-native-vector-icons/FontAwesome";
import ModalDropdown from "react-native-modal-dropdown";
import ModalPickLocation from "../components/modalPickLocation";
import FlashMessage from "react-native-flash-message";
import firebase from "firebase";
import "firebase/firestore";

export default class modalRegisterAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalPickLocation: false,
      dateTime: null,
      name: "",
      password: "",
      phone: null,
      email: ""
    };
  }

  //   componentDidUpdate(prevProps) {
  //     if (prevProps.data !== this.props.data) {
  //       let index = this.state.dropDownOptions.findIndex(
  //         item => item === this.props.data.stadiumName
  //       );
  //       this.setState({
  //         selectedStadium: this.props.data.stadiumName,
  //         dateTime: this.props.data.reservationDate,
  //         time: this.props.data.reservationStart,
  //         stadiumAddress: this.props.data.address,
  //         defaultIndex: index
  //       });
  //       console.log("cozinam rerender", this.props.data, index);
  //     } else return false;
  //   }

  componentDidMount() {
    // if (this.props.data !== null) {
    //   console.log("GAVOME DATA I MODALA !!!!", this.props.data);
    // } else console.log("BYBI NK NEGAUSI xD", this.props.data);
    // this.getStadiumsOptions();
  }

  closePickModal = () => {
    this.setState({ modalPickLocation: false });
  };

  registerAdmin = async () => {
    const { name, email, password, phone } = this.state;
    if (name !== "" && email !== "" && password !== "" && phone !== "") {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(response => {
          console.log("REG RESPONSE", response);
          const usersData = {
            name: this.state.name,
            email: this.state.email,
            admin: false,
            administrator: true,
            stadiumId: this.props.data.stadiumId,
            stadiumName: this.props.data.stadiumName
          };
          const userId = response.user.uid;
          firebase
            .firestore()
            .collection("users")
            .doc(`${userId}`)
            .set(usersData);
        });
      this.props.finish();
    } else {
      this.refs.warn.showMessage({
        message: "Prašome užpildyti visus laukelius!",
        type: "warning",
        duration: 7000,
        autoHide: true,
        hideOnPress: true
      });
    }
  };

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        onSwipeComplete={this.props.closeModal}
        onBackdropPress={this.props.closeModal}
        hasBackdrop={true}
        backdropColor="black"
        backdropOpacity={0.4}
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        backdropColor="black"
        backdropOpacity={0.3}
      >
        <View
          style={{
            backgroundColor: "#f2f2f2",
            height: moderateScale(395),
            width: moderateScale(365),
            borderRadius: 15
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              height: moderateScale(45),
              width: moderateScale(340),
              marginLeft: moderateScale(7)
            }}
          >
            <Text style={styles.textLeft}>Administratoriaus kūrimas</Text>
          </View>
          <View
            style={{
              flex: 4,
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
                height: moderateScale(35),
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Prisijungimo vardas:</Text>
              <View style={styles.textRight}>
                <TextInput
                  onChangeText={val => this.setState({ email: val })}
                  value={this.state.email}
                  placeholder="Įveskite"
                  style={{ fontSize: moderateScale(15), color: "gray" }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(35),
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Slaptažodis:</Text>
              <View style={styles.textRight}>
                <TextInput
                  onChangeText={val => this.setState({ password: val })}
                  value={this.state.password}
                  placeholder="Įveskite"
                  style={{ fontSize: moderateScale(15), color: "gray" }}
                  secureTextEntry={true}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(35),
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Telefono numeris:</Text>
              <View style={styles.textRight}>
                <TextInput
                  onChangeText={val => this.setState({ phone: val })}
                  value={this.state.phone}
                  placeholder="Įveskite"
                  style={{ fontSize: moderateScale(15), color: "gray" }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(35),
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Vardas:</Text>
              <View style={styles.textRight}>
                <TextInput
                  onChangeText={val => this.setState({ name: val })}
                  value={this.state.name}
                  placeholder="Įveskite"
                  style={{ fontSize: moderateScale(15), color: "gray" }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: moderateScale(350),
              alignSelf: "center"
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                {
                  flexDirection: "row",
                  justifyContent: "space-around",
                  backgroundColor: "orange"
                }
              ]}
              onPress={this.props.closeModal}
            >
              <Text style={{ color: "#fff", fontSize: 22 }}>Atšaukti</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { justifyContent: "center" }]}
              onPress={this.registerAdmin}
            >
              <Text style={{ color: "#fff", fontSize: 22 }}>Sukurti</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlashMessage ref="warn" position="top" />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    height: moderateScale(350),
    width: moderateScale(340),
    backgroundColor: "yellow"
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
