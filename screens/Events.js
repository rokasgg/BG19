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
import IconEntypo from "react-native-vector-icons/Entypo";
import MCIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import Modal from "react-native-modalbox";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import Spinner from "react-native-loading-spinner-overlay";
import ModalCreateEvent from "../components/modalAddEvent";
import ModalEditEvent from "../components/modalEditEvent";
import ModalFilter from "../components/modalEventsFilter";
import { moderateScale } from "../components/ScaleElements";
import firebase from "firebase";
import "firebase/firestore";
import { getTodaysTime } from "../components/getTodaysTime";
import { getTodaysDate } from "../components/getTodaysDate";
import FlashMessage from "react-native-flash-message";
import { Dimensions } from "react-native";

class Events extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      eventsDetails: null,
      isOpen2: false,
      activeEventsNumb: null,
      chosenTab: 1,
      eventsUserJoined: [],
      tab2clicked: false,
      tab3clicked: false,
      spinner1: true,
      spinner2: false,
      spinner3: false,
      modalFilter: false,
      allEventsCopy: [],
      filterActive: false,
      //Flatlist Data
      eventDetails: {
        stadiumName: "Name",
        eventDate: "TIME",
        stadiumRating: "10/50",
        stadiumImage: "dsa",
        peopleNeed: "10",
        id: "10",
        comment: "dsadad"
      },
      userEventsDetails: [],
      refresh: false,
      spinner: false,
      refreshTraining: false,
      refreshMySearch: false,
      usersEvents: [],
      //Flatlist DATA
      eventsArray: [],
      allEvents: [],
      ok: [],
      modalEditEventVis: false,
      //Modal values
      modalCreateEventVisible: false,
      isDisabled: false,
      swipeToClose: true,
      //DataPICKER VALUES
      isDateTimePickerVisible: false,
      dateTime: ["Set time"],
      //BlankVALUES
      peopleNumber: "",
      text1: "",
      text2: ""
    };
  }
  static navigationOption = {
    title: "Here you can see your events?"
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
            <TouchableOpacity onPress={() => this.chooseTab(1)}>
              <Text
                style={[
                  this.state.chosenTab === 1 ? styles.chosenTabText : null
                ]}
              >
                Žaidėjų paieškos
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.tabStyle,
              { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "grey" }
            ]}
          >
            <TouchableOpacity onPress={() => this.chooseTab(2)}>
              <Text
                style={[
                  this.state.chosenTab === 2 ? styles.chosenTabText : null
                ]}
              >
                Mano įvykiai
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.tabStyle]}>
            <TouchableOpacity onPress={() => this.chooseTab(3)}>
              <Text
                style={[
                  this.state.chosenTab === 3 ? styles.chosenTabText : null
                ]}
              >
                Treniruotės
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.chosenTab === 1 ? (
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
                  Žaidėjų paieškos
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
                  <FontAwesome5
                    name="filter"
                    size={moderateScale(20)}
                    color={this.state.filterActive ? "#FA7979" : "#90c5df"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.openModalCreateEvent}>
                  <FontAwesome5
                    name="plus"
                    size={moderateScale(21)}
                    color="#90c5df"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {this.state.spinner1 ? (
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
                data={this.state.allEvents}
                renderItem={this.renderItems}
                keyExtractor={item => item.id}
                extraData={this.state.allEvents}
                onRefresh={() => this.onRefreshing()}
                refreshing={this.state.refresh}
                ListEmptyComponent={this.renderEmptyEventList}
              />
            )}
          </View>
        ) : null}
        {this.state.chosenTab === 2 ? (
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
                  Mano įvykiai
                </Text>
              </View>
              <View
                style={{ justifyContent: "flex-end", alignItems: "center" }}
              ></View>
            </View>
            {this.state.spinner2 ? (
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
                data={this.state.usersEvents}
                renderItem={this.renderUsersEvents}
                keyExtractor={item => item.id}
                extraData={this.state.usersEvents}
                onRefresh={() => this.onRefreshingMyEvents()}
                refreshing={this.state.refreshMySearch}
                ListEmptyComponent={this.renderEmptyUserEventList}
              />
            )}
          </View>
        ) : null}
        {this.state.chosenTab === 3 ? (
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
                  Treniruotės
                </Text>
              </View>
              <View
                style={{ justifyContent: "flex-end", alignItems: "center" }}
              ></View>
            </View>
            {this.state.spinner3 ? (
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
                data={this.state.eventsUserJoined}
                renderItem={this.renderTrainingItems}
                keyExtractor={item => item.id}
                extraData={this.state.eventsUserJoined}
                onRefresh={() => this.onRefreshingTraining()}
                refreshing={this.state.refreshTraining}
                ListEmptyComponent={this.renderEmptyTrainingList}
              />
            )}
          </View>
        ) : null}
        <ModalCreateEvent
          visible={this.state.modalCreateEventVisible}
          data={this.state.eventsDetails}
          closeModal={this.closeModalCreateEvent}
          createEvent={this.createNewSearch}
          stadiums={this.props.stadiums}
        />
        <ModalEditEvent
          visible={this.state.modalEditEventVis}
          data={this.state.userEventsDetails}
          closeModal={this.closeModalCreateEvent}
          editEvent={this.editEvent}
          deleteEvent={this.deleteUsersEvent}
        />
        <FlashMessage ref="warnning" position="top" />
        <Spinner
          visible={this.state.spinner}
          textContent={this.state.spinnerText}
          textStyle={{ color: "#fff" }}
          overlayColor="rgba(0,0,0,0.5)"
        />
        <ModalFilter
          closeModal={this.closeFilter}
          visible={this.state.modalFilter}
          onConfirm={this.onFiltering}
          clearFilter={this.clearFilter}
        />
      </View>
    );
  }
  chooseTab = tab => {
    this.setState({
      chosenTab: tab,
      spinner1: true,
      spinner2: true,
      spinner3: true
    });
    switch (tab) {
      case 1:
        this.getAllEvents();
        break;
      case 2:
        this.getUsersEvents();

        break;
      case 3:
        this.getUsersJoinedEvents();
        break;
      default:
        break;
    }
  };

  //FILTER
  openFilter = () => {
    this.setState({ modalFilter: true });
  };
  closeFilter = () => {
    this.setState({
      modalFilter: false,
      allEvents: this.state.allEventsCopy,
      filterActive: false
    });
  };

  //CREATING AN EVENT-------------------------------------
  openModalCreateEvent = data => {
    if (data !== undefined)
      this.setState({ modalCreateEventVisible: true, eventsDetails: data });
    else this.setState({ modalCreateEventVisible: false });
  };
  openModalEditEvent = data => {
    if (data !== undefined)
      this.setState({ modalEditEventVis: true, userEventsDetails: data });
    else this.setState({ modalEditEventVis: false });
  };
  closeModalCreateEvent = () => {
    this.setState({
      modalCreateEventVisible: false,
      modalEditEventVis: false
    });
  };
  getUsersEvents = async () => {
    let eventList = [];
    let today = getTodaysDate();
    await firebase
      .firestore()
      .collection("events")
      .where("userId", "==", this.props.userId)
      .where("eventDate", ">=", today)
      .orderBy("eventDate", "asc")
      .get()
      .then(res =>
        res.forEach(data => {
          console.log("datapareina", data);
          let eventDetails = {
            stadiumName: data._document.proto.fields.stadiumName.stringValue,
            eventDate: data._document.proto.fields.eventDate.stringValue,
            eventStart: data._document.proto.fields.eventStart.stringValue,
            peopleNeed: data._document.proto.fields.peopleNeeded.integerValue,
            address: data._document.proto.fields.address.stringValue,
            creatorsId: data._document.proto.fields.userId.stringValue,
            id: data.id
          };
          eventList.push(eventDetails);
          console.log(eventList);
        })
      );
    this.setState({
      usersEvents: eventList,
      activeEventsNumb: eventList.length,
      spinner2: false
    });
  };

  clearFilter = () => {
    this.setState({
      filterActive: false,
      modalFilter: false,
      allEvents: this.state.allEventsCopy
    });
  };

  onFiltering = date => {
    let allEvents = Array.from(this.state.allEventsCopy);
    let filtered = allEvents.filter(item => item.eventDate === date);
    console.log("filtruojam", filtered, date);
    this.setState({
      modalFilter: false,
      allEvents: filtered,
      filterActive: true
    });
  };

  //-------------------------------------CREATING AN EVENT

  settingState = async data => {
    console.log("SETINAMAS", data);
    this.setState({ allEvents: data, allEventsCopy: data, spinner1: false });
  };
  settingJoinedEventsState = async data => {
    console.log("SETINAMAS", data);
    this.setState({ eventsUserJoined: data, spinner3: false });
  };
  getAllEvents = async () => {
    let today = getTodaysDate();
    let nowTime = getTodaysTime();
    let eventList = [];
    await firebase
      .firestore()
      .collection("events")
      .where("eventDate", ">=", today)
      .orderBy("eventDate", "asc")
      .orderBy("eventStart", "asc")
      .get()
      .then(res =>
        res.forEach(data => {
          let eventDetails = {
            stadiumName: data._document.proto.fields.stadiumName.stringValue,
            eventDate: data._document.proto.fields.eventDate.stringValue,
            eventStart: data._document.proto.fields.eventStart.stringValue,
            peopleNeed: data._document.proto.fields.peopleNeeded.integerValue,
            creatorsId: data._document.proto.fields.userId.stringValue,
            address: data._document.proto.fields.address.stringValue,
            id: data.id
          };

          if (eventDetails.eventDate === today) {
            if (eventDetails.eventStart > nowTime) {
              eventList.push(eventDetails);
              console.log("Eventas", eventList, eventList.length);
            }
          } else {
            eventList.push(eventDetails);
          }
        })
      );

    await this.settingState(eventList);
  };
  getUsersJoinedEvents = async () => {
    let today = getTodaysDate();
    let nowTime = getTodaysTime();
    let eventList = [];
    await firebase
      .firestore()
      .collection("users")
      .doc(this.props.userId)
      .collection("joinedEventsList")
      .where("eventDate", ">=", today)
      .orderBy("eventDate", "asc")
      .orderBy("eventStart", "asc")
      .get()
      .then(res =>
        res.forEach(data => {
          let eventDetails = {
            stadiumName: data._document.proto.fields.stadiumName.stringValue,
            eventDate: data._document.proto.fields.eventDate.stringValue,
            eventStart: data._document.proto.fields.eventStart.stringValue,
            peopleNeed: data._document.proto.fields.peopleNeeded.integerValue,
            approved: data._document.proto.fields.approved.booleanValue,
            address: data._document.proto.fields.address.stringValue,
            id: data.id
          };

          if (eventDetails.eventDate === today) {
            if (eventDetails.eventStart > nowTime) {
              eventList.push(eventDetails);
              console.log("JoinedEvents", eventList, eventList.length);
            }
          } else {
            eventList.push(eventDetails);
          }
        })
      );

    await this.settingJoinedEventsState(eventList);
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
  onRefreshingTraining = () => {
    this.setState({ refreshTraining: true }, () => this.getUsersJoinedEvents());
    setTimeout(() => {
      this.setState({ refreshTraining: false });
    }, 2000);
  };
  onRefreshingMyEvents = () => {
    this.setState({ refreshMySearch: true }, () => this.getUsersJoinedEvents());
    setTimeout(() => {
      this.setState({ refreshMySearch: false });
    }, 2000);
  };

  componentDidUpdate(prevProps) {
    let dataFromProps = this.props.navigation.getParam("reservationData");
    let propsData = this.props.navigation.getParam("dateTime");
    let prevPropsData = prevProps.navigation.getParam("dateTime");
    let thisId = this.props.navigation.getParam("resId");
    let prevId = prevProps.navigation.getParam("resId");
    console.log("Prev,", prevPropsData, prevId, "this", propsData, thisId);
    if (prevPropsData !== propsData || thisId !== prevId) {
      console.log("(. )( .)", dataFromProps);
      this.openModalCreateEvent(dataFromProps);
    }
  }
  componentDidMount() {
    // this.getUsersEvents();

    this.getActiveEventsNumb();
    // this.getUsersJoinedEvents();
    let propsSuccess = this.props.navigation.getParam("success");
    let dataFromProps = this.props.navigation.getParam("reservationData");
    if (propsSuccess) {
      console.log("(. )( .)", propsSuccess);
      this.openModalCreateEvent(dataFromProps);
    }
    this.getAllEvents();
  }

  //EVENT SETTER-------------------------------------
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
              {item.eventDate}
            </Text>
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {item.eventStart}
            </Text>
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {item.stadiumName}
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
              onPress={() => navigate("EventsDetails", { item1: item })}
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
                fontWeight: "600"
              }}
            >
              {item.eventDate}
            </Text>
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {item.eventStart}
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
  renderTrainingItems = ({ item }) => {
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
              flex: 2,
              flexDirection: "column"
            }}
          >
            {item.approved ? (
              <IconEntypo
                size={moderateScale(40)}
                name="flash"
                color="lightgreen"
              />
            ) : (
              <IconEntypo
                size={moderateScale(40)}
                name="hour-glass"
                color="orange"
              />
            )}
            <Text>{item.approved ? "Patvirtinta" : "Nepatvirtinta"}</Text>
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
              {item.eventDate}
            </Text>
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {item.eventStart}
            </Text>
            <Text style={{ color: "black", fontSize: moderateScale(14) }}>
              {item.stadiumName}
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
              onPress={() => navigate("EventsDetails", { item1: item })}
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
            Šiuo metu nėra aktyvių paieškų. . .
          </Text>
        </View>
      </View>
    );
  };
  renderEmptyUserEventList = () => {
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
            Neturite aktyvių paieškų. . .
          </Text>
        </View>
      </View>
    );
  };
  renderEmptyTrainingList = () => {
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
            Nesate prisijungęs prie treniruočių. . .
          </Text>
        </View>
      </View>
    );
  };
  //-------------------------------------EVENT SETTER

  deleteUsersEvent = async docId => {
    this.startSpinner("Trinama paieška...");
    console.log("ID?", docId);
    await firebase
      .firestore()
      .collection("events")
      .doc(docId)
      .delete();
    setTimeout(() => {
      this.setState({ spinner: false }, () => {
        this.getUsersEvents();
        this.refs.warnning.showMessage({
          message: "Jūsų paieška sėkmingai ištrinta!",
          type: "success",
          duration: 7000,
          autoHide: true,
          hideOnPress: true
        });
      });
    }, 5000);
  };

  editEvent = async data => {
    this.startSpinner("Redaguojama paieška...");
    let searchData = {
      eventStart: data.eventStart,
      eventDate: data.eventDate,
      peopleNeeded: data.peopleNeeded,
      stadiumName: data.stadiumName,
      userId: this.props.userId
    };
    console.log("PATAISYTA DATA. ", searchData);
    await firebase
      .firestore()
      .collection("events")
      .doc(data.id)
      .update(searchData);
    setTimeout(() => {
      this.setState({ spinner: false }, () => {
        this.getUsersEvents();
        this.refs.warnning.showMessage({
          message: "Jūsų paieška sėkmingai redaguota!",
          type: "success",
          duration: 7000,
          autoHide: true,
          hideOnPress: true
        });
      });
    }, 5000);
  };
  createNewSearch = async data => {
    this.startSpinner("Kuriama paieška...");
    console.log("KOKIE CIA DUOMENYS?", data);
    // -------------------------------_-----------------------------------------------------------------TIKRINAM DABAR KAS CIA PER DUOMENYS ATEINA NES IS PROPSU UNDEFINED DBR GI...

    let searchData = {
      eventStart: data.eventStart,
      eventDate: data.eventDate,
      peopleNeeded: data.peopleNeeded,
      stadiumName: data.stadiumName,
      address: data.address,
      userId: this.props.userId
    };
    console.log(
      "Ar parein tvarkinga data?",
      searchData,
      this.state.activeEventsNumb
    );
    if (this.state.activeEventsNumb < 3) {
      await firebase
        .firestore()
        .collection("events")
        .add(searchData)
        .then(res => {
          searchData.eventId = res.id;
        });
      setTimeout(() => {
        this.setState({ spinner: false }, () => {
          this.getUsersEvents();
          this.getAllEvents();
          this.refs.warnning.showMessage({
            message: "Sėkmingai pridėta paieška!",
            type: "success",
            duration: 10000,
            autoHide: true,
            hideOnPress: true
          });
        });
      }, 5000);
    } else {
      this.setState({ spinner: false });
      this.refs.warnning.showMessage({
        message: "Viršijote leistiną aktyvių paieškų limitą",
        type: "danger",
        duration: 10000,
        autoHide: true,
        hideOnPress: true
      });
    }
  };
  startSpinner = text => {
    this.setState({
      spinnerText: text,
      spinner: true,
      modalCreateEventVisible: false,
      modalEditEventVis: false
    });
  };
  async getActiveEventsNumb() {
    let today = getTodaysDate();
    let list = [];
    let qwery = firebase
      .firestore()
      .collection("events")
      .where("userId", "==", this.props.userId)
      .where("eventDate", ">=", today)
      .orderBy("eventDate", "asc");
    await qwery.get().then(res => {
      console.log("AR VYKST KAZKS", res);
      if (res.docs.length > 0) {
        var counteris = 0;
        res.forEach(data => {
          if (
            this.checkIfResActive({
              start: data._document.proto.fields.eventStart.stringValue,
              date: data._document.proto.fields.eventDate.stringValue
            })
          ) {
            list.push(data);
          }
        });
      }
    });
    this.setState({ activeEventsNumb: list.length }, () => {
      console.log("Aktyvios paieškos!:", this.state.activeEventsNumb, list);
    });
  }
  amIbanned = () => {
    let today = getTodaysDate();
    let nowTime = getTodaysTime();
    firebase
      .firestore()
      .collection("bannedUsers")
      .where("userId", "==", this.props.userId)
      .where("banDate", ">=", today)
      .orderBy("banDate")
      .get()
      .then(res => {
        let banDate = res.docs[0]._document.proto.fields.banDate.stringValue;
        let banTime = res.docs[0]._document.proto.fields.banTime.stringValue;
        if (nowTime <= banTime) {
          this.setState({ banned: true, banTime, banDate });
        }
      });
  };

  checkIfResActive = item => {
    let today = getTodaysDate();
    let timeNow = getTodaysTime();
    console.log("asdsa", timeNow, item.date);
    if (item.date > today) return true;
    else if (item.date === today) {
      if (timeNow < item.start) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
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
  stadiums: state.stadiums.stadiumsList
});
export default connect(mapStateToProps)(Events);
