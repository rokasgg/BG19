import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  FlatList,
  TextInput,
  Picker,
  ActivityIndicator
} from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MCIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import Modal from "react-native-modalbox";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import gettingActiveRes from "../redux/actions/getActiveResAction";
import Spinner from "react-native-loading-spinner-overlay";
import ModalFilter from "../components/modalStadiumsFilter";
import { moderateScale } from "../components/ScaleElements";
import firebase from "firebase";
import "firebase/firestore";
import { getTodaysTime } from "../components/getTodaysTime";
import { getTodaysDate } from "../components/getTodaysDate";
import FlashMessage from "react-native-flash-message";
import { Dimensions } from "react-native";
import ModalReserve from "../components/modalReserve";

class WatchReservations extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      spinner: false,
      allReservations: [],
      refresh: false,
      allReservationsCopy: []
    };
  }
  componentDidMount() {
    this.getAllRserevations();
    console.log("adsadsadasdasd");
  }

  onRefreshing = () => {
    this.setState({ refresh: true }, () => this.getAllRserevations());
    setTimeout(() => {
      this.setState({ refresh: false });
    }, 2000);
  };
  getAllRserevations = async () => {
    let today = getTodaysDate();
    let nowTime = getTodaysTime();
    let resList = [];
    let stadiumId = "GbmJTmcQbyjt33bAvXR0"; //------------REIKIA ID GAUT IS PROPSU ! ! !
    await firebase
      .firestore()
      .collection("reservations")
      .where("stadiumId", "==", this.props.adminStadiumId)
      .where("date", ">=", today)
      .orderBy("date", "asc")
      .orderBy("reservationStart", "asc")
      .get()
      .then(res =>
        res.forEach(data => {
          console.log("gaunama data", data);
          let reservationInfo = {
            userId: data._document.proto.fields.userId.stringValue,
            reservationStart:
              data._document.proto.fields.reservationStart.stringValue,
            reservationFinish:
              data._document.proto.fields.reservationFinish.stringValue,
            date: data._document.proto.fields.date.stringValue,
            stadiumId: data.id,
            time: data._document.proto.fields.time.stringValue
          };

          if (reservationInfo.date === today) {
            if (reservationInfo.reservationStart > nowTime) {
              resList.push(reservationInfo);
              console.log(
                "reservationInfo",
                reservationInfo,
                reservationInfo.length
              );
            }
          } else {
            resList.push(reservationInfo);
          }
        })
      );

    await this.settingState(resList);
  };
  settingState = async data => {
    console.log("SETINAMAS", data);
    this.setState({
      allReservations: data,
      allReservationsCopy: data,
      spinner: false
    });
  };
  render() {
    const { navigate } = this.props.navigation;
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
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignSelf: "flex-start",
            height: moderateScale(30),
            width: moderateScale(100),
            alignItems: "center",
             paddingRight:moderateScale(30)
          }}
          onPress={() => this.props.navigation.goBack()}
        >
          <Ionicons
            name='md-arrow-back'
            size={moderateScale(20)}
            color='gray'
          />
        </TouchableOpacity>
        {/*style={[styles.tabStyle,this.state.chosenTab===3?{backgroundColor:'lightblue'}:null]}*/}
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            height: moderateScale(35),
            width: Dimensions.get("window").width
          }}
        >
          <View style={[styles.tabStyle]}>
            
            <Text style={[styles.chosenTabText,{fontSize:moderateScale(18)}]}> {this.props.adminstadiumName ? `${this.props.adminstadiumName}. Būsimos rezervacijos` : ""}</Text>
          </View>
        </View>

        <View
          style={{
            flex: 2,
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
              style={{ justifyContent: "flex-start", alignItems: "center" ,flexDirection:'row'}}
            >
              <MCIcons
                name="calendar"
                size={moderateScale(22)}
                color="hsl(126, 62%, 40%)"
                style={{ marginBottom: 3, marginLeft: 5 }}
              />
              <Text style={{ fontSize: moderateScale(17), color: "black" }}>
                Data
              </Text>
            </View>
            <View
              style={{ justifyContent: 'center', alignItems: "center",flexDirection:'row' }}
            >
              <MCIcons
                name="alarm"
                size={moderateScale(22)}
                color="hsl(126, 62%, 40%)"
                style={{ marginBottom: 3, marginLeft: 5 }}
              />
              <Text style={{ fontSize: moderateScale(17), color: "black" }}>
                Laikas
              </Text>
            </View>
            <View
              style={{ justifyContent: 'flex-end', alignItems: "center",flexDirection:'row' }}
            >
              <MCIcons
                name="account-outline"
                size={moderateScale(22)}
                color="hsl(126, 62%, 40%)"
                style={{ marginBottom: 3, marginLeft: 5 }}
              />
              <Text style={{ fontSize: moderateScale(17), color: "black" }}>
              Nuomininkas
              </Text>
            </View>
            
          </View>
          {this.state.spinner ? (
            <ActivityIndicator
              style={{
                marginTop: 10,
                flex: 1,
                justifyContent: "flex-start",
                alignSelf: "center"
              }}
              size="large"
              color="lightgrey"
            />
          ) : (
            <FlatList
              style={{ marginTop: 2, flex: 1 }}
              data={this.state.allReservations}
              renderItem={this.renderItems}
              keyExtractor={item => item.id}
              extraData={this.state.allReservations}
              onRefresh={() => this.onRefreshing()}
              refreshing={this.state.refresh}
              ListEmptyComponent={this.renderEmptyEventList}
            />
          )}
        </View>
        <FlashMessage ref="warnning" position="top" />
        {/* <Spinner
          visible={this.state.spinner}
          textContent="Vaziuojam"
          textStyle={{ color: "#fff" }}
          overlayColor="rgba(0,0,0,0.5)"
        /> */}
        {/* <ModalFilter
          closeModal={this.closeFilter}
          visible={this.state.modalFilter}
          onConfirm={this.onFiltering}
          clearFilter={this.clearFilter}
        />
        <ModalReserve
          closeModal={this.closeFilter}
          visible={this.state.modalReserve}
          data={this.state.reserveData}
          onConfirm={this.onReserve}
          clearFilter={this.clearFilter}
        /> */}
      </View>
    );
  }

  //-------------------------------------CREATING AN EVENT
  onReserve = data => {
    setTimeout(() => {
      this.setState({ spinner: false }, () => {
        this.props.navigation.goBack();
        this.props.navigation.push("Reservation", {
          data: data,
          success: true
        });
      });
    }, 5000);
    this.setState({ modalReserve: false });
  };

  openOnPressModal = info => {
    let data = {
      stadiumName: info.stadiumName,
      address: info.address,
      reservationStart: info.reservationStart,
      reservationDate: info.date,
      phone: info.phone,
      reservationFinish: info.reservationFinish,
      floorType: info.floorType,
      stadiumType: info.stadiumType,
      stadiumId: info.stadiumId,
      timeType: info.time
    };
    this.setState({ reserveData: data }, this.setState({ modalReserve: true }));
  };

  openFilter = () => {
    this.setState({ modalFilter: true });
  };
  closeFilter = () => {
    this.setState({ modalFilter: false, modalReserve: false });
  };
  onFiltering = data => {
    let searchDetails = {
      date: data.date.date,
      time: data.date.time,
      filteredStadiums: data.filteredStadiums
    };

    console.log("kokie duomenys cia?", searchDetails);
    // this.startSpinner();
    // this.getFreeStadiums(searchDetails);
  };


  renderItems = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity
        onPress={() => navigate("EventsDetails", { item1: item })}
      >
        <View
          style={{
            flexDirection: "row",
            width: moderateScale(330),
            flex: 1,
            height: moderateScale(45),
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
              flex: 2
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: moderateScale(14),
                fontWeight: "600"
              }}
            >
              {item.date}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: 'center',
              justifyContent: "center",
              flex: 2
            }}
          >
            
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {item.reservationStart} h
            </Text>
            
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flex: 3
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <MCIcons
                name="account-multiple-plus"
                size={moderateScale(22)}
                color="hsl(126, 62%, 40%)"
                style={{ marginLeft: 5 }}
              />
              <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              Tuomas
            </Text>
              
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderEmptyEventList = () => {
    return (
      <View
        style={[
          styles.container,
          {
            width: moderateScale(330),
            flex: 1,
            height: moderateScale(70)
          }
        ]}
      >
        <View style={styles.all}>
          <Ionicons
            name="md-information-circle-outline"
            size={moderateScale(30)}
            color="#555"
          />
          <Text style={{ fontSize: moderateScale(17), color: "lightgrey" }}>
            Stadionas rezervacijų neturi. . .
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
  modal4: {
    height: 400
  },
  all: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  tabStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  chosenTabText: {
    fontWeight: "600",
    color: "black",
    fontSize: moderateScale(15)
  },
  all: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  modalView1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 50
  },
  modalView2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: 50
  },

  text: {
    color: "black",
    fontSize: 22
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  }
});
const mapStateToProps = state => ({
  userId: state.auth.userUid,
  adminStadiumId: state.auth.stadiumId,
  adminstadiumName: state.auth.stadiumName
});
export default connect(mapStateToProps, { gettingActiveRes })(
  WatchReservations
);
