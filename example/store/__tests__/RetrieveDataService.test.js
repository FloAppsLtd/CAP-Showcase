import test from 'ava'
import data from '../../data/data.json'
import { fetchData } from '../RetrieveDataService'

test('fetchData should retrieve all data', t => {
  fetchData()
    .then(r => {
      t.deepEqual(r, data, 'should be the same')
    })
    .catch(error => {
      console.log('there was an error', error)
    })
})
