import React from 'react'
import moment from 'moment'

const ToolTip = ({data}) => {
  return (data
    ? <div className='chart-tooltip'>
        <p>
          { `date: ${moment(data.key).format('DD.MM.YYYY HH:mm')}` }
          <br />
          { `count: ${data.value.count}` }
        </p>
      </div>
    : null
  )
}

export default ToolTip
