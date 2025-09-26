export const propertytypeOptions = [{
  value: 'All',
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

export const propertytypeMap = {
  'All': ['SINGLE FAMILY RESIDENCE', 'TOWNHOUSE', 'CONDOMINIUM', 'DUPLEX', 'TRIPLEX', 'FOURPLEX', 'FIVE OR MORE UNITS'],
  'House': ['SINGLE FAMILY RESIDENCE'],
  'Multifamily': ['DUPLEX', 'TRIPLEX', 'FOURPLEX', 'FIVE OR MORE UNITS'],
  'Townhouse': ['TOWNHOUSE'],
  'Condo': ['CONDOMINIUM'],
}