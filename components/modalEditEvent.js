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
import Ionicons from "react-native-vector-icons/Ionicons";

export default class modalEditEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTime: null,
      peopleNeeded: null,
      stadiumName: "",
      stadiumAddress: "",
      time: null,
      eventId: null
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
    if (prevProps.data !== this.props.data) {
      this.setState({
        stadiumName: this.props.data.stadiumName,
        dateTime: this.props.data.eventDate,
        time: this.props.data.eventStart,
        stadiumAddress: this.props.data.address,
        peopleNeeded: parseInt(this.props.data.peopleNeed),
        eventId: this.props.data.id
      });
      console.log("cozinam rerender", this.props.data);
    } else return false;
  }
  editEvent = () => {
    console.log(
      this.state.stadiumName,
      this.state.stadiumAddress,
      this.state.peopleNeeded,
      this.state.dateTime
    );
    let searchDetails = {
      stadiumName: this.state.stadiumName,
      stadiumAddress: this.state.stadiumAddress,
      peopleNeeded: this.state.peopleNeeded,
      eventDate: this.state.dateTime,
      eventStart: this.state.time,
      id: this.props.data.id
    };
    console.log(searchDetails);
    this.props.editEvent(searchDetails);
  };
  deleteEvent = () => {
    this.props.deleteEvent(this.props.data.id);
  };

  componentDidMount() {
    if (this.props.data !== null) {
      console.log("GAVOME DATA I MODALA !!!!", this.props.data);
    } else console.log("asd", this.props.data);
  }
  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        onBackdropPress={this.props.closeModal}
        onSwipeComplete={this.props.closeModal}
        hasBackdrop={true}
        backdropColor="black"
        backdropOpacity={0.4}
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            backgroundColor: "#f2f2f2",
            height: moderateScale(330),
            width: moderateScale(340),
            borderRadius: 15,
            justifyContent: "center"
          }}
        >
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
                height: moderateScale(45),
                width: moderateScale(305),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Pavadinimas:</Text>
              <TextInput
                placeholder={"Stadium Name"}
                style={styles.textRight}
                onChangeText={text => this.setState({ stadiumName: text })}
                value={this.state.stadiumName}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(45),
                width: moderateScale(305),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Adresas:</Text>
              <TextInput
                placeholder={"Adress"}
                style={styles.textRight}
                onChangeText={text => this.setState({ stadiumAddress: text })}
                value={this.state.stadiumAddress}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(45),
                width: moderateScale(305),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Data:</Text>
              <DateTimePicker
                style={{
                  marginBottom: 5,
                  marginTop: 5,
                  justifyContent: "flex-end",
                  paddingRight: 5
                }}
                customStyles={{
                  dateText: {
                    fontSize: moderateScale(13)
                  },
                  dateInput: {
                    alignItems: "flex-end",
                    borderWidth: 0,
                    paddingLeft: 4,
                    marginRight: 4,
                    flex: 1
                  },
                  dateIcon: { display: "none" }
                }}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(45),
                width: moderateScale(305),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Laikas:</Text>
              <DateTimePicker
                style={{
                  marginBottom: 5,
                  marginTop: 5,

                  justifyContent: "flex-end",
                  paddingRight: 5
                }}
                customStyles={{
                  dateText: {
                    fontSize: moderateScale(13)
                  },
                  dateInput: {
                    alignItems: "flex-end",
                    borderWidth: 0,
                    paddingLeft: 4,
                    marginRight: 4,
                    flex: 1
                  },
                  dateIcon: { display: "none" }
                }}
                mode={"time"}
                mode="time"
                date={this.state.time}
                androidMode="spinner"
                onDateChange={value => {
                  this.setState({ time: value });
                }}
                confirmBtnText="Pick"
                cancelBtnText="Cancel"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(305),
                height: moderateScale(45),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Ieškomų žmonių skaičius:</Text>
              <NumberCounter
                data={parseInt(this.state.peopleNeeded)}
                finishCount={count => this.onCounterChange(count)}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              alignContent: "center",
              alignSelf: "center",
              width: moderateScale(330)
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                {
                  flexDirection: "row",
                  justifyContent: "space-around",
                  backgroundColor: "red"
                }
              ]}
              onPress={this.deleteEvent}
            >
              <Icon name="times" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontSize: moderateScale(17) }}>
                Ištrinti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  flexDirection: "row",
                  justifyContent: "space-around",
                  backgroundColor: "orange"
                }
              ]}
              onPress={this.editEvent}
            >
              <Ionicons name="md-save" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontSize: moderateScale(17) }}>
                Redaguoti
              </Text>
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
