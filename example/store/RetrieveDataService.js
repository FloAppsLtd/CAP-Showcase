import data from '../data/data.json'

export function fetchData () {
  return new Promise((resolve, reject) => {
    // Mock data fetching service
    if (true) {
      resolve(data)
    } else {
      reject([])
    }
  })
}
