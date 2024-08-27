export const rateColor = (value: number) => {
  if (value >= 1) {
    return 'green'
  } else if (value >= 0.9) {
    return 'orange'
  } else {
    return 'red'
  }
}

export const delayColor = (value: number) => {
  if (value <= 500) {
    return 'green'
  } else if (value <= 1000) {
    return 'orange'
  } else {
    return 'red'
  }
}
