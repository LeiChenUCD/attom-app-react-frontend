export const zoningOptions = [{
  value: '',
  label: 'All'
}, {
  value: 'House',
  label: 'House'
}, {
  value: 'Multifamily',
  label: 'Multifamily'
}, {
  value: 'Townhouse',
  label: 'Townhouse'
}, {
  value: 'Condo',
  label: 'Condo'
}]

export const zoningMap = {
  'House': ['R-1', 'RS', 'R-Single', 'SFH'],
  'Multifamily': ['R-2', 'R-3', 'RM', 'MF', 'R-Multi'],
  'Townhouse': ['RT', 'R-TH', 'R3T', 'R-M'],
  'Condo': ['RM', 'RC', 'R-4', 'R-5', 'CD'],
}