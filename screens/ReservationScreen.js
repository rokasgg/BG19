import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Button,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FlashMessage from "react-native-flash-message";
import { connect } from "react-redux";
import { moderateScale } from "../components/ScaleElements";
import ReservedDetails from "../components/ReservedDetails";
import ReservationList from "../components/reservationList";
import MCIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getTodaysTime } from "../components/getTodaysTime";
import { getTodaysDate } from "../components/getTodaysDate";
import { formateTime } from "../components/timeConverte";
import firebase, { firestore } from "firebase";
import "firebase/firestore";

class ReservationScreen extends React.Component {
  static navigationOptions = { header: null };

  state = {
    modalOn: false,
    long: 25.29470536,
    lat: 54.6685367,
    date: {
      stadiumName: "",
      reservationDate: "",
      reservationTime: ""
    },
    modalReservationVisible: false,
    allEvents: [],
    activeReservations: [],
    inactiveReservations: [],
    data: [],
    modalReservationVisiblee: false,
    checkSpinner: false,
    refresh: false,
    refresh2: false
  };
  render() {
    const { navigate } = this.props.navigation;

    const { dummyReducer = {} } = this.props;
    const { text = "" } = dummyReducer;
    console.log(text);
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5FCFF",
          flexDirection: "column"
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F5FCFF",
            flexDirection: "column"
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "stretch",
              marginLeft: 10,
              marginTop: 30,
              width: moderateScale(330)
            }}
          >
            <View
              style={{ justifyContent: "flex-start", alignItems: "center" }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>
                Aktyvios rezervacijos
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end", alignItems: "center", paddingRight:moderateScale(15) }}>
            <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 90,
                    width: moderateScale(30),
                    height: moderateScale(30),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#35a273"
                  }}
                >
                  <Text
                    style={{
                      fontSize: moderateScale(12),
                      color: "#fff",
                      fontWeight: "700"
                    }}
                  >
                    {this.state.activeReservations.length}/3
                  </Text>
                </View>
            </View>
          </View>
          {this.state.checkSpinner ? (
            <View style={{ marginTop: 2, flex: 1 }}>
              <ActivityIndicator size="large" color="green" />
            </View>
          ) : (
            <FlatList
              style={{ marginTop: 2, flex: 1 }}
              data={this.state.activeReservations}
              renderItem={this.renderItems}
              extraData={this.state.activeReservations}
              keyExtractor={item => item.id}
              onRefresh={() => this.onRefreshing()}
              refreshing={this.state.refresh}
              ListEmptyComponent={this.renderEmptyList}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F5FCFF",
            flexDirection: "column"
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "stretch",
              marginLeft: 10,
              marginTop: 30,
              width: moderateScale(330)
            }}
          >
            <View
              style={{ justifyContent: "flex-start", alignItems: "center" }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>
                Rezervacijų istorija
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => this.setState({ modalCreateEventVisible: true })}
              >
                {/* <Ionicons name="plus" size={25} color="#90c5df" /> */}
              </TouchableOpacity>
            </View>
          </View>
          {this.state.checkSpinner ? (
            <View style={{ marginTop: 2, flex: 1 }}>
              <ActivityIndicator size="large" color="green" />
            </View>
          ) : (
            <FlatList
              style={{ marginTop: 2, flex: 1 }}
              data={this.state.inactiveReservations}
              renderItem={this.renderItems}
              extraData={this.state.inactiveReservations}
              keyExtractor={item => item.id}
              onRefresh={() => this.onRefreshing()}
              refreshing={this.state.refresh}
              ListEmptyComponent={this.renderEmptyHistoryList}
            />
          )}
        </View>
        <FlashMessage ref="resSuccess" position="top" />
      </View>
    );
  }

  componentDidMount() {
    console.log("componentDidMount", reservationSuccess);
    let reservationSuccess = this.props.navigation.getParam("success");

    let propsFromReservation = this.props.navigation.getParam("data");

    if (reservationSuccess) {
      this.moreResDetails(propsFromReservation,true);
       this.getUserReservations()
    } else {
      this.startSpinner();
      this.getUserReservations();
    }
  }

  showWarn = () => {
    this.refs.resSuccess.showMessage({
      message: "Rezervacija atlikta sėkmingai!",
      type: "success",
      duration: 10000,
      autoHide: true,
      hideOnPress: true
    });
  };

  ifJustAdded = resId => {
    let reservationSuccess = this.props.navigation.getParam("success");
    let propsData = this.props.navigation.getParam("data");
    if (reservationSuccess) {
      if (resId === propsData.reservationId) return true;
      else return false;
    }
  };

  onRefreshing = () => {
    this.setState({ refresh: true }, () => {
      this.startSpinner(), this.getUserReservations();
    });
    setTimeout(() => {
      this.setState({ refresh: false });
    }, 2000);
  };

  startSpinner = () => {
    this.setState({ checkSpinner: true });
  };

  getUserReservations = async () => {
    console.log("BLABLABLA", this.props.userId, getTodaysDate());
    let activeReservations = [];
    let inactiveReservations = [];
    let yesterday = this.getYesterdaysDate();
    console.log("AR vyksta ?", yesterday, this.props.userId);
    await firebase
      .firestore()
      .collection("reservations")
      .where("userId", "==", this.props.userId)
      .where("date", ">=", yesterday)
      .orderBy("date", "asc")
      .orderBy("reservationStart", "asc")
      .get()
      .then(res => {
        console.log("res", res);
        if (res.docs.length > 0) {
          res.forEach(data => {
            const propsData = data._document.proto.fields;
            console.log("IESKOT ID RES", propsData);
            if (
              this.checkIfResActive({
                date: propsData.date.stringValue,
                time: propsData.time.stringValue,
                start: propsData.reservationStart.stringValue,
                finish: propsData.reservationFinish.stringValue
              })
            ) {
              let activeResDetails = {
                stadiumId: propsData.stadiumId.stringValue,
                stadiumName: propsData.stadiumName.stringValue,
                address: propsData.address.stringValue,
                reservationTime: propsData.time.stringValue,
                reservationStart: propsData.reservationStart.stringValue,
                reservationFinish: propsData.reservationFinish.stringValue,
                reservationDate: propsData.date.stringValue,
                userId: propsData.userId.stringValue,
                reservationId: data.id,
                active: true,
                started: this.checkIfResStarted({
                  start: propsData.reservationStart.stringValue,
                  date: propsData.date.stringValue
                })
              };
              activeReservations.push(activeResDetails);
              console.log("Active list", activeReservations);
            } else {
              let inactiveResDetails = {
                stadiumId: propsData.stadiumId.stringValue,
                stadiumName: propsData.stadiumName.stringValue,
                address: propsData.address.stringValue,
                reservationTime: propsData.time.stringValue,
                reservationStart: propsData.reservationStart.stringValue,
                reservationFinish: propsData.reservationFinish.stringValue,
                reservationDate: propsData.date.stringValue,
                userId: propsData.userId.stringValue,
                reservationId: data.id,
                active: false
              };
              inactiveReservations.push(inactiveResDetails);
              console.log("Inactive list", inactiveReservations);
            }
          });
        }
      });
    this.setState(
      {
        activeReservations,
        inactiveReservations,
        checkSpinner: false
      },
      () => console.log("Ar bv kazkas")
    );
  };
  checkIfResStarted = res => {
    let timeNow = getTodaysTime();
    let today = getTodaysDate();
    if (today === res.date)
      if (res.start < timeNow) {
        return true;
      } else return false;
    else return false;
  };

  checkIfResActive = item => {
    let today = getTodaysDate();
    let timeNow = getTodaysTime();
    let reservationDate = item.date;
    let reservationeTime = formateTime(item.time);
    console.log("asdsa", timeNow, reservationeTime);
    if (reservationDate > today) return true;
    else if (reservationDate === today) {
      if (timeNow < item.finish) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  getYesterdaysDate() {
    let today = new Date();
    let day = today.getDate() - 1;
    let month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let year = today.getFullYear();
    let todayIs = `${year}-${month}-${day}`;
    console.log("Siandien yra", todayIs);
    return todayIs;
  }

  moreResDetails = (item,success) => {
    this.props.navigation.navigate("ReservationDetails", {
      onGoBack: () => {
        this.getUserReservations();
      },
      data: item,
      reserved: success
    });
  };

  renderItems = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          width: moderateScale(330),
          flex: 1,
          height: moderateScale(80),
          marginTop: 20,
          borderRadius: 5,
          borderColor: "#90c5df",
          borderBottomWidth: 2,
          justifyContent: "space-evenly"
        }}
      >
        <View
          style={{
            borderColor: "#90c5df",
            justifyContent: "center",
            alignItems: "center",
            flex: 1
          }}
        >
          <MCIcons
            name={
              item.active
                ? item.started
                  ? "alarm-check"
                  : "alarm"
                : "alarm-off"
            }
            size={moderateScale(32)}
            color={item.active ? (item.started ? "#3cb371" : "#2F89E4") : "red"}
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 3
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: moderateScale(14),
              fontWeight: "600"
            }}
          >
            {item.reservationDate}
          </Text>
          <Text style={{ color: "black", fontSize: moderateScale(14) }}>
            Pradžia {item.reservationStart}
          </Text>
          <Text style={{ color: "black", fontSize: moderateScale(14) }}>
            {item.stadiumName}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flex: 1
          }}
          onPressIn={() => {
            this.moreResDetails(item,false);
          }}
        >
          <Ionicons name="ios-more" size={moderateScale(30)} color="#09549F" />
        </TouchableOpacity>
      </View>
    );
  };
  renderEmptyList = () => {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={[
          styles.container,
          {
            width: moderateScale(330),
            height: moderateScale(180)
          }
        ]}
      >
        <View style={styles.all}>
          <Ionicons
            name="md-information-circle-outline"
            size={45}
            color="#555"
          />
          <Text style={{ fontSize: 25, color: "lightgrey" }}>
            Nėra aktyvių rezervacijų
          </Text>
          <TouchableOpacity
            onPress={() => navigate("Main")}
            style={[styles.button1, { marginTop: moderateScale(15) }]}
          >
            <Text style={{ fontSize: moderateScale(17), color: "#fff" }}>
              Ieškoti aikštelės
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("Events")}
            style={[
              styles.button1,
              { backgroundColor: "lightgrey", marginTop: moderateScale(10) }
            ]}
          >
            <Text style={{ fontSize: moderateScale(17), color: "black" }}>
              Ieškoti žaidėjų
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  renderEmptyHistoryList = () => {
    return (
      <View
        style={[
          styles.container,
          {
            width: moderateScale(330),
            height: moderateScale(200)
          }
        ]}
      >
        <View style={styles.all}>
          <Ionicons
            name="md-information-circle-outline"
            size={45}
            color="#555"
          />
          <Text style={{ fontSize: 25, color: "lightgrey" }}>
            Nėra istorijos
          </Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  topHalf: {
    flex: 2,
    flexDirection: "column"
  },
  bottomHalf: {
    flex: 1,
    flexDirection: "column"
  },

  button1: {
    width: moderateScale(200),
    height: 40,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 5
  },
  text: {
    color: "black",
    fontSize: moderateScale(15)
  },
  all: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column"
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
  }
});
const mapStateToProps = state => ({
  userId: state.auth.userUid
});
export default connect(mapStateToProps)(ReservationScreen);
