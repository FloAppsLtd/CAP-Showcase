import crossfilter from 'crossfilter2'
import reductio from 'reductio'
import moment from 'moment'
import _ from 'lodash'
import { flow, groupBy, map, filter, sortBy, max } from 'lodash/fp'

// Reductio reducer functions
let reducerGeo = reductio().count(false)
  .aliasProp({
    id: (g, v) => v.id,
    country: (g, v) => v.country,
    userName: (g, v) => v.userName,
    lat: (g, v) => v.latitude,
    lng: (g, v) => v.longitude
  })

let reducerTime = reductio().count(false)
  .dataList(true)

class DataHandler {
  constructor (data = []) {
    this.data = formatDates(data, 'eventTime')
    // Create crossfilter object
    this.ndx = crossfilter(this.data)
    console.log('handling data', this.data.length)
    // console.log('data', _.take(this.data, 3))
    this.today = moment().toDate()
    this.updateGroups()
  }

  add (data) {
    console.log('added data', data.length)
    let formatedNewData = formatDates(data, 'eventTime')
    this.data = _.concat(this.data, formatedNewData)
    this.ndx.add(formatedNewData)
    return this
  }

  updateGroups () {
    this.idCategoryDimension = this.ndx.dimension((d) => [d.id, d.category])
    this.idCategoryDimensionGroup = reducerGeo(this.idCategoryDimension.group())

    this.timeDimension = this.ndx.dimension((d) => d.eventTime)
    this.timeDimensionGroup = reducerTime(this.timeDimension.group())

    this.timeDimensionHourly = this.ndx.dimension((d) => moment(d.eventTime).startOf('hour').toDate())
    this.timeDimensionHourlyGroup = reducerTime(this.timeDimensionHourly.group())

    this.categoryDimension = this.ndx.dimension((d) => d.category)
    this.categoryDimensionGroup = this.categoryDimension.group()
  }

  getTimeDimension () {
    return this.timeDimensionHourly
  }

  getTimeDimensionGroup () {
    return this.timeDimensionHourlyGroup
  }

  getCategoryDimension () {
    return this.categoryDimension
  }

  getCategoryDimensionGroup () {
    return this.categoryDimensionGroup
  }

  getTotalNumberOfRecords () {
    return this.ndx.size()
  }

  getAllRecords () {
    return this.data
  }

  getAllDimension () {
    return this.ndx
  }

  getAllDimensionGroup () {
    return this.ndx.groupAll()
  }

  getGeoData () {
    let r = flow(
      filter((v) => v.value.count > 0),
      map((v) => {
        return {
          lat: v.value.lat,
          lng: v.value.lng,
          data: {
            country: v.value.country,
            userName: v.value.userName,
            id: v.value.id,
          },
        }
      }),
      sortBy('data.id'))(this.idCategoryDimensionGroup.all())
    return r
  }

  getDateRange (untilToday) {
    if (_.isEmpty(this.data)) {
      return [new Date(), new Date()]
    }
    let startDate = moment(_.minBy(this.data, 'eventTime').eventTime).startOf('day').toDate()
    let endDate = untilToday ? moment(this.today).endOf('day').toDate() : moment(_.maxBy(this.data, 'eventTime').eventTime).endOf('day').toDate()
    return [startDate, endDate]
  }

  getRecordsRangeByHour () {
    let r = flow(
      groupBy((d) => moment(d.eventTime).startOf('hour').toDate()),
      map((v) => v.length),
      max)(this.data)

    if (_.isNil(r)) {
      return [0, 0]
    }
    return [0, r]
  }

  getFieldDescriptions () {
    return {
      id: {
        title: 'ID',
        index: 0
      },
      userName: {
        title: 'User name',
        index: 1
      },
      eventTime: {
        title: 'Event time',
        index: 2
      },
      country: {
        title: 'Country',
        index: 9
      },
      longitude: {
        title: 'Longitude',
        index: 4
      },
      latitude: {
        title: 'Latitude',
        index: 5
      },
      score: {
        title: 'Score',
        index: 6
      },
      category: {
        title: 'Category',
        index: 3
      },
      comment: {
        title: 'Comment',
        index: 8
      },
    }
  }

  // ---- Filters ----
  filterBy (filterType, range) {
    if (_.isNil(range)) {
      this.timeDimension.filterAll()
      return
    }
    if (filterType === 'time') {
      this.timeDimension.filterRange(range)
      this.timeDimensionHourly.filterRange(range)
    }
  }
}

export default DataHandler

// Helper function to format dates
function formatDates (data, field) {
  return _.map(data, (d) => {
    return _.set(d, field, moment(d[field]).toDate())
  })
}
