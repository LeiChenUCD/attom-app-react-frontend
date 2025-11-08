export const propertytypeOptions = [
  {
    value: "All",
    label: "All"
  },
  {
    value: "House",
    label: "House"
  },
  {
    value: "Multifamily",
    label: "Multifamily"
  },
  {
    value: "Townhouse",
    label: "Townhouse"
  },
  {
    value: "Condo",
    label: "Condo"
  }
];

export const propertytypeMap = {
  All: [
    "SINGLE FAMILY RESIDENCE",
    "TOWNHOUSE",
    "CONDOMINIUM",
    "DUPLEX",
    "TRIPLEX",
    "FOURPLEX",
    "FIVE OR MORE UNITS"
  ],
  House: ["SINGLE FAMILY RESIDENCE"],
  Multifamily: ["DUPLEX", "TRIPLEX", "FOURPLEX", "FIVE OR MORE UNITS"],
  Townhouse: ["TOWNHOUSE"],
  Condo: ["CONDOMINIUM"]
};

export const statusOptions = [
  {
    value: "All",
    label: "All"
  },
  {
    value: "Active",
    label: "Active"
  },
  {
    value: "PendingDoNotShow",
    label: "PendingDoNotShow"
  },
  {
    value: "Sold",
    label: "Sold"
  }
];

export const mlsstatusMap = {
  All: ["Active", "PendingDoNotShow", "Sold"],
  Active: ["Active"],
  PendingDoNotShow: ["PendingDoNotShow"],
  Sold: ["Sold"]
};
