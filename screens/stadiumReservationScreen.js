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

export default class stadiumReservationScreen extends React.Component {
  static navigationOptions = { header: null }
  constructor(props){
    super(props)
    this.state={
      selectedDays:'',
      form:[],
      markersInfo:null,
      selectedTime:'',
      selectedDay:''
    }
  }
  
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
  componentDidMount  (){
    
    console.log('dsad', this.props.navigation.state.params)
    this.fetchDateTime();
    let data = this.props.navigation.state.params.data
    console.log("whata kurva",data);
    this.setState({markersInfo:data}, ()=>console.log(this.state.markersInfo.adress))
  }

  dayPress= (day)=>{
    const selectedDay = day.dateString
    const selected = {[selectedDay]:{selected:true, marked:true}}
    this.setState({selectedDays:selected, selectedDay}, ()=>console.log(this.state.selectedDays))
  }
  itemHasChanged = (item1, item2)=>{
    return item1 != item2;
  }
  onCancel =()=>{
    console.log('NavBack', this.state.selectedTime, this.state.selectedDay,this.props.navigation.state.params.data )
    let data = {
      stadiumName:this.props.navigation.state.params.data.stadiumName,
      longitude:this.props.navigation.state.params.data.longitude,
      latitude:this.props.navigation.state.params.data.latitude,
      reservationTime:this.state.selectedTime,
      reservationDate:this.state.selectedDay
    }
    this.props.navigation.goBack()
    this.props.navigation.push('Reservation', {data:data});
  }
  
  fetchDateTime = () => {
    const configureDates = {
        form:[
          {
            type:'first',
            time:'8:00 - 10:00',
            occupied:false
          },
          {
            type:'second',
            time:'10:00 - 12:00',
            occupied:true
          },
          {
            type:'third',
            time:'12:00 - 14:00',
            occupied:true
          },
          {
            type:'fourth',
            time:'14:00 - 16:00',
            occupied:false
          },
          {
            type:'fifth',
            time:'16:00 - 18:00',
            occupied:true
          },
          {
            type:'sixth',
            time:'18:00 - 20:00',
            occupied:false
          },
          {
            type:'seventh',
            time:'20:00 - 22:00',
            occupied:true
          }
        ]
      
    }

    console.log(configureDates.form)
    this.setState({form:configureDates.form})
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

    this.setState({form:availableTimeList, selectedTime:item.item.time})
    // availableTimeList[item.index].chosenItem = true;
    console.log('Pasirinktas laikas:', item, 'Ar nukopijavo array', availableTimeList, availableTimeList.length);

  }

  render() {
    const data =this.props.navigation.state.params.data;
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

