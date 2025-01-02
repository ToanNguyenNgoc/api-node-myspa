const formatPrice = (num) => {
  return parseInt(num)?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

module.exports = {
  formatPrice
}