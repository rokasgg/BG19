import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator
} from "react-navigation";
// import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import { Image } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import Login from "../screens/Login";
import Main from "../screens/Main";
import Events from "../screens/Events";
import EventsDetails from "../screens/EventDetails";
import Reservation from "../screens/ReservationScreen";
import Reg from "../screens/RegistrationScreen";
import ReservationScreen from "../screens/stadiumReservationScreen";

import Ionicons from "react-native-vector-icons/Entypo";

const MainTab = createStackNavigator(
  {
    Main: Main,
    StadiumRes: ReservationScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "hsl(126, 62%, 40%)"
      },
      headerTintColor: "#fff",
      title: "SEARCH"
    }
  }
);

const EventsTab = createStackNavigator(
  {
    Events: Events,
    EventsDetails: { screen: EventsDetails }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "hsl(126, 62%, 40%)"
      },
      headerTintColor: "#fff",
      title: "EVENTS"
    }
  }
);

const LoginTab = createStackNavigator(
  {
    Login: Login
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "hsl(126, 62%, 40%)"
      },
      headerTintColor: "#fff",
      title: "PROFILE"
    }
  }
);

const ReservationTab = createStackNavigator(
  {
    Reservation: Reservation
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "hsl(126, 62%, 40%)"
      },
      headerTintColor: "#fff",
      title: "RESERVATION"
    }
  }
);

const Nav = createBottomTabNavigator(
  {
    Paieška: { screen: MainTab },
    Įvykiai: { screen: EventsTab },
    Rezervacija: { screen: ReservationTab },
    Profilis: { screen: LoginTab }

    // EventDet:{screen:EventDe}
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;

        if (routeName === "Paieška") {
          iconName = "map";
        } else if (routeName === "Profilis") {
          iconName = "man";
        } else if (routeName === "Įvykiai") {
          iconName = "archive";
        } else if (routeName === "Rezervacija") {
          iconName = "back-in-time";
        }

        console.log(iconName);
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      }
    }),

    tabBarOptions: {
      activeTintColor: "hsl(126, 62%, 40%)",
      inactiveTintColor: "gray",
      showIcon: true
    }
  }
);

const AuthStack = createStackNavigator({
  Loginn: LoginScreen,
  Registration: Reg
});

const App = createAppContainer(
  createSwitchNavigator(
    {
      //AuthLoading: AuthLoadingScreen,
      App: Nav,
      Auth: AuthStack
    },
    {
      initialRouteName: "Auth"
    }
  )
);
export default App;
