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

import Ionicons from "react-native-vector-icons/Ionicons";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";

export default class askPerm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        animationIn="slideInUp"
        onSwipeComplete={this.props.closeModal}
        hasBackdrop={true}
        backdropColor="black"
        backdropOpacity={0.7}
        backdropTransitionInTiming={2000}
        backdropTransitionOutTiming={2000}
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15
        }}
        onBackdropPress={this.props.closeModal}
      >
        <View style={styles.modal}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                color: "black",
                fontSize: moderateScale(13)
              }}
            >
              {this.props.message}
            </Text>
          </View>

          {/* --------------------------FLOORTYPE/\-------------------------------- */}

          {/* ----------------------------------------------------------PRASIDEDA FILTRACIJOS MYGTUKAI  \/--- */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: moderateScale(220),
              borderColor: "hsl(186, 62%, 40%)",
              borderTopWidth: 1
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.props.decline}
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
                {this.props.declineBtnText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  flexDirection: "row",
                  justifyContent: "space-around",
                  borderColor: "red"
                }
              ]}
              onPress={this.props.accept}
            >
              <Ionicons name="ios-trash" size={moderateScale(15)} color="red" />
              <Text
                style={{
                  color: "red",
                  fontSize: moderateScale(13),
                  fontWeight: "300"
                }}
              >
                {this.props.acceptBtnText}
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
    height: moderateScale(120),
    width: moderateScale(235),
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
