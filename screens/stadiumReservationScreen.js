import React, { Component } from "react";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
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
import { connect } from "react-redux";
import gettingActiveRes from "../redux/actions/getActiveResAction";
import { moderateScale } from "../components/ScaleElements";
import FlashMessage from "react-native-flash-message";
import Spinner from "react-native-loading-spinner-overlay";
import firebase from "firebase";
import "firebase/firestore";
import { formateTime } from "../components/timeConverte";
import { getTodaysTime } from "../components/getTodaysTime";
import { getTodaysDate } from "../components/getTodaysDate";

class stadiumReservationScreen extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: "",
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
      ],
      markersInfo: null,
      selectedTime: "",
      selectedDay: "",
      spinner: false,
      resTimeCheck: false
    };
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
  componentDidMount() {
    this.currentDateInfo();
    this.props.gettingActiveRes(this.props.userId);
    let data = this.props.navigation.state.params.data;
    this.setState({ markersInfo: data }, () =>
      console.log(this.state.markersInfo.adress)
    );
  }

  currentDateInfo = day => {
    const selectedDay = getTodaysDate();
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
  checkIfDataExists = async () => {
    const data = this.props.navigation.state.params.data;
    let qwery = firebase
      .firestore()
      .collection("reservations")
      .where("stadiumId", "==", data.stadiumId)
      .where("time", "==", this.state.selectedTime.type)
      .where("date", "==", this.state.selectedDay);
    await qwery.get().then(res => {
      if (res.docs.length > 0) {
        console.log("YRA DATA");
      } else {
        console.log("BYBI! CONGRATS");
      }
    });
  };

  async getActiveRservationsNumb() {
    let today = getTodaysDate();
    let list = [];
    let qwery = firebase
      .firestore()
      .collection("reservations")
      .where("userId", "==", this.props.userId)
      .where("date", ">=", today)
      .orderBy("date", "asc");
    await qwery.get().then(res => {
      if (res.docs.length > 0) {
        var counteris = 0;
        res.forEach(data => {
          if (
            this.checkIfResActive({
              date: data._document.proto.fields.date.stringValue,
              time: data._document.proto.fields.time.stringValue
            })
          ) {
            list.push(data);
          }
        });
      }
    });
    this.setState({ activeReservationsNumber: list.length }, () => {
      console.log(this.state.activeReservationsNumber, list);
    });
  }
  checkIfResActive = item => {
    let today = getTodaysDate();
    let timeNow = getTodaysTime();
    let reservationDate = item.date;
    let reservationeTime = formateTime(item.time);
    console.log("asdsa", timeNow, reservationeTime);
    if (reservationDate > today) return true;
    else if (reservationDate === today) {
      if (timeNow < reservationeTime.finishTime) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  onFinish = async () => {
    let today = getTodaysDate();
    console.log(
      "Tikrinam ar pasirinkta data yra didesnė už šiandiene",
      this.state.selectedTime,
      this.state.selectedDay,
      today,
      this.props.activeResNumber,
      this.props.navigation.state.params.data
    );
    if (this.state.selectedTime !== "" && this.state.selectedDay !== "")
      if (this.state.selectedDay >= today)
        if (this.props.activeResNumber < 3) {
          this.startSpinner();
          const propsData = this.props.navigation.state.params.data;
          let data = {
            stadiumName: propsData.stadiumName,
            longitude: propsData.longitude,
            latitude: propsData.latitude,
            address: propsData.adress,
            reservationTime: this.state.selectedTime.time,
            reservationStart: this.state.selectedTime.startTime,
            reservationFinish: this.state.selectedTime.finishTime,
            reservationDate: this.state.selectedDay,
            stadiumId: propsData.stadiumId,
            reservationId: "",
            active: true,
            started: false
          };
          let saveToFirebase = {
            stadiumName: propsData.stadiumName,
            date: this.state.selectedDay,
            time: this.state.selectedTime.type,
            stadiumId: propsData.stadiumId,
            userId: this.props.userId,
            reservationStart: this.state.selectedTime.startTime,
            reservationFinish: this.state.selectedTime.finishTime,
            reservationConfirmTime: Date.now(),
            address: propsData.adress
          };

          let qwery = firebase
            .firestore()
            .collection("reservations")
            .where("stadiumId", "==", propsData.stadiumId)
            .where("time", "==", this.state.selectedTime.type)
            .where("date", "==", this.state.selectedDay);
          await qwery.get().then(res => {
            if (res.docs.length > 0) {
              this.setState({ spinner: false });
              this.refs.warnning.showMessage({
                message: "Norimas laikas rezervuoti jau užimtas!",
                type: "warning",
                duration: 10000,
                autoHide: true,
                hideOnPress: true
              });
            } else {
              firebase
                .firestore()
                .collection("reservations")
                .add(saveToFirebase)
                .then(res => {
                  data.reservationId = res.id;
                  this.checkIfDataExists();
                })
                .catch(err => console.log("Jei neipraein reservacija>>", err));
              this.finishSpinner(data);
            }
          });
        } else {
          this.refs.warnning.showMessage({
            message: "Viršijote galimų aktyvių rezervacijų limitą",
            type: "danger",
            duration: 10000,
            autoHide: true,
            hideOnPress: true
          });
        }
      else {
        this.refs.warnning.showMessage({
          message:
            "Kelionės laiku funkcija šiuo metu neveikia. Bus sutvarkyta 2020-01-21 23:59...",
          type: "danger",
          duration: 10000,
          autoHide: true,
          hideOnPress: true
        });
      }
    else {
      this.refs.warnning.showMessage({
        message: "Prašome pasirinkti data ir laiką",
        type: "danger",
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
    let currentTime = getTodaysTime();
    let today = getTodaysDate();
    const data = this.props.navigation.state.params.data;
    let qwery = firebase
      .firestore()
      .collection("reservations")
      .where("date", "==", date)
      .where("stadiumId", "==", data.stadiumId);
    let availableTimeItems = Array.from(this.state.form);
    await qwery.get().then(res => {
      console.log("ISSAUNA BENT?", currentTime, res);
      res.docs.length > 0
        ? res.forEach(data => {
            console.log("FIREBEIS", data._document.proto.fields);
            const index = availableTimeItems.findIndex(
              item => data._document.proto.fields.time.stringValue === item.type
            );
            console.log("BUUBSAI", availableTimeItems[index]);
            // if(today === data._document.proto.fields.date.stringValue) -----------------------------------------PATAISYT SU ATEINANCIU DIENU OKUPACIJA

            availableTimeItems[index].occupied = true;
          })
        : this.resetItemValues();
    });

    for (let i = 0; i < 7; i++) {
      if (today >= date)
        if (currentTime > availableTimeItems[i].startTime)
          availableTimeItems[i].occupied = true;
    }

    this.setState({ form: availableTimeItems, downloadingData: false }, () =>
      console.log(this.state.form, "NAUJASIAS CHECKAS", today, date,currentTime )
    );
  };

  resetItemValues = () => {
    let allform = Array.from(this.state.form);
    let currentTime = getTodaysTime();
    for (let i = 0; i < 7; i++) {
      if (currentTime < allform[i].startTime) allform[i].occupied = true;
      allform[i].occupied = false;
      allform[i].chosenItem = false;
      console.log("FALSE", allform);
    }
    this.setState({ form: allform });
  };

  startSpinner = () => {
    this.setState({ spinner: true });
  };
  finishSpinner = data => {
    setTimeout(() => {
      this.setState({ spinner: false }, () => {
        this.props.navigation.goBack();
        this.props.navigation.push("Reservation", {
          data: data,
          success: true
        });
      });
    }, 5000);
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
                {data.floorType === "synthetic" ? "Sintetinė žolė" : data.floorType === "grass" ? "Natūrali žolė":'Parketas'}
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
                {data.stadiumType === "outdoor" ? "Laukas" : data.stadiumType === "indoor" ? "Vidus":null}
              </Text>
            </View>
            {data.paid?  
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
              <Text style={styles.textLeft}>Kaina:</Text>
              <Text style={styles.textRight}>
                {`${data.price}€/h`}
              </Text>
            </View>:null}
          </View>

          <View style={{ flex: 3, flexDirection: "column", marginBottom: 20 }}>
            <CalendarList
              onVisibleMonthsChange={months => {
                console.log("now these months are visible", months);
              }}
              pastScrollRange={0}
              // Max amount of months allowed to scroll to the future. Default = 50
              futureScrollRange={3}
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
              current={getTodaysDate()}
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
        <Spinner
          visible={this.state.spinner}
          textContent={"Vykdoma..."}
          textStyle={{ color: "#fff" }}
        />
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
const mapStateToProps = state => ({
  userId: state.auth.userUid,
  activeResNumber: state.active.activeReservationNumber
});
export default connect(mapStateToProps, { gettingActiveRes })(
  stadiumReservationScreen
);
