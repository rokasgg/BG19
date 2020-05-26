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
  TouchableOpacity,
  TextInput,
  Picker,
  FlatList
} from "react-native";
import { moderateScale } from "./ScaleElements";
import IconFeather from "react-native-vector-icons/Feather";
import ModalTimeFilter from "../components/modalStadiumsFilter";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";

export default class modalFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterPayToPlay: {
        color: "black",
        value: false,
        text: "Mokami stadionai"
      },
      data: [],
      item: false,
      item2: false,
      floorType: [
        {
          id: 0,
          type: "grass",
          text: "Naturali žolė",
          selected: false
        },
        {
          id: 1,
          type: "synthetic",
          text: "Sintetinė žolė",
          selected: false
        },
        {
          id: 2,
          type: "futsal",
          text: "Parketas",
          selected: false
        }
      ],
      stadiumType: [
        {
          id: 0,
          type: "indoor",
          text: "Vidus",
          selected: false
        },
        {
          id: 1,
          type: "outdoor",
          text: "Laukas",
          selected: false
        }
      ],
      priceType: [
        {
          id: 0,
          type: "paid",
          text: "Mokamas",
          selected: false
        },
        {
          id: 1,
          type: "free",
          text: "Nemokamas",
          selected: false
        }
      ],
      inventor: {
        id: 0,
        type: "inventor",
        selected: false
      },
      modalTimeFilter: false,
      chosenTime: null
    };
  }

  confirmFilters = () => {
    let floor = Array.from(this.state.floorType);
    let price = Array.from(this.state.priceType);
    let stadiumTypo = Array.from(this.state.stadiumType);
    let inventor = Object.assign(this.state.inventor);

    const selectedFloorType = floor.filter(item => item.selected === true);
    const selectedPriceType = price.filter(item => item.selected === true);
    const selectedStadiumType = stadiumTypo.filter(
      item => item.selected === true
    );
    let filterBy = selectedFloorType.concat(
      selectedPriceType,
      selectedStadiumType
    );

    if (inventor.selected === true) {
      filterBy.push(inventor);
      console.log("sdf", filterBy);
    }
    if (this.state.chosenTime !== null) {
      let data = {
        chosenTime: this.state.chosenTime,
        filterBy
      };
      this.props.onConfirm(data);
    } else {
      this.props.onConfirm(filterBy);
    }
    console.log(filterBy, "AR GAVOS KAZKAS PONAS ROKAI ?");
  };
  clearFilters = () => {
    const emptyArray = [];
    let floorTypeUpdate = Array.from(this.state.floorType);
    let stadiumTypeUpdate = Array.from(this.state.stadiumType);
    let stadiumPriceUpdate = Array.from(this.state.priceType);
    let inventorUpdate = Object.assign(this.state.inventor);

    let lengthFloor = floorTypeUpdate.length;
    let lengthStad = stadiumTypeUpdate.length;
    let lengthPrice = stadiumPriceUpdate.length;
    for (let i = 0; i < lengthFloor; i++) floorTypeUpdate[i].selected = false;
    for (let i = 0; i < lengthStad; i++) stadiumTypeUpdate[i].selected = false;
    for (let i = 0; i < lengthPrice; i++)
      stadiumPriceUpdate[i].selected = false;
    this.setState({ chosenTime: null }, () => {
      this.props.onConfirm(emptyArray);
    });
  };

  onFloorTypeClick = selectedItem => {
    let floorTypeUpdate = Array.from(this.state.floorType);
    let listLenght = floorTypeUpdate.length;
    let index = floorTypeUpdate.findIndex(item => item.id === selectedItem.id);
    for (let i = 0; i < listLenght; i++) {
      if (i === index) {
        floorTypeUpdate[i].selected = true;
      } else {
        floorTypeUpdate[i].selected = false;
      }
    }
    this.setState({ floorType: floorTypeUpdate });
  };

  onStadiumTypeClick = selectedItem => {
    let stadiumTypeUpdate = Array.from(this.state.stadiumType);
    let listLenght = stadiumTypeUpdate.length;
    let index = stadiumTypeUpdate.findIndex(
      item => item.id === selectedItem.id
    );
    let floorTypeUpdate = Array.from(this.state.floorType);
    for (let i = 0; i < floorTypeUpdate.length; i++) {
      floorTypeUpdate[i].selected = false;
    }
    for (let i = 0; i < listLenght; i++) {
      if (i === index) {
        stadiumTypeUpdate[i].selected = true;
      } else {
        stadiumTypeUpdate[i].selected = false;
      }
    }
    this.setState({
      stadiumType: stadiumTypeUpdate,
      floorType: floorTypeUpdate
    });
  };
  onStadiumPriceClick = selectedItem => {
    let stadiumPriceUpdate = Array.from(this.state.priceType);
    let listLenght = stadiumPriceUpdate.length;
    let index = stadiumPriceUpdate.findIndex(
      item => item.id === selectedItem.id
    );
    for (let i = 0; i < listLenght; i++) {
      if (i === index) {
        stadiumPriceUpdate[i].selected = true;
      } else {
        stadiumPriceUpdate[i].selected = false;
      }
    }
    this.setState({ priceType: stadiumPriceUpdate });
  };
  onInventorClick = () => {
    let inventorUpdate = Object.assign(this.state.inventor);
    if (inventorUpdate.selected === true) inventorUpdate.selected = false;
    else inventorUpdate.selected = true;
    this.setState({ inventor: inventorUpdate });
  };

  closeTimeFilter = () => {
    this.setState({ modalTimeFilter: false });
  };
  selectTime = () => {
    this.setState({ modalTimeFilter: true });
  };
  onConfirm = chosenTime => {
    this.setState({ modalTimeFilter: false, chosenTime });
  };

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        animationIn="slideInUp"
        onSwipeComplete={this.props.closeModal}
        backdropColor="black"
        backdropOpacity={0.3}
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15
        }}
        onBackdropPress={this.props.closeModal}
      >
        <View style={styles.modal}>
          <Text style={{ color: "black", fontSize: moderateScale(17) }}>
            Filtras
          </Text>
          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(235),
              flexDirection: "column",
              borderTopWidth: 1,
              borderColor: "hsl(186, 62%, 40%)"
            }}
          >
            <View
              style={{
                marginLeft: moderateScale(15),
                flex: 1,
                paddingTop: moderateScale(3),
                justifyContent: "flex-end",
                alignItems: "flex-end"
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: moderateScale(13),
                  paddingBottom: moderateScale(1),
                  fontWeight: "800"
                }}
              >
                Stadiono tipas
              </Text>
            </View>
            <View
              style={{
                flex: 2,
                justifyContent: "center",
                flexDirection: "row",
                width: moderateScale(240)
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: moderateScale(20)
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumTypeClick(this.state.stadiumType[0]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.stadiumType[0].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(13)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(11),
                      color: "black"
                    }}
                  >
                    {this.state.stadiumType[0].text}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: moderateScale(20)
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumTypeClick(this.state.stadiumType[1]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.stadiumType[1].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(13)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(11),
                      color: "black"
                    }}
                  >
                    {this.state.stadiumType[1].text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {this.state.stadiumType[0].selected === true ? (
            <View
              style={{
                flex: 2,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: moderateScale(235),
                flexDirection: "column",
                borderTopWidth: 1,
                borderColor: "hsl(186, 62%, 40%)"
              }}
            >
              <View
                style={{
                  marginLeft: moderateScale(15),
                  flex: 1,
                  marginBottom: moderateScale(5),
                  justifyContent: "flex-end",
                  alignItems: "flex-end"
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(13),
                    paddingBottom: moderateScale(1),
                    fontWeight: "800"
                  }}
                >
                  Dangos tipas
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: "center",
                  flexDirection: "column",
                  width: moderateScale(240)
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      paddingLeft: moderateScale(20)
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.onFloorTypeClick(this.state.floorType[2]);
                      }}
                      style={{ flexDirection: "row" }}
                    >
                      <IconFeather
                        name={
                          this.state.floorType[2].selected === true
                            ? "disc"
                            : "circle"
                        }
                        color="black"
                        size={moderateScale(13)}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: moderateScale(11),
                          color: "black"
                        }}
                      >
                        {this.state.floorType[2].text}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "flex-start",
                      paddingLeft: moderateScale(20)
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.onFloorTypeClick(this.state.floorType[1]);
                      }}
                      style={{ flexDirection: "row" }}
                    >
                      <IconFeather
                        name={
                          this.state.floorType[1].selected === true
                            ? "disc"
                            : "circle"
                        }
                        color="black"
                        size={moderateScale(12)}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: moderateScale(11),
                          color: "black"
                        }}
                      >
                        {this.state.floorType[1].text}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : this.state.stadiumType[1].selected === true ? (
            <View
              style={{
                flex: 2,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: moderateScale(235),
                flexDirection: "column",
                borderTopWidth: 1,
                borderColor: "hsl(186, 62%, 40%)"
              }}
            >
              <View
                style={{
                  marginLeft: moderateScale(15),
                  flex: 1,
                  marginBottom: moderateScale(5),
                  justifyContent: "flex-end",
                  alignItems: "flex-end"
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(13),
                    paddingBottom: moderateScale(1),
                    fontWeight: "800"
                  }}
                >
                  Dangos tipas
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: "center",
                  flexDirection: "column",
                  width: moderateScale(240)
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      paddingLeft: moderateScale(20)
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.onFloorTypeClick(this.state.floorType[0]);
                      }}
                      style={{ flexDirection: "row" }}
                    >
                      <IconFeather
                        name={
                          this.state.floorType[0].selected === true
                            ? "disc"
                            : "circle"
                        }
                        color="black"
                        size={moderateScale(12)}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: moderateScale(11),
                          color: "black"
                        }}
                      >
                        {this.state.floorType[0].text}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "flex-start",
                      paddingLeft: moderateScale(20)
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.onFloorTypeClick(this.state.floorType[1]);
                      }}
                      style={{ flexDirection: "row" }}
                    >
                      <IconFeather
                        name={
                          this.state.floorType[1].selected === true
                            ? "disc"
                            : "circle"
                        }
                        color="black"
                        size={moderateScale(12)}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: moderateScale(11),
                          color: "black"
                        }}
                      >
                        {this.state.floorType[1].text}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
          {/* <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onFloorTypeClick(this.state.floorType[2]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.floorType[2].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(13)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(10),
                      color: "black"
                    }}
                  >
                    {this.state.floorType[2].text}
                  </Text>
                </TouchableOpacity>
              </View> */}
          {/* --------------------------FLOORTYPE/\-------------------------------- */}

          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(235),
              flexDirection: "column",
              borderTopWidth: 1,
              borderColor: "hsl(186, 62%, 40%)"
            }}
          >
            <View
              style={{
                marginLeft: moderateScale(15),
                flex: 1,
                paddingTop: moderateScale(3),
                justifyContent: "flex-end",
                alignItems: "flex-end"
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: moderateScale(13),
                  paddingBottom: moderateScale(1),
                  fontWeight: "800"
                }}
              >
                Kaina
              </Text>
            </View>
            <View
              style={{
                flex: 2,
                justifyContent: "center",
                flexDirection: "row",
                width: moderateScale(240)
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: moderateScale(20)
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumPriceClick(this.state.priceType[0]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.priceType[0].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(13)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(11),
                      color: "black"
                    }}
                  >
                    {this.state.priceType[0].text}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  paddingLeft: moderateScale(20)
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumPriceClick(this.state.priceType[1]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.priceType[1].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(13)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(11),
                      color: "black"
                    }}
                  >
                    {this.state.priceType[1].text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* -----------------------------------------------------Inventoriu teikia \/ */}
          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(235),
              flexDirection: "column",
              borderTopWidth: 1,
              borderColor: "hsl(186, 62%, 40%)"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                width: moderateScale(240)
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(13),

                    marginLeft: moderateScale(15),
                    fontWeight: "800"
                  }}
                >
                  Suteikia invenorių
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity onPress={this.onInventorClick}>
                  <IconFontAwesome
                    name={
                      this.state.inventor.selected === true
                        ? "toggle-on"
                        : "toggle-off"
                    }
                    color="black"
                    size={moderateScale(19)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* -----------------------------------------------------Pagal laika \/ */}
          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(235),
              flexDirection: "column",
              borderTopWidth: 1,
              borderColor: "hsl(186, 62%, 40%)"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                width: moderateScale(240)
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(13),

                    marginLeft: moderateScale(15),
                    fontWeight: "800"
                  }}
                >
                  Ieškoti pagal laiką
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity onPress={this.selectTime}>
                  {this.state.chosenTime === null ? (
                    // <Ionicons
                    //   name="md-time"
                    //   color="black"
                    //   size={moderateScale(19)}
                    // />
                    <Text style={{ fontWeight: "500" }}>Pasirinkite</Text>
                  ) : (
                    <Text style={{ fontWeight: "500" }}>
                      {this.state.chosenTime.date},
                      {this.state.chosenTime.time.startTime}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ----------------------------------------------------------PRASIDEDA FILTRACIJOS MYGTUKAI  \/--- */}
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: moderateScale(250),
              borderColor: "hsl(186, 62%, 40%)",
              borderTopWidth: 1
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.clearFilters}
            >
              <Ionicons
                name="md-close"
                size={moderateScale(15)}
                color="hsl(126, 62%, 40%)"
              />
              <Text
                style={{
                  color: "hsl(126, 62%, 40%)",
                  fontSize: moderateScale(15),
                  fontWeight: "600"
                }}
              >
                Išvalyti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.confirmFilters}
            >
              <Ionicons
                name="md-checkmark"
                size={moderateScale(15)}
                color="hsl(126, 62%, 40%)"
              />
              <Text
                style={{
                  color: "hsl(126, 62%, 40%)",
                  fontSize: moderateScale(15),
                  fontWeight: "600"
                }}
              >
                Patvirtinti
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ModalTimeFilter
          closeModal={this.closeTimeFilter}
          visible={this.state.modalTimeFilter}
          onConfirm={this.onConfirm}
          clearFilter={this.clearFilter}
        />
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: moderateScale(310),
    width: moderateScale(270),
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
