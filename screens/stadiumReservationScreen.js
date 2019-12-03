import React, { Component } from "react";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  Platform,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList
} from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig
} from "react-native-calendars";
import { moderateScale } from "../components/ScaleElements";
import FlashMessage from "react-native-flash-message";
import firebase from "firebase";
import "firebase/firestore";

export default class stadiumReservationScreen extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: "",
      form: [
        {
          type: "8-10",
          time: "8:00 - 10:00",
          occupied: false
        },
        {
          type: "10-12",
          time: "10:00 - 12:00",
          occupied: false
        },
        {
          type: "12-14",
          time: "12:00 - 14:00",
          occupied: false
        },
        {
          type: "14-16",
          time: "14:00 - 16:00",
          occupied: false
        },
        {
          type: "16-18",
          time: "16:00 - 18:00",
          occupied: false
        },
        {
          type: "18-20",
          time: "18:00 - 20:00",
          occupied: false
        },
        {
          type: "20-22",
          time: "20:00 - 22:00",
          occupied: false
        }
      ],
      markersInfo: null,
      selectedTime: "",
      selectedDay: ""
    };
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
  componentDidMount() {
    this.currentDateInfo("2019-11-28");

    console.log("dsad", this.props.navigation.state.params);
    let data = this.props.navigation.state.params.data;
    console.log("whata kurva", data);
    this.setState({ markersInfo: data }, () =>
      console.log(this.state.markersInfo.adress)
    );
  }
  getTodaysDate() {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let year = today.getFullYear();
    let todayIs = `${year}-${month}-${day}`;
    console.log("Siandien yra", todayIs);
    return todayIs;
  }
  currentDateInfo = day => {
    const selectedDay = this.getTodaysDate();
    const selected = { [selectedDay]: { selected: true, marked: true } };
    this.setState(
      { selectedDays: selected, selectedDay, downloadingData: true },
      () => {
        console.log(this.state.selectedDays),
          this.resetItemValues(),
          this.getStadiumInfo(selectedDay);
      }
    );
  };
  dayPress = day => {
    const selectedDay = day.dateString;
    const selected = { [selectedDay]: { selected: true, marked: true } };
    this.setState(
      { selectedDays: selected, selectedDay, downloadingData: true },
      () => {
        console.log(this.state.selectedDays),
          this.resetItemValues(),
          this.getStadiumInfo(selectedDay);
      }
    );
  };
  itemHasChanged = (item1, item2) => {
    return item1 != item2;
  };
  onFinish = async () => {
    if (this.state.selectedTime !== "" && this.state.selectedDay !== "") {
      console.log(
        "NavBack",
        this.state.selectedTime,
        this.state.selectedDay,
        this.props.navigation.state.params.data
      );
      let data = {
        stadiumName: this.props.navigation.state.params.data.stadiumName,
        longitude: this.props.navigation.state.params.data.longitude,
        latitude: this.props.navigation.state.params.data.latitude,
        reservationTime: this.state.selectedTime.time,
        reservationDate: this.state.selectedDay,
        reservationId: ""
      };
      let saveToFirebase = {
        stadiumName: this.props.navigation.state.params.data.stadiumName,
        date: this.state.selectedDay,
        time: this.state.selectedTime.type,
        stadiumId: this.props.navigation.state.params.data.stadiumId
      };
      const resId = "";
      await firebase
        .firestore()
        .collection("reservations")
        .add(saveToFirebase)
        .then(res => {
          data.reservationId = res;
        })
        .catch(err => console.log("Jei neipraein reservacija>>", err));
      console.log("AR GAUNU AS CIA KNRS", data.reservationId);
      this.props.navigation.goBack();
      this.props.navigation.push("Reservation", { data: data });
    } else {
      this.refs.warnning.showMessage({
        message: "Prašome pasirinkti data ir laiką",
        type: "warning",
        duration: 10000,
        autoHide: true,
        hideOnPress: true
      });
    }
  };
  onCancel = () => {
    this.setState({}, () => this.props.navigation.goBack());
  };

  chooseTime = item => {
    let availableTimeList = Array.from(this.state.form);
    const numb = availableTimeList.length;
    for (let i = 0; i < numb; i++) {
      if (i === item.index) availableTimeList[i].chosenItem = true;
      else {
        availableTimeList[i].chosenItem = false;
      }
    }

    this.setState({ form: availableTimeList, selectedTime: item.item });
    // availableTimeList[item.index].chosenItem = true;
    console.log(
      "Pasirinktas laikas:",
      item,
      "Ar nukopijavo array",
      availableTimeList,
      availableTimeList.length
    );
  };

  getStadiumInfo = async date => {
    const data = this.props.navigation.state.params.data;
    let qwery = firebase
      .firestore()
      .collection("reservations")
      .where("date", "==", date)
      .where("stadiumId", "==", data.stadiumId);
    let availableTimeItems = Array.from(this.state.form);
    await qwery.get().then(res => {
      console.log("ISSAUNA BENT?", res);
      res.docs.length > 0
        ? res.forEach(data => {
            console.log("FIREBEIS", data._document.proto.fields);
            const index = availableTimeItems.findIndex(
              item => data._document.proto.fields.time.stringValue === item.type
            );
            console.log("BUUBSAI", availableTimeItems[index]);
            availableTimeItems[index].occupied = true;
          })
        : this.resetItemValues();
    });
    this.setState({ form: availableTimeItems, downloadingData: false }, () =>
      console.log(this.state.form, "NAUJASIAS CHECKAS")
    );
  };

  resetItemValues = () => {
    let allform = Array.from(this.state.form);
    for (let i = 0; i < 7; i++) {
      allform[i].occupied = false;
      allform[i].chosenItem = false;
      console.log("FALSE", allform);
    }
    this.setState({ form: allform });
  };

  render() {
    const data = this.props.navigation.state.params.data;
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      >
        <View style={styles.modal}>
          <Image
            style={{
              width: moderateScale(345),
              height: moderateScale(100),
              resizeMode: "contain",
              marginTop: 10,
              marginBottom: 10
            }}
            source={require("../pictures/pitch4.png")}
          />
          <View
            style={{
              flex: 1,
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
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Adresas:</Text>
              <Text style={styles.textRight}>{data.adress}</Text>
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
              <Text style={styles.textLeft}>Pavadinimas:</Text>
              <Text style={styles.textRight}>{data.stadiumName}</Text>
            </View>
            {data.phone !== "0" ? (
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
                <Text style={styles.textLeft}>Telefono numeris:</Text>
                <Text style={styles.textRight}>{data.phone}</Text>
              </View>
            ) : null}
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
              <Text style={styles.textLeft}>Dangos tipas:</Text>
              <Text style={styles.textRight}>
                {data.floorType === "synthetic" ? "Dirbtinė danga" : null}
              </Text>
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
              <Text style={styles.textLeft}>Stadiono tipas:</Text>
              <Text style={styles.textRight}>
                {data.stadiumType === "outdoor" ? "Lauko" : null}
              </Text>
            </View>
          </View>

          <View style={{ flex: 3, flexDirection: "column", marginBottom: 20 }}>
            <CalendarList
              onVisibleMonthsChange={months => {
                console.log("now these months are visible", months);
              }}
              pastScrollRange={3}
              // Max amount of months allowed to scroll to the future. Default = 50
              futureScrollRange={12}
              // Enable or disable scrolling of calendar list
              scrollEnabled={true}
              // Enable or disable vertical scroll indicator. Default = false
              showScrollIndicator={true}
              horizontal={true}
              // Enable paging on horizontal, default = false
              pagingEnabled={false}
              // Set custom calendarWidth.
              calendarWidth={400}
              calendarHeight={300}
              markingType={"custom"}
              markedDates={this.state.selectedDays}
              onDayPress={day => this.dayPress(day)}
              rowHasChanged={this.itemHasChanged}
              current={"2019-11-28"}
            />
          </View>
          <View style={{ flex: 2, flexDirection: "column", marginBottom: 10 }}>
            {this.state.downloadingData ? (
              <ActivityIndicator size="large" color="grey" />
            ) : (
              <FlatList
                contentContainerStyle={{ justifyContent: "flex-start" }}
                numColumns={3}
                horizontal={false}
                data={this.state.form}
                keyExtractor={(item, index) => index.toString()}
                renderItem={item => {
                  if (item.item.occupied === true) {
                    return (
                      <TouchableOpacity
                        style={{
                          height: moderateScale(37),
                          width: moderateScale(115),
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "white",
                          borderColor: "hsla(126, 62%, 40%, 0.44)",
                          borderWidth: 2,
                          margin: 3
                        }}
                      >
                        <Text
                          style={{
                            color: "hsla(126, 62%, 40%, 0.44)",
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
                          height: moderateScale(35),
                          width: moderateScale(115),
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
                          height: moderateScale(35),
                          width: moderateScale(115),
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "white",
                          borderColor: "hsl(126, 62%, 40%)",
                          borderWidth: 2,
                          margin: 3
                        }}
                      >
                        <Text
                          style={{
                            color: "hsl(126, 62%, 40%)",
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
            )}
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
              style={[styles.button, { borderColor: "red" }]}
              onPress={this.onCancel}
            >
              <Text
                style={{
                  color: "red",
                  fontSize: moderateScale(17)
                }}
              >
                Atšaukti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.onFinish}>
              <Text
                style={{
                  color: "hsl(186, 62%, 40%)",
                  fontSize: moderateScale(17)
                }}
              >
                Patvirtinti
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlashMessage ref="warnning" position="top" />
      </ScrollView>
    );
  }
}
// } <TouchableOpacity style={styles.button} onPress={this.confirmData}>
const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff"
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
    marginBottom: 100,
    textAlign: "left"
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
  button: {
    width: moderateScale(150),
    height: moderateScale(35),
    backgroundColor: "white",
    borderColor: "hsl(186, 62%, 40%)",
    borderWidth: 2,
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
