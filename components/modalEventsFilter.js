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
  Picker,
  FlatList
} from "react-native";
import { moderateScale } from "./ScaleElements";
import IconFeather from "react-native-vector-icons/Feather";
import DateTimePicker from "react-native-datepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import { getTodaysDate } from "../components/getTodaysDate";
export default class modalFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dateTime: ""
    };
  }

  confirmFilters = () => {
    let today = getTodaysDate();
    if (this.state.dateTime !== "")
      if (today <= this.state.dateTime)
        this.props.onConfirm(this.state.dateTime);
  };
  clearFilters = () => {
    this.setState({}, () => {
      this.props.clearFilter();
    });
  };

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        animationIn="slideInUp"
        onSwipeComplete={this.props.closeModal}
        backdropColor="black"
        backdropOpacity={0.3}
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15
        }}
        onBackdropPress={this.props.closeModal}
      >
        <View style={styles.modal}>
          <Text style={{ color: "black", fontSize: moderateScale(16) }}>
            Filtracija
          </Text>

          {/* --------------------------FLOORTYPE/\-------------------------------- */}
          {/* -----------------------------------------------------Inventoriu teikia \/ */}
          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(240),
              flexDirection: "column",
              borderTopWidth: 1,
              borderColor: "hsl(186, 62%, 40%)"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                width: moderateScale(240)
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(11),
                    borderBottomWidth: 1,
                    borderColor: "hsl(126, 62%, 40%)",
                    marginLeft: moderateScale(15)
                  }}
                >
                  Pagal data
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <DateTimePicker
                  // style={{
                  //   marginBottom: 5,
                  //   marginTop: 5,
                  //   justifyContent: "flex-end",
                  //   paddingRight: 5
                  // }}
                  customStyles={{
                    dateText: {
                      fontSize: moderateScale(13)
                    },
                    dateInput: {
                      alignItems: 'center',
                      borderWidth: 0,
                      paddingLeft: 4,
                      marginRight: 4,
                      flex: 1
                    },
                    dateIcon: { display: "none" }
                  }}
                  placeholder='Pasirinkite'
                  mode={"datetime"}
                  mode="date"
                  date={this.state.dateTime}
                  androidMode="spinner"
                  onDateChange={val => {
                    this.setState({ dateTime: val });
                  }}
                  confirmBtnText="Pick"
                  cancelBtnText="Cancel"
                />
              </View>
            </View>
          </View>
          {/* -----------------------------------------------------Pagal laika \/ */}

          {/* ----------------------------------------------------------PRASIDEDA FILTRACIJOS MYGTUKAI  \/--- */}
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: moderateScale(250),
              borderColor: "hsl(186, 62%, 40%)",
              borderTopWidth: 1
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.clearFilters}
            >
              <Ionicons
                name="md-close"
                size={moderateScale(15)}
                color="hsl(126, 62%, 40%)"
              />
              <Text
                style={{
                  color: "hsl(126, 62%, 40%)",
                  fontSize: moderateScale(13),
                  fontWeight: "300"
                }}
              >
                Išvalyti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.confirmFilters}
            >
              <Ionicons
                name="md-checkmark"
                size={moderateScale(15)}
                color="hsl(126, 62%, 40%)"
              />
              <Text
                style={{
                  color: "hsl(126, 62%, 40%)",
                  fontSize: moderateScale(13),
                  fontWeight: "300"
                }}
              >
                Patvirtinti
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: moderateScale(140),
    width: moderateScale(250),
    flexDirection: "column",
    borderRadius: 15
  },
  text: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 10
  },
  button: {
    width: moderateScale(85),
    height: moderateScale(27),
    backgroundColor: "white",
    borderColor: "hsl(126, 62%, 40%)",
    borderWidth: 2,
    alignItems: "center",
    borderRadius: 5
  },
  buttonEdit: {
    backgroundColor: "orange",
    marginLeft: 10
  }
});
