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
import IconFeather from 'react-native-vector-icons/Feather'

export default class modalStadiumDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
              <Text style={styles.text}>Adresas:</Text>
              <Text style={styles.text}>Stadiono pavadinimas:</Text>
              <Text style={styles.text}>Kokybė:</Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-end"
              }}
            >
              <Text style={styles.text}>{this.props.data.adress}</Text>
              <Text style={styles.text}>{this.props.data.stadiumName}</Text>
              <Text style={styles.text}>{this.props.data.rating}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.props.createEvent}
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
    height: moderateScale(230)
  },
  modalReserve: {
    height: 650
  },
  modalEvent: {
    height: 600
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
    fontSize: moderateScale(15),
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
