import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Button
} from "react-native";

import { connect } from "react-redux";
import { moderateScale } from "../components/ScaleElements";
import firebase, { firestore } from "firebase";
import "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import MCIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ReservedDetails from "../components/ReservedDetails";
class reservationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allEvents: [],
      data: [],
      modalReservationVisiblee: false
    };
  }

  render() {
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
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "stretch",
            marginLeft: 10,
            marginTop: 30,
            width: moderateScale(330)
          }}
        >
          <View style={{ justifyContent: "flex-start", alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: "black" }}>
              Aktyvios rezervacijos
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

        <FlatList
          style={{ marginTop: 2, flex: 1 }}
          data={this.props.allEvents}
          renderItem={this.renderItems}
          keyExtractor={item => item.id}
        />
        {/* <ReservedDetails
            visible={this.state.modalReservationVisiblee}
            data={this.state.data}
            closeModal={this.reservationModalClose}
            createEvent={this.createEvent}
        /> */}
      </View>
    );
  }

  reservationModalClose = () => {
    this.setState({ modalReservationVisiblee: false });
  };
  moreResDetails = item => {
    // this.setState({modalReservationVisiblee:true,data:item})
    this.props.navigation.navigate("ReservationDetails", { data: item });
  };

  renderItems = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          width: moderateScale(330),
          flex: 1,
          height: 80,
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
            name="calendar-clock"
            size={moderateScale(32)}
            color="#55A6CE"
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
            {item.reservationTime}
          </Text>
          <Text style={{ color: "black", fontSize: moderateScale(14) }}>
            {item.stadiumId}
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
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPressIn={() => {
              this.props.moreResDetails(item);
            }}
          >
            <Ionicons name="ios-more" size={25} color="hsl(126, 62%, 40%)" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}
const mapStateToProps = state => ({
  userId: state.auth.userUid
});
export default connect(mapStateToProps)(reservationList);
