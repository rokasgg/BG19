import React, { Component } from "react";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
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
import {moderateScale} from './ScaleElements';

export default class modalReservation extends React.Component {
  constructor(props){
    super(props)
    this.state={

    }
  }
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
  render() {
    return (
      <Modal
        hasBackdrop={true}
        backdropColor='black'
        backdropOpacity={0.8}
        animationInTiming={10000}
        animationOutTiming={10000}
        backdropTransitionInTiming={2000}
        backdropTransitionOutTiming={2000}
        visible={this.props.visible}
        onClosed={() => this.props.closeModal}
        style={{justifyContent:'flex-end', margin:0}}
      >
        <View style={styles.modal}>
          <Image
            style={{ width: moderateScale(345), height: moderateScale(200), flex:1 }}
            source={require("../pictures/pitch4.png")}
          />
          <View style={{ flex: 2, flexDirection: "row" }}>
            <View style={styles.modalView1}>
              <Text style={styles.text}>Adress:</Text>
              <Text style={styles.text}>Stadium:</Text>
              <Text style={styles.text}>Quality:</Text>
            </View>
            <View style={styles.modalView2}>
              <Text style={styles.text}>{this.props.data.adress}</Text>
              <Text style={styles.text}>
                {this.props.data.stadiumName}
              </Text>
              <Text style={styles.text}>{this.props.data.rating}</Text>
            </View>
          </View>
          
          <View style={{ flex: 2, flexDirection: "row" }}>
            <View style={styles.modalView1}>
              <Text style={styles.text}>Comment:</Text>
              <Text style={styles.text}>Reservation time:</Text>
              <Text style={styles.text}>Field space required:</Text>
              <Text style={styles.text}>Payment method:</Text>
            </View>
            <View style={styles.modalView2}>
              <TextInput
                placeholder={"Comment"}
                style={{
                  height: 40,
                  width: moderateScale(150),
                  borderBottomWidth: 1,
                  borderRadius: 5,
                  borderColor: 'grey',
                  marginBottom: 10
                }}
              />
              <TouchableOpacity
                onPress={this.showDateTimePicker}
                style={{
                  width: 300,
                  height: 40,
                  borderWidth: 0,
                  borderColor: "gray",
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: 5
                }}
              >
                <Text style={{ fontSize: 15, color: "black" }}>
                  {this.state.dateTime}
                </Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                mode={"datetime"}
                is24Hour={true}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
              />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Picker
                  selectedValue={this.state.stadiumSpaceValue}
                  style={{
                    height: 40,
                    width: moderateScale(150),
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomColor: "#c99284",
                    borderBottomWidth: 1
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ stadiumSpaceValue: itemValue })
                  }
                >
                  <Picker.Item
                    label="Full"
                    value="Full"
                    style={{ fontSize: moderateScale(15) }}
                  />
                  <Picker.Item
                    label="Half of field"
                    value="Half of field"
                    style={{ fontSize: moderateScale(15) }}
                  />
                  <Picker.Item
                    label="Quarter of field"
                    value="Quarter of field"
                    style={{ fontSize: moderateScale(15) }}
                  />
                </Picker>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Picker
                  selectedValue={this.state.paymentMethod}
                  style={{
                    height: 40,
                    width: moderateScale(150),
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomColor: "#c99284",
                    borderBottomWidth: 1
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ paymentMethod: itemValue })
                  }
                >
                  <Picker.Item
                    label="Pay by credit card"
                    value="Card"
                    style={{ fontSize: moderateScale(15) }}
                  />
                  <Picker.Item
                    label="Pay in cash"
                    value="Cash"
                    style={{ fontSize: moderateScale(15) }}
                  />
                </Picker>
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <TouchableOpacity style={styles.button} onPress={this.props.closeModal}>
              <Text style={{ color: "#fff", fontSize: moderateScale(17) }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
// } <TouchableOpacity style={styles.button} onPress={this.confirmData}>
const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'#f2f2f2',
    flex:1
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
    width: moderateScale(200),
    height: moderateScale(35),
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 5
  },
  buttonEdit: {
    backgroundColor: "orange",
    marginLeft: 10
  }
});

