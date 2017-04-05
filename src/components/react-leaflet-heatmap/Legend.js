import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
import { flow, map, keys, join, sortBy } from 'lodash/fp'
import './style.css'

class Legend extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps !== this.props
  }

  makeGradientStyle (gradient) {
    var gradientStyle = flow(
      keys,
      map(parseFloat),
      sortBy(v => v),
      map((v) => (`${gradient[v]}${v * 100}%`)),
      join(', '))(gradient)

    return {
      background: [
        'linear-gradient(to right, ' + gradientStyle + ')',
      ],
    }
  }

  render () {
    const {max, min, gradient, legendClassName, legendTitle} = this.props

    return (
      <div className={ legendClassName }>
        <h4>{ legendTitle }</h4>
        <img style={ this.makeGradientStyle(gradient) } />
        <div>
          <span className='legend-min'>{ min }</span>
          <span className='legend-max'>{ max }</span>
        </div>
      </div>
    )
  }
}

Legend.propTypes = {
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  gradient: PropTypes.object.isRequired,
  legendTitle: PropTypes.string,
  legendClassName: PropTypes.string,
}

Legend.defaultProps = {
  legendTitle: 'Totals',
  legendClassName: 'map-legend',
}

export default Legend
