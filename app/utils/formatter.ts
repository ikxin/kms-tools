export const getSuccessRate = (data: any[]) => {
  return data.filter(entry => entry.status).length / data.length
}

export const getRateColor = (value: number) => {
  if (value >= 1) {
    return 'green'
  } else if (value >= 0.9) {
    return 'orange'
  } else {
    return 'red'
  }
}

export const getAverageDelay = (data: any[]) => {
  return data.reduce((sum, entry) => sum + entry.delay, 0) / data.length
}

export const getDelayColor = (value: number) => {
  if (value <= 200) {
    return 'green'
  } else if (value <= 400) {
    return 'orange'
  } else {
    return 'red'
  }
}
