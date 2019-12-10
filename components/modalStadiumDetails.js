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
  Picker
} from "react-native";
import { moderateScale } from "./ScaleElements";
import Icon from "react-native-vector-icons/FontAwesome5";
import IconFeather from "react-native-vector-icons/Feather";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";

export default class modalStadiumDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // icons for details:
  // location-pin
  // phone
  // floor-plan  MaterialCommunityIcons
  // soccer-field
  //phone
  handleStadiumType = () => {
    switch (this.props.data.stadiumType) {
      case "indoor":
        return "Vidus";
      case "outdoor":
        return "Laukas";
      default:
        return null;
    }
  };

  handleFloorType = () => {
    switch (this.props.data.floorType) {
      case "synthetic":
        return "Dirbtinė danga";
      case "futsal":
        return "Salė";
      case "grass":
        return "Tikra žolė";
      default:
        return null;
    }
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onSwipeComplete={this.props.closeModal}
        backdropOpacity={0}
        backdropTransitionInTiming={2000}
        backdropTransitionOutTiming={2000}
        style={{ justifyContent: "flex-end", margin: 0 }}
        onBackdropPress={this.props.closeModal}
      >
        <View style={styles.modal}>
          <Image
            style={{
              width: moderateScale(345),
              height: moderateScale(75),
              resizeMode: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
            source={require("../pictures/pitch4.png")}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly",
              borderTopWidth: 2,
              borderColor: "hsl(186, 62%, 40%)",
              width: moderateScale(350),
              paddingTop: moderateScale(5)
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <IconMaterial
                  name="stadium"
                  size={moderateScale(19)}
                  color="hsl(186, 62%, 40%)"
                />
                <Text style={styles.text}>Pavadinimas:</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <IconMaterial
                  name="map-marker"
                  size={moderateScale(19)}
                  color="hsl(186, 62%, 40%)"
                />
                <Text style={styles.text}>Adresas:</Text>
              </View>
              {this.props.data.phone !== "0" ? (
                <View style={{ flexDirection: "row" }}>
                  <IconMaterial
                    name="phone"
                    size={moderateScale(19)}
                    color="hsl(186, 62%, 40%)"
                  />
                  <Text style={styles.text}>Telefono numeris:</Text>
                </View>
              ) : null}

              <View style={{ flexDirection: "row" }}>
                <IconMaterial
                  name="soccer-field"
                  size={moderateScale(19)}
                  color="hsl(186, 62%, 40%)"
                />
                <Text style={styles.text}>Stadiono tipas:</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <IconMaterial
                  name="floor-plan"
                  size={moderateScale(19)}
                  color="hsl(186, 62%, 40%)"
                />
                <Text style={styles.text}>Dangos tipas:</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-end"
              }}
            >
              <Text style={styles.text}>{this.props.data.stadiumName}</Text>
              <Text style={styles.text}>{this.props.data.adress}</Text>
              {this.props.data.phone !== "0" ? (
                <Text style={styles.text}>{this.props.data.phone} </Text>
              ) : null}
              <Text style={styles.text}>{this.handleStadiumType()}</Text>
              <Text style={styles.text}>{this.handleFloorType()}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: moderateScale(350)
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.props.navigation}
            >
              <IconFeather
                name="navigation"
                size={moderateScale(20)}
                color="hsl(126, 62%, 40%)"
              />
              <Text
                style={{
                  color: "hsl(126, 62%, 40%)",
                  fontSize: moderateScale(17),
                  fontWeight: "500"
                }}
              >
                Naviguoti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.props.createEvent}
            >
              <Icon
                name="calendar-alt"
                size={moderateScale(20)}
                color="hsl(126, 62%, 40%)"
              />
              <Text
                style={{
                  color: "hsl(126, 62%, 40%)",
                  fontSize: moderateScale(17),
                  fontWeight: "500"
                }}
              >
                Rezervuoti
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
    backgroundColor: "#f2f2f2",
    height: moderateScale(275)
  },

  modalView1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: moderateScale(25)
  },
  modalView2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: moderateScale(25)
  },

  text: {
    color: "black",
    fontSize: moderateScale(14),
    marginBottom: 10
  },
  button: {
    width: moderateScale(130),
    height: moderateScale(35),
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
