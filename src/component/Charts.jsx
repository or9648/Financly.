import React from 'react'
import LineChart from "../component/LineChart"
 import Piechart from "../component/Piechart"
function Charts({ sorttran = [] }) {
    
  return (
    <div className=' flex gap-3  w-full h-auto '> 
    
        <LineChart sortTran={sorttran}/>
        {/* <Piechart sortTran={sorttran}/> */}
    </div>
  )
}

export default Charts