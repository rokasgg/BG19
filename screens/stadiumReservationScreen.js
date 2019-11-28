import React, { Component } from "react";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
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
  
  ScrollView,
  FlatList
} from "react-native";
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import {moderateScale} from '../components/ScaleElements';

import firebase from 'firebase';
import 'firebase/firestore';

export default class stadiumReservationScreen extends React.Component {
  static navigationOptions = { header: null }
  constructor(props){
    super(props)
    this.state={
      selectedDays:'',
      form:[
        {
          type:'8-10',
          time:'8:00 - 10:00',
          occupied:false
        },
        {
          type:'10-12',
          time:'10:00 - 12:00',
          occupied:false
        },
        {
          type:'12-14',
          time:'12:00 - 14:00',
          occupied:false
        },
        {
          type:'14-16',
          time:'14:00 - 16:00',
          occupied:false
        },
        {
          type:'16-18',
          time:'16:00 - 18:00',
          occupied:false
        },
        {
          type:'18-20',
          time:'18:00 - 20:00',
          occupied:false
        },
        {
          type:'20-22',
          time:'20:00 - 22:00',
          occupied:false
        }
      ],
      markersInfo:null,
      selectedTime:'',
      selectedDay:'',
      occupiedStadiums:[{time:'12-14'}], 
    }
  }
  
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
  componentDidMount  (){
    this.getStadiumInfo();
    console.log('dsad', this.props.navigation.state.params)
    let data = this.props.navigation.state.params.data
    console.log("whata kurva",data);
    this.setState({markersInfo:data}, ()=>console.log(this.state.markersInfo.adress))
  }

  dayPress= (day)=>{
    const selectedDay = day.dateString
    const selected = {[selectedDay]:{selected:true, marked:true}}
    this.setState({selectedDays:selected, selectedDay}, ()=>{console.log(this.state.selectedDays), this.getStadiumInfo(selectedDay)})
  }
  itemHasChanged = (item1, item2)=>{
    return item1 != item2;
  }
  onCancel = async()=>{
    console.log('NavBack', this.state.selectedTime, this.state.selectedDay,this.props.navigation.state.params.data )
    let data = {
      stadiumName:this.props.navigation.state.params.data.stadiumName,
      longitude:this.props.navigation.state.params.data.longitude,
      latitude:this.props.navigation.state.params.data.latitude,
      reservationTime:this.state.selectedTime.time,
      reservationDate:this.state.selectedDay
    }
    let saveToFirebase = {
      stadiumName:this.props.navigation.state.params.data.stadiumName,
      date:this.state.selectedDay,
      time:this.state.selectedTime.type,
      stadiumId:this.props.navigation.state.params.data.stadiumId,
    }
    firebase.firestore().collection('reservations').doc().set(saveToFirebase)
    this.props.navigation.goBack()
    this.props.navigation.push('Reservation', {data:data});
  }


  chooseTime =  (item) => {
    let availableTimeList = Array.from(this.state.form);
    const numb=availableTimeList.length
     for (let i = 0; i < numb; i++){
       if(i === item.index)
        availableTimeList[i].chosenItem = true;
      else{
        availableTimeList[i].chosenItem = false;
      }
    }

    this.setState({form:availableTimeList, selectedTime:item.item})
    // availableTimeList[item.index].chosenItem = true;
    console.log('Pasirinktas laikas:', item, 'Ar nukopijavo array', availableTimeList, availableTimeList.length);
  }

  getStadiumInfo = async (date) =>{
    let qwery = firebase.firestore().collection("reservations").where("date", "==", date)
    let allform = Array.from(this.state.form)
    await qwery.get().then(res=> {
  (res.docs.length > 0)? 

      res.forEach(data=>{
        let stadiumsData = {
          date:data._document.proto.fields.date.stringValue,
          stadiumId:data._document.proto.fields.stadiumId.stringValue,
          time:data._document.proto.fields.time.stringValue,
          userId:data._document.proto.fields.userId.stringValue,
          userName:data._document.proto.fields.userName.stringValue,
        }
        console.log("FIREBEIS",data._document.proto.fields.time.stringValue);
        switch(data._document.proto.fields.time.stringValue){
          case '8-10': 
            allform[0].occupied=true;
            console.log("case '8-10");
            break;
          case '10-12': 
            allform[1].occupied=true;
            console.log("case '10-12'");
            break;
          case '12-14': 
            allform[2].occupied=true;
            console.log("case '12-14'");
            break;
          case '14-16': 
            allform[3].occupied=true;
            console.log("case '14-16");
            break;
          case '16-18': 
            allform[4].occupied=true;
            console.log("case '16-18");
            break;
          case '18-20': 
            allform[5].occupied=true;
            console.log("case '18-20'");
            break;
          case '20-22': 
            allform[6].occupied=true;
            console.log("case '20-22'");
            break;
          default: 
            console.log("ISVIS VYKSTA SITAS DAITKAS?")
            break;
        }
    })
       :   
         this.setFalse()
      
      }
    )
    this.setState({form:allform}, ()=>console.log(this.state.form, "NAUJASIAS CHECKAS"))
  }
  
