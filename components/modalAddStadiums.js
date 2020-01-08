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
import Spinner from "react-native-loading-spinner-overlay";
import ModalDropdown from "react-native-modal-dropdown";
import ModalPickLocation from "../components/modalPickLocation";
import firebase from "firebase";
import "firebase/firestore";
import FlashMessage from "react-native-flash-message";
import { Dimensions } from "react-native";
export default class modalAddStadiums extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalPickLocation: false,
      dateTime: null,
      peopleNeeded: 1,
      stadiumAddress: "",
      time: null,
      selectedStadium: null,
      defaultIndex: -1,
      stadiumName: "",
      address: "",
      phone: "",
      stadiumType: "",
      floorType: "",
      longitude: "",
      latitude: "",
      inventor: false,
      paid: false,
      locationPoints: null,
      locationText: "Pasirinkite!",
      stadiumTypes: ["Laukas", "Vidus"],
      floorTypes: ["Sintetinė žolė", "Natūrali žolė", "Parketas"],
      inventorType: ["Teikia", "Neteikia"],
      paidType: ["Mokamas", "Nemokamas"],
      spinner:false,
      price:null
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
closeModala=()=>{
    this.setState({ stadiumName: "",
    address: "",
    phone: "",
    stadiumType: "",
    floorType: "",
    longitude: "",
    latitude: "",
    inventor: false,
    paid: false,
    locationPoints: null,
  price:'',
  stadiumAddress: "",})
    this.props.closeModal();
  }
  componentDidMount() {
    // if (this.props.data !== null) {
    //   console.log("GAVOME DATA I MODALA !!!!", this.props.data);
    // } else console.log("BYBI NK NEGAUSI xD", this.props.data);
    // this.getStadiumsOptions();
  }
  startSpinner=()=>{
    this.setState({spinner:true})
  }

  onFinish = async () => {
    if(this.state.stadiumName !== '',this.state.address!=='',this.state.locationPoints !== null, this.state.inventor!==false, this.state.floorType!=='', this.state.stadiumType!== '', this.state.paid !== false)
   { this.startSpinner();
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
      stadiumData.phone = parseInt(this.state.phone);
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
    if (this.state.paid === "0") {
      stadiumData.price = this.state.price;
    } else {
      stadiumData.price = '0';
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
      .then(res => {
        this.setState({spinner:false},()=>this.props.finish({
          stadiumId: res.id,
          stadiumName: this.state.stadiumName
        }))
      });}else{
        this.refs.emptyFields.showMessage({
          message: 'Prašome užpildyti visus laukelius!',
          type: "warning",
          duration: 8000,
          autoHide: true,
          hideOnPress: true
        });
      }
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
      locationText: `Nustatyta`,
      modalPickLocation: false,
      locationPoints
    });
  };
  openLocationModal = () => {
    this.setState({ modalPickLocation: true });
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
      ><View style={{width: Dimensions.get("window").width, height:Dimensions.get("window").height,justifyContent:'center',
      alignItems:'center'}}><FlashMessage style={{width: Dimensions.get("window").width, justifyContent:'flex-start', marginTop:moderateScale(10)}} ref='emptyFields' position='top' />
        <View
          style={{
            backgroundColor: "#f2f2f2",
            height: moderateScale(395),
            width: moderateScale(340),
            borderRadius: 15
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              height: moderateScale(45),
              width: moderateScale(300),
              marginLeft: moderateScale(7)
            }}
          >
            <Text style={[styles.textLeft,{fontSize:moderateScale(16)}]}>Naujo stadiono pridėjimas</Text>
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
                width: moderateScale(300),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={[styles.textLeft,{fontWeight:'500'}]}>Pavadinimas:</Text>
              <View style={[styles.textRight, { alignItems:'center', justifyContent:'center', paddingTop:moderateScale(8)}]}>
                <TextInput
                  onChangeText={val => this.setState({ stadiumName: val })}
                  value={this.state.stadiumName}
                  placeholder="Įveskite"
                  style={{ fontSize: moderateScale(15), color: "gray", height:moderateScale(35)}}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(35),
                width: moderateScale(300),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={[styles.textLeft,{fontWeight:'500'}]}>Adresas:</Text>
              <View style={[styles.textRight,{ alignItems:'center', justifyContent:'center', paddingTop:moderateScale(8)}]}>
                <TextInput
                  onChangeText={val => this.setState({ address: val })}
                  value={this.state.address}
                  placeholder="Įveskite"
                  style={{ fontSize: moderateScale(15), color: "gray", height:moderateScale(35)}}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(35),
                width: moderateScale(300),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={[styles.textLeft,{fontWeight:'500'}]}>Telefono numeris:</Text>
              <View style={[styles.textRight,{ alignItems:'center', justifyContent:'center', paddingTop:moderateScale(8)}]}>
                <TextInput
                  onChangeText={val => this.setState({ phone: val })}
                  value={this.state.phone}
                  placeholder="Įveskite"
                  style={{ fontSize: moderateScale(15), color: "gray", height:moderateScale(35)}}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(35),
                width: moderateScale(300),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={[styles.textLeft,{fontWeight:'500'}]}>Stadiono tipas:</Text>
              <View style={styles.textRight}>
                <ModalDropdown
                  options={this.state.stadiumTypes}
                  textStyle={{ fontSize: moderateScale(15) }}
                  dropdownTextStyle={{ fontSize: moderateScale(15) }}
                  defaultValue={"Pasirinkite"}
                  onSelect={val => this.setState({ stadiumType: val })}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(300),
                height: moderateScale(35),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={[styles.textLeft,{fontWeight:'500'}]}>Dangos tipas:</Text>
              <View style={styles.textRight}>
                <ModalDropdown
                  options={this.state.floorTypes}
                  textStyle={{ fontSize: moderateScale(15) }}
                  dropdownTextStyle={{ fontSize: moderateScale(15) }}
                  defaultValue={"Pasirinkite"}
                  onSelect={val => this.setState({ floorType: val })}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(300),
                height: moderateScale(35),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={[styles.textLeft,{fontWeight:'500'}]}>Teikia inventorių:</Text>
              <View style={styles.textRight}>
                <ModalDropdown
                  options={this.state.inventorType}
                  textStyle={{ fontSize: moderateScale(15) }}
                  dropdownTextStyle={{ fontSize: moderateScale(15) }}
                  defaultValue={"Pasirinkite"}
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
                width: moderateScale(300),
                height: moderateScale(35),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={[styles.textLeft,{fontWeight:'500'}]}>Kaina:</Text>
              <View style={styles.textRight}>
                <ModalDropdown
                  options={this.state.paidType}
                  textStyle={{ fontSize: moderateScale(15) }}
                  dropdownTextStyle={{ fontSize: moderateScale(15) }}
                  defaultValue={"Pasirinkite"}
                  onSelect={val => {
                    this.setState({ paid: val }, () =>
                      console.log("pasirinkimas", val)
                    );
                  }}
                />
              </View>
            </View>
            {this.state.paid==='0'?<View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(300),
                height: moderateScale(35),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={[styles.textLeft,{fontWeight:'500'}]}>Valandinė kaina:</Text>
              <View style={[styles.textRight,{ alignItems:'center', justifyContent:'center', paddingTop:moderateScale(8)}]}>
                <TextInput
                  onChangeText={val => this.setState({ price: val })}
                  value={this.state.price}
                  placeholder="€/h"
                  style={{ fontSize: moderateScale(15), color: "gray", height:moderateScale(35)}}
                  keyboardType='decimal-pad'
                />
              </View>
            </View>:null}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(300),
                height: moderateScale(35),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={[styles.textLeft,{fontWeight:'500'}]}>Stadiono koordinatės:</Text>
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
                  onPress={this.openLocationModal}
                >
                  <Text style={{ color: "gray", fontSize: moderateScale(15) }}>
                    {this.state.locationPoints ? "Nustatyta":"Pasirinkite"}
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
              onPress={this.closeModala}
            >
              <Text style={{ color: "#fff", fontSize: 22 }}>Atšaukti</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { justifyContent: "center" }]}
              onPress={this.onFinish}
            >
              <Text style={{ color: "#fff", fontSize: 22 }}>Sukurti</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ModalPickLocation
          visible={this.state.modalPickLocation}
          data={this.state.markersData}
          closeModal={this.closePickModal}
          finish={this.pickedLocation}
        />
        <Spinner
          visible={this.state.spinner}
          textContent={"Kuriama. . ."}
          textStyle={{ color: "#fff" }}
          overlayColor="rgba(0, 0, 0, 0.5)"
        />
        </View>
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
