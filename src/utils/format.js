export const formatSalary = (n) => {
  if (!n) return '0'
  const num = Number(n)
  
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1).replace(/\.0$/, '') + ' Cr'
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1).replace(/\.0$/, '') + ' Lakh'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k'
  }
  return num.toString()
}

export const formatCurrency = (n) => {
  if (!n) return '₹0'
  return '₹' + formatSalary(n)
}

export const formatIndianNumber = (n) => {
  if (!n) return '0'
  return new Intl.NumberFormat('en-IN').format(n)
}
