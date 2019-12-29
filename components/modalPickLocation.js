import React, { Component } from "react";
import Modal from "react-native-modal";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { moderateScale } from "./ScaleElements";
import "firebase/firestore";

export default class modalPickLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        longitude: 25.279652,
        latitude: 54.687157,
        longitudeDelta: 0.0421,
        latitudeDelta: 0.0922
      }
    };
  }
  finishPicking = () => {
    let coords = {
      latitude: this.state.coordinates.latitude,
      longitude: this.state.coordinates.longitude,
      longitudeDelta: 0.0421,
      latitudeDelta: 0.0922
    };
    this.props.finish(coords);
  };

  componentDidUpdate(prevProps, prevState) {
    console.log("lokacija", this.props.location, prevProps);
    if (this.props.location !== undefined)
      if (this.props.location !== prevProps.location) {
        this.setState({
          coordinates: {
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
            longitudeDelta: 0.0421,
            latitudeDelta: 0.0922
          }
        });
      } else {
        return false;
      }
    else return false;
  }
  componentDidMount() {
    if (this.props.location)
      this.setState({
        coordinates: {
          longitude: this.props.location.longitude,
          latitude: this.props.location.latitude,
          longitudeDelta: 0.0421,
          latitudeDelta: 0.0922
        }
      });
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
            height: moderateScale(300),
            width: moderateScale(280),
            borderRadius: 15
          }}
        >
          <MapView
            style={styles.map}
            initialRegion={{
              longitude: 25.279652,
              latitude: 54.687157,
              longitudeDelta: 0.0421,
              latitudeDelta: 0.0922
            }}
          >
            <Marker
              draggable
              coordinate={this.state.coordinates}
              onDragEnd={coor =>
                this.setState(
                  { coordinates: coor.nativeEvent.coordinate },
                  () => console.log("koordinates", this.state.coordinates)
                )
              }
            />
          </MapView>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPressIn={this.finishPicking}
              style={{
                borderWidth: 1,
                width: moderateScale(100),
                height: moderateScale(30),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
                marginBottom: moderateScale(15)
              }}
            >
              <Text style={{ fontSize: moderateScale(15) }}>Patvirtinti</Text>
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
    backgroundColor: "yellow",
    borderRadius: moderateScale(10)
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15
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
