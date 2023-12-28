const sum = (arr) => {
  let total = 0;
  arr.forEach(num => {
      total += num
  })
  return total;
}

export default sum;