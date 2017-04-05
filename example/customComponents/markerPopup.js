import React from 'react'

const MarkerPopup = ({points, geoLocationName}) => {
  return (
    <div>
      <h4>{ geoLocationName }</h4>
      { points.map((p, i) => <p key={ i }>
                               { `data: ${p.id}` }
                             </p>) }
    </div>
  )
}

export default MarkerPopup;
