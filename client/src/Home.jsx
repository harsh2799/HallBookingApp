import {React, useState, useEffect, useContext} from 'react'
import axios from 'axios'
import Room from './Room'
import SelectedRoom from './SelectedRoom'

import io from 'socket.io-client';

const Home = () => {
    const [searchFor, setSearchFor] = useState("")
    const [roomData, setRoomData] = useState([])
    const [searchData, setSearchData] = useState([])
    const [selectedRoom, selectRoom] = useState(-1)
    const [message, setMessage] = useState('');

    // Socket Connection to get Updated list of rooms whenever someone makes changes to db.
    useEffect(() => {
        // Connect to the WebSocket server
        const socket = io('http://localhost:8000');
    
        // Listen for 'message' event from the server
        socket.on('message', (data) => {
          setMessage(data);
          console.log("socketio.emit('message', 'Hello, World!')")
        });

        socket.on('data-change', (data) => {
            updateRoomData(data);
            updateSearchData(data);
        });
    
        // Clean up the WebSocket connection when the component unmounts
        return () => {
          socket.disconnect();
        };
      }, []);
    
    const updateSearchFor = (e) => {
        setSearchFor(e.target.value);
    }

    const updateSelectRoom = (id) => {
        selectRoom(id);
    }

    const updateRoomData = (data) => {
        setRoomData(data)
    }

    const updateSearchData = (data) => {
        setSearchData(data)
    }

    const searchForRoom = () => {
        
        if (searchFor == "") {
            updateSearchData(roomData);
        }
        else {
            const x = [];
            roomData.map((data) => {
                if (data.capacity == searchFor || data.number == searchFor || data.features.includes(searchFor)) {
                    x.push(data)
                }
            })
            
            updateSearchData(x);
        }
    }

    // API request to get the list of rooms and their availability
    useEffect(() => {
        axios.get("http://localhost:8000/getRooms").then((res) => {
            updateRoomData(res.data)
            updateSearchData(res.data)
        })
    }, [])

    return (
    <div>
        <input type="text" name="search" placeholder='Search' onChange={updateSearchFor}  id="search"/>
        <button onClick={searchForRoom} > Search </button>
        <div className='room-display'>
            <div>

                {searchData.map((room, index) => {
                    return <Room key={room.number} updateSelectRoom={updateSelectRoom} index={index} {...room}/>
                })}
            </div>
            <div className='room-data'>
                {selectedRoom > -1 && <SelectedRoom updateRoomData={setRoomData} updateSearchData={updateSearchData} {...roomData[selectedRoom]}/>}
            </div>
        </div>
        
    </div>
    )
}

export default Home