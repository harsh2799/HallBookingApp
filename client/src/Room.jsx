import React from 'react'

const Room = ({updateSelectRoom, index, number, features, bookings, capacity}) => {
  return (
    <div className='card' id={index}>
        <h2>{number}</h2>
        <div className='feature-list'>
            {features.map((feature, index) => {
                return <span key={index} className='feature'>{feature}</span>
            })}
        </div>
        <h3>Capacity: {capacity}</h3>
        <button onClick={() => {updateSelectRoom(number - 101)}}>Show Room</button>
    </div>
  )
}

export default Room