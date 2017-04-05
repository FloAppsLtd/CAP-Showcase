import React from 'react'
import { DataCount } from '../../src'

class InfoLabel extends React.Component {
  render () {
    const templateSome = () => {
      return (
        <div className=''>
          <strong>%filter-count</strong> out of %total-count records selected.
        </div>
      )
    }

    const templateAll = () => {
      return (
        <div className=''>
          All records selected, (%total-count). Click on the charts to apply filters.
        </div>
      )
    }

    return (
      <DataCount { ...this.props }
        name='info-label'
        templateAll={ templateAll() }
        templateSome={ templateSome() } />
    )
  }
}

export default InfoLabel
