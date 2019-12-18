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

export default class ModalChooseTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: [
        {
          type: "08-10",
          time: "8:00 - 10:00",
          startTime: "08:00",
          finishTime: "10:00",
          occupied: false
        },
        {
          type: "10-12",
          time: "10:00 - 12:00",
          startTime: "10:00",
          finishTime: "12:00",
          occupied: false
        },
        {
          type: "12-14",
          time: "12:00 - 14:00",
          startTime: "12:00",
          finishTime: "14:00",
          occupied: false
        },
        {
          type: "14-16",
          time: "14:00 - 16:00",
          startTime: "14:00",
          finishTime: "16:00",
          occupied: false
        },
        {
          type: "16-18",
          time: "16:00 - 18:00",
          startTime: "16:00",
          finishTime: "18:00",
          occupied: false
        },
        {
          type: "18-20",
          time: "18:00 - 20:00",
          startTime: "18:00",
          finishTime: "20:00",
          occupied: false
        },
        {
          type: "20-22",
          time: "20:00 - 22:00",
          startTime: "20:00",
          finishTime: "22:00",
          occupied: false
        }
      ]
    };
  }

  chooseTime = item => {
    let availableTimeList = Array.from(this.state.form);
    const numb = availableTimeList.length;
    for (let i = 0; i < numb; i++) {
      if (i === item.index) availableTimeList[i].chosenItem = true;
      else {
        availableTimeList[i].chosenItem = false;
      }
    }
    this.setState({ form: availableTimeList, selectedTime: item.item }, () =>
      this.props.finish(this.state.selectedTime)
    );
  };

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
            style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
          >
            <FlatList
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center"
              }}
              numColumns={2}
              horizontal={false}
              data={this.state.form}
              keyExtractor={(item, index) => index.toString()}
              renderItem={item => {
                if (item.item.occupied === true) {
                  return (
                    <TouchableOpacity
                      style={{
                        height: moderateScale(25),
                        width: moderateScale(90),
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                        borderColor: "black",
                        borderWidth: 2,
                        margin: 5
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: moderateScale(13)
                        }}
                      >
                        {item.item.time}
                      </Text>
                    </TouchableOpacity>
                  );
                } else {
                  return this.state.form[item.index].chosenItem === true ? (
                    <TouchableOpacity
                      onPress={() => this.chooseTime(item)}
                      style={{
                        height: moderateScale(20),
                        width: moderateScale(100),
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "hsl(126, 62%, 40%)",
                        borderColor: "hsl(126, 62%, 40%)",
                        borderWidth: 2,
                        margin: 3
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "500",
                          fontSize: moderateScale(13)
                        }}
                      >
                        {item.item.time}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.chooseTime(item)}
                      style={{
                        height: moderateScale(20),
                        width: moderateScale(100),
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                        borderColor: "black",
                        borderWidth: 2,
                        margin: 3
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: moderateScale(13)
                        }}
                      >
                        {item.item.time}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              }}
            />
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
    height: moderateScale(150),
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
