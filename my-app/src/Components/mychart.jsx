import React from 'react';
import {Bar} from 'react-chartjs-2';

function mychart({chartData,visibility}) {
  return (
    <div className="chart-container" style={{visibility:`${visibility}`}}>
    <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
    <Bar
      data={chartData}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Users Gained between 2016-2020"
          },
          legend: {
            display: false
          }
        }
      }}
    />
  </div>
  )
}

export default mychart