  setFalse = ()=>{
    let allform = Array.from(this.state.form)
    for(let i =0; i < 7; i++){
      allform[i].occupied=false;
      console.log("FALSE", allform);
    };
    this.setState({form:allform})
  }

  render() {
    const data = this.props.navigation.state.params.data;
    return (
      <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'space-between'}} >
        <View style={styles.modal}>
          <Image
            style={{ width: moderateScale(345), height:moderateScale(100), resizeMode:'contain',  marginTop:10, marginBottom:10 }}
            source={require("../pictures/pitch4.png")}
          />
          <View style={{ flex: 1, flexDirection: "column",
        justifyContent:'center', alignItems:'center' }}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                  <Text style={styles.textLeft}>Adresas:</Text>
                  <Text style={styles.textRight}>{data.adress}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340),borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                  <Text style={styles.textLeft}>Stadiono pavadinimas:</Text>
                  <Text style={styles.textRight}>{data.stadiumName}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:moderateScale(340), borderColor:'hsla(126, 62%, 40%, 0.44)', borderBottomWidth:1,}}>
                  <Text style={styles.textLeft}>Stadiono kokybė:</Text>
                  <Text style={styles.textRight}>{data.rating}</Text>
              </View>
          </View>
          
          <View style={{ flex: 3, flexDirection: 'column', marginBottom:20 }}>
            <CalendarList
              onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
              pastScrollRange={50}
              // Max amount of months allowed to scroll to the future. Default = 50
              futureScrollRange={50}
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
              markingType={'custom'}
              markedDates={this.state.selectedDays}
              onDayPress = {(day)=>this.dayPress(day)}
              rowHasChanged = {this.itemHasChanged}
              />
            </View>
            <View style={{ flex: 2, flexDirection: 'column',marginBottom:10 }}>
              <FlatList
                contentContainerStyle={{ justifyContent:'flex-start'}}
                numColumns={3}
                horizontal={false}
                data={this.state.form}
                keyExtractor={(item, index)=> index.toString()}
                renderItem ={(item)=>{
                  if(item.item.occupied === true){
                    return(
                      <TouchableOpacity style={{height:moderateScale(37), width:moderateScale(115),borderRadius:50 ,justifyContent:'center', alignItems:'center', backgroundColor:'white', borderColor:'hsla(126, 62%, 40%, 0.44)', borderWidth:2, margin:3}}>
                        <Text style={{color:'hsla(126, 62%, 40%, 0.44)', fontWeight:'500', fontSize:moderateScale(13)}}>  
                          {item.item.time}
                        </Text>
                      </TouchableOpacity>)}
                  else{
                    return(
                      this.state.form[item.index].chosenItem === true ?
                      <TouchableOpacity onPress={()=>this.chooseTime(item)} style={{height:moderateScale(35), width:moderateScale(115),borderRadius:50 ,justifyContent:'center', alignItems:'center', backgroundColor:'hsl(126, 62%, 40%)', borderColor:'hsl(126, 62%, 40%)', borderWidth:2, margin:3}}>
                        <Text style={{color:'white', fontWeight:'500',fontSize:moderateScale(13)}}>  
                          {item.item.time}
                        </Text>
                      </TouchableOpacity>:
                      <TouchableOpacity onPress={()=>this.chooseTime(item)} style={{height:moderateScale(35), width:moderateScale(115),borderRadius:50 ,justifyContent:'center', alignItems:'center', backgroundColor:'white', borderColor:'hsl(126, 62%, 40%)', borderWidth:2, margin:3}}>
                        <Text style={{color:'hsl(126, 62%, 40%)', fontWeight:'500',fontSize:moderateScale(13)}}>  
                          {item.item.time}
                        </Text>
                      </TouchableOpacity>)
                  }
              }
            }  
          />
                
          </View>

          <View
            style={{    
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <TouchableOpacity style={styles.button} onPress={this.onCancel}>
              <Text style={{ color: "hsl(186, 62%, 40%)", fontSize: moderateScale(17) }}>Patvirtinit</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>

    );
  }
}
// } <TouchableOpacity style={styles.button} onPress={this.confirmData}>
const styles = StyleSheet.create({
  modal: {
    justifyContent:'flex-start',
    alignItems: "center",
    backgroundColor:'#fff'
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
    textAlign:'left'
  },
  textLeft:{
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 5,
    marginTop:5,
    textAlign:'left',
    justifyContent:'flex-start', 
    alignItems:'center', 
    paddingLeft:5

  },
  textRight:{
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 5,
    marginTop:5,
    textAlign:'right',
    justifyContent:'flex-end', 
    paddingRight:5

  },
  button: {
    width: moderateScale(200),
    height: moderateScale(35),
    backgroundColor: "white",
    borderColor:'hsl(186, 62%, 40%)',
    borderWidth:2,
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

