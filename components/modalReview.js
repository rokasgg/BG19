import React, { Component } from "react";
import Modal from "react-native-modal";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Picker,
  FlatList
} from "react-native";
import { moderateScale } from "./ScaleElements";
import IconFeather from "react-native-vector-icons/Feather";
import StarRating from "react-native-star-rating";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import FlashMessage from "react-native-flash-message";
import firebase from "firebase";
import "firebase/firestore";

export default class askPerm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      writeReview: false,
      readReview: false,
      chosen: false,
      starCount: 0,
      reviewInput: "",
      playerReviews: []
    };
  }
  onPressWriteReview = () => {
    this.setState({ readReview: false, writeReview: true, chosen: true });
  };
  onPressReadReview = () => {
    this.getUsersReviews();
    this.setState({ writeReview: false, readReview: true, chosen: true });
  };

  confirmReView = async () => {
    if (this.state.reviewInput !== "") {
      let userId = this.props.data.userId;
      let review = {
        comment: this.state.reviewInput,
        rating: this.state.starCount
      };
      await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("playersReviews")
        .add(review)
        .then(
          this.setState(
            {
              writeReview: false,
              chosen: false,
              reviewInput: "",
              starCount: 0
            },
            () => {
              this.refs.complete.showMessage({
                message: "Sėkmingai įvertinote žaidėją !",
                duration: 5000,
                autoHide: true,
                hideOnPress: true
              });
            }
          )
        );
    } else {
      this.refs.complete.showMessage({
        message: "Prašome pasirinkti įvertinima ir pakomentuoti!",
        duration: 5000,
        autoHide: true,
        hideOnPress: true
      });
    }
  };

  getUsersReviews = async () => {
    let userId = this.props.data.userId;
    let allReviews = [];
    await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("playersReviews")
      .get()
      .then(res => {
        res.forEach(snap => {
          console.log(snap, "boobs");
          let review = {
            comment: snap._document.proto.fields.comment.stringValue,
            rating: snap._document.proto.fields.rating.integerValue
          };
          console.log("reviu", review);
          allReviews.push(review);
        });
      });
    this.setState({ playerReviews: allReviews });
  };

  completelyClose = () => {
    this.setState(
      { writeReview: false, readReview: false, chosen: false },
      () => this.props.closeModal()
    );
  };
  goback = () => {
    this.setState({ writeReview: false, readReview: false, chosen: false });
  };

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        animationIn="slideInUp"
        onSwipeComplete={this.completelyClose}
        hasBackdrop={true}
        backdropColor="black"
        backdropOpacity={0.7}
        backdropTransitionInTiming={2000}
        backdropTransitionOutTiming={2000}
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15
        }}
        onBackdropPress={this.completelyClose}
      >
        {!this.state.chosen ? (
          <View style={[styles.modal]}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                width: moderateScale(220)
              }}
            >
              <TouchableOpacity
                style={[
                  {
                    flexDirection: "row",
                    justifyContent: "space-around",
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRightWidth: 1,
                    borderColor: "lightgray",
                    height: moderateScale(40)
                  }
                ]}
                onPress={this.onPressReadReview}
              >
                <Text
                  style={{
                    color: "gray",
                    fontSize: moderateScale(15),
                    fontWeight: "300"
                  }}
                >
                  {this.props.option1}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderColor: "red",
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "white",
                    borderLeftWidth: 1,
                    borderColor: "lightgray",
                    height: moderateScale(40)
                  }
                ]}
                onPress={this.onPressWriteReview}
              >
                <Text
                  style={{
                    color: "gray",
                    fontSize: moderateScale(15),
                    fontWeight: "300"
                  }}
                >
                  {this.props.option2}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {this.state.writeReview ? (
          <View style={[styles.modal, { height: moderateScale(135) }]}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                width: moderateScale(220),
                borderColor: "hsl(186, 62%, 40%)",
                borderTopWidth: 1
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  flex: 3,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.starCount}
                  selectedStar={rating => this.onStarRatingPress(rating)}
                />

                <TextInput
                  style={{
                    paddingRight: 15,
                    marginTop: moderateScale(5),
                    width: moderateScale(120),
                    height: moderateScale(30),
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: "lightgray",
                    borderRadius: 15
                  }}
                  value={this.state.reviewInput}
                  placeholder={"Komentaras"}
                  onChangeText={text => this.setState({ reviewInput: text })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      flexDirection: "row",
                      justifyContent: "space-around",
                      borderColor: "red"
                    }
                  ]}
                  onPress={this.confirmReView}
                >
                  <Ionicons
                    name="ios-trash"
                    size={moderateScale(15)}
                    color="red"
                  />
                  <Text
                    style={{
                      color: "red",
                      fontSize: moderateScale(13),
                      fontWeight: "300"
                    }}
                  >
                    {this.props.option2}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
        {this.state.readReview ? (
          <View style={[styles.modal, { height: moderateScale(200) }]}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                width: moderateScale(220),
                borderColor: "hsl(186, 62%, 40%)",
                borderTopWidth: 1
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "space-between"
                }}
              >
                <View>
                  <FlatList
                    renderItem={this.renderReviews}
                    data={this.state.playerReviews}
                    numColumns={1}
                    style={{ marginTop: 2, flex: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state.playerReviews}
                    // onRefresh={() => this.onRefreshing()}
                    // refreshing={this.state.refresh}
                    ListEmptyComponent={this.emptyReview}
                    style={{ margin: moderateScale(2) }}
                  />
                </View>
              </ScrollView>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderColor: "black",
                    marginBottom: moderateScale(10)
                  }
                ]}
                onPress={this.goback}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(13),
                    fontWeight: "300"
                  }}
                >
                  Grįžti
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <FlashMessage
          ref="complete"
          position="top"
          style={{ backgroundColor: "cyan" }}
        />
      </Modal>
    );
  }
  renderReviews = item => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: moderateScale(200),
          height: moderateScale(35)
        }}
      >
        <Text>{item.item.rating}</Text>
        <Text>{item.item.comment}</Text>
      </View>
    );
  };
  emptyReview = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: moderateScale(200),
          height: moderateScale(35)
        }}
      >
        <Text>Žaidėjas atsiliepimų neturi</Text>
      </View>
    );
  };
}
const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: moderateScale(80),
    width: moderateScale(235),
    flexDirection: "column",
    borderRadius: 15
  },
  text: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 10
  },
  button: {
    width: moderateScale(85),
    height: moderateScale(27),
    backgroundColor: "white",
    borderColor: "hsl(126, 62%, 40%)",
    borderWidth: 2,
    alignItems: "center",
    borderRadius: 5
  },
  buttonEdit: {
    backgroundColor: "orange",
    marginLeft: 10
  }
});
