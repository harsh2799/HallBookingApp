import {React, useState} from 'react'
import Cookies from 'js-cookie';
import axios from 'axios'

const SelectedRoom = ({updateRoomData, updateSearchData, index, number, features, bookings, capacity}) => {
    function getFormattedDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
        const day = String(today.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
    }
    
    const [selectedDate, updateDate] = useState(getFormattedDate())
    const [selectedSlot, updateSlot] = useState(-1)

    const changeDate = (e) => {
        updateDate(e.target.value);
    }
    const bookRoom = () => {
        console.log(Cookies.get("access-token"))
        if (selectedSlot == -1) {
            alert("Kindly Select a Slot")
        }
        else {
            axios({
                method: 'post', //you can set what request you want to be
                url: 'http://localhost:8000/bookRoom',
                data: {
                    date: selectedDate,
                    roomNumber: number,
                    slot: selectedSlot
                },
                headers: {
                  Authorization: Cookies.get("access_token")
                }
              }).then((response) => {
                updateRoomData(response.data)
                updateSearchData(response.data)
              }, (error) => {
                alert("Session Expired");
                window.location.reload();
              })
        }
    }

    const changeSlot = (id) => {
        console.log(id)
        updateSlot(id)
    }



   const timeSlots = ["10:00 - 10:30", "10:30 - 11:00", "11:00 - 11:30", "11:30 - 12:00",
                       "12:00 - 12:30", "12:30 - 13:00", "13:00 - 13:30", "13:30 - 14:00",
                       "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00",
                       "16:00 - 16:30", "16:30 - 17:00", "17:00 - 17:30", "17:30 - 18:00",
                       "18:00 - 18:30", "18:30 - 19:00"]
   return (
    <div className='card' id={index}>
        <h2>Room: {number}</h2>
        <input type='date' id="date" min={getFormattedDate()} onChange={changeDate} value={selectedDate}/>
        <hr />
        <div className='feature-list'>
            {features.map((feature, index) => {
                return <span key={index} className='feature'>{feature}</span>
            })}
        </div>
        <h3>Capacity: {capacity}</h3>
        <button onClick={bookRoom}>Book</button>
        <div className='slot-container'> 
            {
                timeSlots.map((slot, i) => {
                    return <span onClick={(e) => { e.target.style.border = "1px solid black"; changeSlot(i)}}
                     id={i} key={i} className={"slot " +  (selectedDate && bookings[selectedDate]  && bookings[selectedDate][i] ? "slot-booked " : "slot-available ") + (selectedDate && bookings[selectedDate]  && bookings[selectedDate][i] == Cookies.get("access_token") ? "slot-booked-by-me" : "")}>
                        {slot}
                    </span>
                })
            }
            
        </div>
    </div>
  )
}

export default SelectedRoom