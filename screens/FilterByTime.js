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

class FilterByTime extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      spinnerIndicator: false,
      spinner: false,
      stadiums: [],
      refresh: false,
      filterActive: false,
      modalFilter: false,
      modalReserve: false,
      reserveData: []
    };
  }

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
            <TouchableOpacity onPress={() => this.chooseTab(3)}>
              <Text style={[styles.chosenTabText]}>Aikštelių filtracija</Text>
            </TouchableOpacity>
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
              style={{ justifyContent: "flex-start", alignItems: "center" }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>
                Laisvi stadionai
              </Text>
            </View>
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                alignSelf: "flex-end",
                flexDirection: "row",
                width: moderateScale(100)
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "flex-start",
                  alignSelf: "flex-start"
                }}
                onPress={this.openFilter}
              >
                <Ionicons
                  name="md-time"
                  size={moderateScale(23)}
                  color="#FA7979"
                />
              </TouchableOpacity>
            </View>
          </View>
          {this.state.spinnerIndicator ? (
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
              data={this.state.stadiums}
              renderItem={this.renderItems}
              keyExtractor={item => item.id}
              extraData={this.state.stadiums}
              onRefresh={() => this.onRefreshing()}
              refreshing={this.state.refresh}
              ListEmptyComponent={this.renderEmptyEventList}
            />
          )}
        </View>
        <FlashMessage ref="warnning" position="top" />
        <Spinner
          visible={this.state.spinner}
          textContent="Vaziuojam"
          textStyle={{ color: "#fff" }}
          overlayColor="rgba(0,0,0,0.5)"
        />
        <ModalFilter
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
        />
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
    this.startSpinner();
    this.getFreeStadiums(searchDetails);
  };

  componentDidMount() {
    this.props.gettingActiveRes(this.props.userId);
    let data = this.props.navigation.getParam("data");
    console.log("Ka gaunam is filtro?", data);
    this.onFiltering(data);
  }
  startSpinner = () => {
    this.setState({ spinnerIndicator: true, modalFilter: false });
  };
  getFreeStadiums = async data => {
    let parameters = data;
    let filteredStadiums = data.filteredStadiums;
    this.startSpinner();
    let today = getTodaysDate();
    let nowTime = getTodaysTime();
    let stadiumsArray = [];

    filteredStadiums.forEach(stadium => {
      let details = {
        id: stadium.stadiumId,
        date: parameters.date,
        time: parameters.time.type,
        start: parameters.time.startTime,
        address: stadium.address,
        stadiumType: stadium.stadiumType,
        floorType: stadium.floorType,
        phone: stadium.phone,
        stadiumName: stadium.stadiumName,
        reservationStart: parameters.time.startTime,
        reservationFinish: parameters.time.finishTime,
        userId: this.props.userId,
        stadiumId: stadium.stadiumId,
        reservationConfirmTime: Date.now()
      };
      console.log("dsadas", details);
      stadiumsArray.push(details);
    });
    console.log("isfiltruotos rezervacijos", stadiumsArray);

    let allStadiums = await this.getStadiumsByDate(stadiumsArray);
    await this.stateSetting(allStadiums);
  };
  getStadiumsByDate = async stadiums => {
    let stadiumsCount = stadiums.length;
    let allStadiums = [];
    let stadiumIds = stadiums;
    for (let i = 0; i < stadiumsCount; i++) {
      await firebase
        .firestore()
        .collection("reservations")
        .where("stadiumId", "==", stadiums[i].id)
        .where("date", "==", stadiums[i].date)
        .where("reservationStart", "==", stadiums[i].reservationStart)
        .get()
        .then(res => {
          if (res.docs.length === 0) {
            allStadiums.push(stadiums[i]);
          }
        });
    }
    console.log(allStadiums, "gavom?");
    return allStadiums;
  };

  stateSetting = stadiums => {
    this.setState({ stadiums, spinnerIndicator: false }, () =>
      console.log("steitas", this.state.stadiums)
    );
  };

  onRefreshing = () => {
    this.setState(
      { refresh: true },
      () => this.getAllEvents(),
      this.getUsersEvents(),
      this.getUsersJoinedEvents()
    );
    setTimeout(() => {
      this.setState({ refresh: false });
    }, 2000);
  };

  //EVENT SETTER-------------------------------------

  renderItems = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity onPress={() => this.openOnPressModal(item)}>
        <View
          style={{
            flexDirection: "row",
            width: moderateScale(330),
            flex: 1,
            height: moderateScale(70),
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
            <Image
              style={{ width: 100, height: 60, resizeMode: "contain" }}
              source={require("../pictures/new.jpg")}
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
              {item.stadiumName}
            </Text>
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {item.address}
            </Text>
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {/* {item.stadiumName} */}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flex: 1
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
              //   onPress={() => navigate("EventsDetails", { item1: item })}
            >
              <Text style={{ fontSize: 17, color: "black" }}>
                {item.peopleNeed}
              </Text>
              <MCIcons
                name="account-multiple-plus"
                size={moderateScale(22)}
                color="hsl(126, 62%, 40%)"
                style={{ marginBottom: 3, marginLeft: 5 }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  renderUsersEvents = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity onPress={() => this.navigateToMyEventDetails(item)}>
        <View
          style={{
            flexDirection: "row",
            width: moderateScale(330),
            flex: 1,
            height: moderateScale(70),
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
            <Image
              style={{ width: 100, height: 60, resizeMode: "contain" }}
              source={require("../pictures/new.jpg")}
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
                fontWeight: "500"
              }}
            >
              {item.stadiumName}
            </Text>
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {item.address}
            </Text>
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {item.stadiumName}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              flex: 1
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => this.openModalEditEvent(item)}
            >
              <Ionicons
                name="ios-options"
                size={moderateScale(25)}
                color="orange"
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  navigateToMyEventDetails = data => {
    this.props.navigation.navigate("MyEventsDetails", { item1: data });
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
            Tokiu laiku nėra laisvų stadionų. . .
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


  text: {
    color: "black",
    fontSize: 22
  },

});
const mapStateToProps = state => ({
  userId: state.auth.userUid
});
export default connect(mapStateToProps, { gettingActiveRes })(FilterByTime);
