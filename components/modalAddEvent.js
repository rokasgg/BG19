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

export default class modalReservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTime: null,
      peopleNeeded: 1,
      stadiumName: "",
      stadiumAddress: "",
      time: null,
      selectedStadium: null,
      defaultIndex: -1
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
      let index = this.state.dropDownOptions.findIndex(
        item => item === this.props.data.stadiumName
      );
      console.log("BOOBS", this.props.data);
      let stad = this.props.stadiums;

      this.setState({
        selectedStadium: index,
        stadiumName: stad[index].stadiumName,
        dateTime: this.props.data.reservationDate,
        time: this.props.data.reservationStart,
        stadiumAddress: this.props.data.address,
        defaultIndex: index
      });

      console.log("cozinam rerender", this.props.data, index);
    } else return false;
  }

  onCreateEvent = () => {
    let stadiums = this.props.stadiums;

    console.log(
      this.state.stadiumName,
      this.state.stadiumAddress,
      this.state.peopleNeeded,
      this.state.dateTime
    );
    let searchDetails = {
      stadiumName: stadiums[this.state.selectedStadium].stadiumName,
      address: stadiums[this.state.selectedStadium].address,
      peopleNeeded: this.state.peopleNeeded,
      eventDate: this.state.dateTime,
      eventStart: this.state.time,
      stadiumId: this.props.data.stadiumId
    };
    this.props.createEvent(searchDetails);
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

  selectStadium = val => {
    let stadiums = this.props.stadiums;
    let addressIndex = stadiums.findIndex(item => item.stadiumName === val);
    this.setState(
      {
        selectedStadium: val
        // stadiumAddress: stadiums[addressIndex].address
      },
      () => {
        console.log(stadiums, addressIndex, val);
      }
    );
  };

  componentDidMount() {
    if (this.props.data !== null) {
      console.log("GAVOME DATA I MODALA !!!!", this.props.data);
    } else console.log("BYBI NK NEGAUSI xD", this.props.data);
    this.getStadiumsOptions();
  }

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
            height: moderateScale(310),
            width: moderateScale(375),
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
            <Text style={styles.textLeft}>Naujas įvykis</Text>
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
                height: moderateScale(45),
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Stadionas:</Text>
              <View style={styles.textRight}>
                <ModalDropdown
                  options={this.state.dropDownOptions}
                  textStyle={{ fontSize: moderateScale(15) }}
                  dropdownTextStyle={{ fontSize: moderateScale(15) }}
                  defaultValue={
                    this.state.selectedStadium === -1
                      ? "Pasirinkite"
                      : this.state.stadiumName
                  }
                  defaultIndex={this.state.selectedStadium}
                  onSelect={this.selectStadium}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: moderateScale(45),
                width: moderateScale(340),
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
                width: moderateScale(340),
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
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Ieškomų žmonių skaičius:</Text>
              <NumberCounter
                finishCount={count => this.onCounterChange(count)}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "flex-start",
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
              onPress={this.onCreateEvent}
            >
              <Text style={{ color: "#fff", fontSize: 22 }}>Sukurti</Text>
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
