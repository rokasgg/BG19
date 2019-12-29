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
import firebase from "firebase";
import "firebase/firestore";

export default class editStadium extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalPickLocation: false,
      dateTime: null,
      peopleNeeded: 1,
      stadiumName: "",
      stadiumAddress: "",
      time: null,
      selectedStadium: null,
      defaultIndex: -1,
      address: "",
      phone: "",
      stadiumType: "",
      floorType: "d",
      longitude: "",
      latitude: "",
      stadiumId: null,
      inventor: false,
      paid: false,
      coords: null,
      locationPoints: null,
      locationText: "Pasirinkite!",
      stadiumTypes: ["Laukas", "Vidus"],
      floorTypes: ["Sintetinė žolė", "Natūrali žolė", "Parketas"],
      inventorType: ["Teikia", "Neteikia"],
      paidType: ["Mokamas", "Nemokamas"]
    };
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

  onCounterChange = counter => {
    this.setState({ peopleNeeded: counter });
  };

  componentDidUpdate(prevProps) {
    let incomingProps = this.props.data;
    if (prevProps.data !== this.props.data) {
      this.setState({
        stadiumName: incomingProps.stadiumName,
        address: incomingProps.address,
        stadiumType: incomingProps.stadiumType,
        phone: incomingProps.phone,
        floorType: incomingProps.floorType,
        paid: incomingProps.isPaid,
        inventor: incomingProps.inventor,
        stadiumId: incomingProps.stadiumId,
        coords: {
          latitude: incomingProps.latitude,
          longitude: incomingProps.longitude
        }
      });
      console.log("cozinam rerender", this.props.data);
    } else return false;
  }
  async componentDidMount() {
    let incomingProps = await this.props.data;
    await this.setingstate(incomingProps);
    // this.setState(
    //   {
    //     stadiumName: incomingProps.stadiumName,
    //     address: incomingProps.address,
    //     stadiumType: incomingProps.stadiumType
    //   },
    //   () => console.log("papai")
    // );
  }
  setingstate = async incomingProps => {
    this.setState({
      stadiumName: incomingProps.stadiumName,
      address: incomingProps.address,
      stadiumType: incomingProps.stadiumType
    });
  };

  getStadiumsOptions = () => {
    let stadiums = this.props.stadiums;
    let dropDownOptions = [];
    stadiums.forEach(stadium => {
      dropDownOptions.push(stadium.stadiumName);
    });
    this.setState({
      dropDownOptions
    });
  };

  //   componentDidMount() {
  //     // if (this.props.data !== null) {
  //     //   console.log("GAVOME DATA I MODALA !!!!", this.props.data);
  //     // } else console.log("BYBI NK NEGAUSI xD", this.props.data);
  //     // this.getStadiumsOptions();
  //   }

  onFinish = async () => {
    let stadiumData = {
      stadiumName: this.state.stadiumName,
      address: this.state.address,
      coordinates: new firebase.firestore.GeoPoint(
        this.state.locationPoints.latitude,
        this.state.locationPoints.longitude
      ) /*(latitude, longitude)*/
    };
    if (this.state.phone === "") {
      stadiumData.phone = 0;
    } else {
      stadiumData.phone = this.state.phone;
    }
    if (this.state.inventor === "0") {
      stadiumData.providesInventor = true;
    } else {
      stadiumData.providesInventor = false;
    }
    if (this.state.floorType === "0") {
      stadiumData.floorType = "synthetic";
    } else if (this.state.floorType === "1") {
      stadiumData.floorType = "grass";
    } else if (this.state.floorType === "2") {
      stadiumData.floorType = "futsal";
    }
    if (this.state.stadiumType === "1") {
      stadiumData.stadiumType = "indoor";
    } else {
      stadiumData.stadiumType = "outdoor";
    }
    if (this.state.paid === "0") {
      stadiumData.paid = true;
    } else {
      stadiumData.paid = false;
    }

    console.log(
      this.state.phone,
      "PRIDEDAMAS STADIONAS",
      stadiumData,
      this.state.stadiumType,
      this.state.floorType,
      this.handleFloorType(this.state.floorType)
    );
    firebase
      .firestore()
      .collection("stadiums")
      .add(stadiumData)
      .then(() => this.props.finish());
  };
  handleFloorType = async item => {
    switch (item) {
      case "0":
        return "synthetic";
      case "1":
        return "grass";
      case "2":
        return "futsal";
      default:
        return null;
    }
  };
  async handleStadiumType(item) {
    switch (item) {
      case 1:
        return "indoor";
      case 0:
        return "outdoor";
      default:
        return null;
    }
  }
  closePickModal = () => {
    this.setState({ modalPickLocation: false });
  };
  pickedLocation = locationPoints => {
    console.log("lokaicjos steitas", locationPoints);
    this.setState({
      locationText: `${locationPoints.longitude}; ${locationPoints.latitude};`,
      modalPickLocation: false,
      locationPoints
    });
  };
  openLocationModal = data => {
    if (data !== null)
      this.setState({ modalPickLocation: true, location: data });
    else this.setState({ modalPickLocation: true });
  };
  deleteStadium = () => {
    firebase
      .firestore()
      .collection("stadiums")
      .doc(this.props.data.stadiumId)
      .delete()
      .then(() => this.props.finish("delete"));
  };
  editStadiumInfo = () => {
    firebase
      .firestore()
      .collection("stadiums")
      .doc(this.props.data.stadiumId)
      .update({
        stadiumName: this.state.stadiumName,
        address: this.state.address,
        coordinates:
          this.state.locationPoints !== null
            ? new firebase.firestore.GeoPoint(
                this.state.locationPoints.latitude,
                this.state.locationPoints.longitude
              )
            : new firebase.firestore.GeoPoint(
                this.state.coords.latitude,
                this.state.coords.longitude
              ),
        providesInventor: this.state.inventor,
        phone:
          this.state.phone === ""
            ? parseInt(this.state.phone)
            : this.state.phone === "0"
            ? 0
            : parseInt(this.state.phone),
        floorType:
          this.state.floorType === "0"
            ? "synthetic"
            : this.floorType === "1"
            ? "grass"
            : "futsal",
        isPaid: this.state.paid,
        stadiumType:
          this.state.stadiumType === "1"
            ? "indoor"
            : this.state.stadiumType === "0"
            ? "outdoor"
            : null
      })
      .then(() => this.props.finish("edit"));
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
            <Text style={styles.textLeft}>Stadiono redagavimas</Text>
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
              <Text style={styles.textLeft}>Pavadinimas:</Text>
              <View style={styles.textRight}>
                <TextInput
                  onChangeText={val => this.setState({ stadiumName: val })}
                  value={this.state.stadiumName}
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
              <Text style={styles.textLeft}>Adresas:</Text>
              <View style={styles.textRight}>
                <TextInput
                  onChangeText={val => this.setState({ address: val })}
                  value={this.state.address}
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
              <Text style={styles.textLeft}>Telefono numeris:</Text>
              <View style={styles.textRight}>
                <TextInput
                  onChangeText={val => this.setState({ phone: val })}
                  value={this.state.phone === "0" ? "" : this.state.phone}
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
              <Text style={styles.textLeft}>Stadiono tipas:</Text>
              <View style={styles.textRight}>
                <ModalDropdown
                  options={this.state.stadiumTypes}
                  textStyle={{ fontSize: moderateScale(15) }}
                  dropdownTextStyle={{ fontSize: moderateScale(15) }}
                  defaultValue={
                    this.state.stadiumType === "indoor"
                      ? "Vidus"
                      : this.state.stadiumType === "outdoor"
                      ? "Laukas"
                      : "Pasirinkitee"
                  }
                  onSelect={val => this.setState({ stadiumType: val })}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                height: moderateScale(35),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Dangos tipas:</Text>
              <View style={styles.textRight}>
                <ModalDropdown
                  options={this.state.floorTypes}
                  textStyle={{ fontSize: moderateScale(15) }}
                  dropdownTextStyle={{ fontSize: moderateScale(15) }}
                  defaultValue={
                    this.state.floorType === "grass"
                      ? "Natūrali žolė"
                      : this.state.floorType === "synthetic"
                      ? "Sintetinė žolė"
                      : this.state.floorType === "futsal"
                      ? "Parketas"
                      : "Pasirinkitee"
                  }
                  onSelect={val => this.setState({ floorType: val })}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                height: moderateScale(35),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Teikia inventorių:</Text>
              <View style={styles.textRight}>
                <ModalDropdown
                  options={this.state.inventorType}
                  textStyle={{ fontSize: moderateScale(15) }}
                  dropdownTextStyle={{ fontSize: moderateScale(15) }}
                  defaultValue={
                    this.state.inventor == true ? "Teikia" : "Neteikia"
                  }
                  onSelect={val => {
                    this.setState({ inventor: val }, () =>
                      console.log("pasirinkimas", val)
                    );
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                height: moderateScale(35),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Kaina:</Text>
              <View style={styles.textRight}>
                <ModalDropdown
                  options={this.state.paidType}
                  textStyle={{ fontSize: moderateScale(15) }}
                  dropdownTextStyle={{ fontSize: moderateScale(15) }}
                  defaultValue={this.state.paid ? "Mokamas" : "Nemokamas"}
                  onSelect={val => {
                    this.setState({ paid: val }, () =>
                      console.log("pasirinkimas", val)
                    );
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                height: moderateScale(35),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Stadiono koordinatės:</Text>
              <View style={styles.textRight}>
                <TouchableOpacity
                  style={[
                    {
                      width: moderateScale(120),
                      height: moderateScale(35),
                      alignItems: "flex-end",
                      justifyContent: "center"
                    }
                  ]}
                  onPress={() => this.openLocationModal(this.state.coords)}
                >
                  <Text style={{ color: "gray", fontSize: moderateScale(15) }}>
                    {this.state.coords !== null
                      ? `Koordinatės nustatytos`
                      : "Prašome pasirinkti"}
                  </Text>
                </TouchableOpacity>
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
              onPress={this.editStadiumInfo}
            >
              <Text style={{ color: "#fff", fontSize: 22 }}>Redaguoti</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { justifyContent: "center", backgroundColor: "red" }
              ]}
              onPress={this.deleteStadium}
            >
              <Text style={{ color: "#fff", fontSize: 22 }}>Ištrinti</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ModalPickLocation
          visible={this.state.modalPickLocation}
          location={this.state.location}
          closeModal={this.closePickModal}
          finish={this.pickedLocation}
        />
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
    width: moderateScale(100),
    height: moderateScale(30),
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
