import {
  FindingType,
  type Finding,
  type DevSpecs,
  ZoningType,
  getZoningType,
} from "./aduCheck";

/**
 *
 * @param property
 * @param detached
 * @param story
 * @param devStandard city or state dev standard
 * @returns {findings, developmentSpecs}
 */
export function check(
  property: any,
  detached: boolean,
  story: number,
  devStandard: string,
  project: any | null | undefined,
  devSpecs: DevSpecs,
  findings: Finding[]
): void {
  // feasibility check results will be saved here.
  // let findings: Finding[] = [];
  // Check results.

  if (!property) {
    return;
  }

  devSpecs.sideSB = devStandard === "city" ? 4 : 4;
  devSpecs.rearSB = devStandard === "city" ? 4 : 4;

  const {
    apn_info: apnInfo,
    prop_infos: propInfos,
    permit_infos: permitInfos,
    code_complaint_info: codeComplaintInfo,
  } = property;

  // Assume main house has smaller RSN
  let mainRsn = Math.min(
    ...Object.keys(propInfos).map((num) => parseInt(num, 10))
  );
  let mainPropInfo = propInfos[mainRsn];
  let mainPermitInfo = permitInfos[mainRsn];

  /*
    Constants
    */
  // Ref: https://library.municode.com/ca/san_jose/codes/code_of_ordinances?nodeId=TIT20ZO_CH20.30REZODI_PT3DERE_20.30.200DEST
  const zone2frontSB: any = {
    "R-1-8": 20,
    "R-1-5": 20,
    "R-1-2": 30,
    "R-1-1": 30,
    "R-1-RR": 50,
    "R-2": 15,
    "R-M": 10,
    "R-MH": 15,
  };

  // PART 1.  DOES YOUR PROPERTY QUALIFY?
  // 1. IS THE PROPERTY IN SAN JOSE?
  if (mainPropInfo.data.records.Incorporated == "Yes") {
    findings.push({
      type: FindingType.PASS,
      content: "San Jose Property",
    });
  } else {
    findings.push({
      type: FindingType.FAIL,
      content: "Property is not in San Jose jurisdiction.",
    });
  }

  // 2. IS THE MAIN HOME PERMITTED?
  // TODO: how to get the main home permit from list of permits?

  // 3. IS THERE AN ACTIVE CODE ENFORCEMENT ISSUE ON THE PROPERTY?
  let hasCodeComplaint = false;
  if (codeComplaintInfo?.features) {
    for (const codeComplaint of codeComplaintInfo?.features) {
      if (codeComplaint.properties.CASESTATUS != "CLOSED") {
        hasCodeComplaint = true;
        findings.push({
          type: FindingType.FAIL,
          content:
            "case #: [" +
            codeComplaint.properties.CASENUMBER +
            "] " +
            codeComplaint.properties.DESCRIPTION,
        });
      }
    }
  }
  if (hasCodeComplaint) {
    findings.push({
      type: FindingType.FAIL,
      content:
        'Active code enforcement issue(s) found, email <a href= "mailto: BuildingCodeCompliance@sanjoseca.gov"> BuildingCodeCompliance@sanjoseca.gov </a> for help resolving the issue.',
    });
  } else {
    findings.push({
      type: FindingType.PASS,
      content: "No open code enforcement",
    });
  }

  // PART 2.  WHAT ARE YOUR PROPERTY DESIGNATIONS?
  // 4. FLOOD ZONES. Is the property in flood zone A, AE, AH, or AO?
  devSpecs.floodZone = mainPropInfo.data.records["Flood Zone"];
  if (["A", "AE", "AH", "AO"].includes(devSpecs.floodZone)) {
    findings.push({
      type: FindingType.WARN,
      content:
        "The property is in flood zone [" +
        devSpecs.floodZone +
        ']. Your plan must follow the flood zone design requirements in <a href="https://www.sanjoseca.gov/home/showpublisheddocument/39040/637606632299400000" target="_blank">Bulletin #211-ADU Plan Requirements</a>. For questions, call 408-535-7803 or email floodzoneinfo@ sanjoseca.gov.',
    });
  } else {
    findings.push({
      type: FindingType.PASS,
      content: "Not in flood zone",
    });
  }

  // 5. GEOHAZARDS OR SEISMIC HAZARDS. Is the property in a geohazard or landslide zone?
  devSpecs.geohazardZones = mainPropInfo.data.records["GeoHazard Zone"];
  if (devSpecs.geohazardZones != "No") {
    findings.push({
      type: FindingType.WARN,
      content:
        "Geologic Hazard Zone[" +
        devSpecs.geohazardZones +
        ']. Clearance is required; visit the Public Works <a href="https://www.sanjoseca.gov/your-government/departments-offices/public-works/development-services/geological-hazard-review" ' +
        'target="_blank">Geological Hazard</a> webpage. For questions, call <a href="tel:14085357802">1-408-535-7802</a> or email <a href= "mailto: pwgeneralinfo@sanjoseca.gov"> pwgeneralinfo@sanjoseca.gov</a>.',
    });
  } else if (mainPropInfo.data.records["Seismic Hazards"] != "No") {
    findings.push({
      type: FindingType.WARN,
      content:
        "Seismic Hazard Zone[" +
        mainPropInfo.data.records["Seismic Hazards"] +
        ']. Clearance is required; visit the Public Works <a href="https://www.sanjoseca.gov/your-government/departments-offices/public-works/development-services/geological-hazard-review" ' +
        'target="_blank">Geological Hazard</a> webpage. For questions, call <a href="tel:14085357802">1-408-535-7802</a> or email <a href= "mailto: pwgeneralinfo@sanjoseca.gov"> pwgeneralinfo@sanjoseca.gov</a>.',
    });
  } else {
    findings.push({
      type: FindingType.PASS,
      content: "Not in geologic hazard zone",
    });
  }

  // 6. HISTORIC PROPERTY. Is the property listed on the City’s Historic Resources Inventory map or the California Historical Resources list for Santa Clara County?
  devSpecs.historicResource = mainPropInfo.data.records["Historic Resource"];
  if (devSpecs.historicResource != "No") {
    findings.push({
      type: FindingType.WARN,
      content:
        "Historic property. If choose the City Development Standards for your ADU design, then you must apply the simplified design standards in Municipal Code " +
        '<a href="https://library.municode.com/ca/san_jose/codes/code_of_ordinances?nodeId=TIT20ZO_CH20.80SPUSRE_PT2.75ACDWUN_20.80.175GE" target="_blank">Section 20.80.175 (E)</a> to the project. ' +
        "If choose the State Development Standards, then no further design standards need to be considered.",
    });
  } else {
    findings.push({
      type: FindingType.PASS,
      content: "Not historic property",
    });
  }

  // 7. WILDLAND-URBAN INTERFACE ZONE. Is the property located in a Wildland-Urban Interface Zone (WUI)?
  if (mainPropInfo.data.records["Wildland-Urban Interface?"] != "No") {
    findings.push({
      type: FindingType.WARN,
      content:
        'Wildland-Urban Interface zone. Construction must comply with all requirements outlined in the <a href="https://www.sanjoseca.gov/home/showpublisheddocument/85278/637871885677770000" target="_blank">WUI policy</a>.',
    });
  } else {
    findings.push({
      type: FindingType.PASS,
      content: "Not Wildland-Urban Interface zone",
    });
  }

  // 8. EASEMENTS. Does the property have a dedicated easement?
  // TODO: how to use easement data?
  findings.push({
    type: FindingType.INFO,
    content:
      "For dedicated easement on the property, see the title report issued during the purchase of your home or contact a title company for a copy. If yes, you must comply with the requirements of the easements; often, no construction is allowed within the easement area.",
  });

  // 9. NONBUILDABLE AREA. Is there a nonbuildable area in the location of the proposed ADU, such as a demolished swimming pool?
  // TODO: how to decide if there is a pool permit
  let hasPoolPermit = false;
  for (const permitInfo of mainPermitInfo.data.records) {
    if (
      permitInfo.folder.description &&
      permitInfo.folder.description.toLowerCase().search("pool") >= 0
    ) {
      findings.push({
        type: FindingType.INFO,
        content:
          "Pool permit found: " +
          permitInfo.folder.name +
          "[" +
          permitInfo.permitNumber +
          "] " +
          permitInfo.folder.description,
      });
      hasPoolPermit = true;
    }
  }
  if (hasPoolPermit) {
    findings.push({
      type: FindingType.WARN,
      content:
        "If there is nonbuildable area due to a pool demolition, your submittal package must include pool demolition documents, either a plot plan showing the requirements per " +
        '<a href="https://www.sanjoseca.gov/home/showpublisheddocument/26025/637971241254830000" target="_blank">Bulletin #289-Swimming Pool Demolition Requirements</a> or a geotechnical report and foundation design, which may require an engineer’s services.',
    });
  } else {
    findings.push({
      type: FindingType.INFO,
      content: "Pool permit not found.",
    });
  }

  // PART 3.  CHOOSE THE CITY OR STATE ADU DEVELOPMENT STANDARDS
  /* 
    User inputs
    These are user inputs, but aduType and aduStory are selected when user chooses a preapproved model.
    */
  // For apex use case, aduType is always detached
  let aduType = detached ? "detached" : "attached"; //detached,attached,jadu
  // For apex use case, aduStory is always 1
  let aduStory = story || 1;
  let rearYardSqft = 3000;

  // Can also from map data
  let lotSqft = mainPropInfo.data.records["Area"];
  const zoningType: ZoningType = getZoningType(project?.zoning);

  let zone = "";
  for (const ai of apnInfo?.data) {
    zone = ai.zone;
    if (parseInt(ai.rsn) == mainRsn) {
      // Get zone from main house, shouldn't make a difference anyway.
      zone = ai.zone;
      break;
    }
  }
  if (zoningType === ZoningType.SINGLE_FAMILY) {
    devSpecs.allowedAdus = 1; // always 1 for r-1 zones
    devSpecs.existAdus = Object.keys(propInfos).length - 1;

    if (devSpecs.existAdus) {
      findings.push({
        type: FindingType.WARN,
        content:
          "According to city permit record, there may already be ADU(s) on property.",
      });
      // show smaller polygon in grey, do not consider it in development specs checks
    }

    devSpecs.minSize = 150; // always 150 sqft for r-1 zones

    if (devStandard == "city") {
      if (aduType == "detached") {
        if (Number(lotSqft) < 9000) {
          devSpecs.maxSize = 1000;
        } else {
          devSpecs.maxSize = 1200;
        }
        // Not including swimming pools, not more than 40% of the rear yard may be covered by structures.
        devSpecs.maxSize = Math.min(devSpecs.maxSize, 0.4 * rearYardSqft);

        // 1. Satisfy zone based front setback rule
        if (zone in zone2frontSB) {
          devSpecs.frontSB = zone2frontSB[zone];
        }
        // 2. Behind main home OR 45 ft front setback
        devSpecs.rearYardFrontSB = 45;

        devSpecs.sideSB = 4;
        devSpecs.rearSB = 4;
        if (aduStory == 2) {
          devSpecs.sideSB = 4;
          devSpecs.rearSB = 4;
        }

        devSpecs.maxHeight = 25;

        devSpecs.separation = 6;
      } else if (aduType == "attached") {
        if (Number(lotSqft) < 9000) {
          devSpecs.maxSize = 1000;
        } else {
          devSpecs.maxSize = Math.min(devSpecs.mainHouseSqft / 2, 1200);
        }

        if (zone in zone2frontSB) {
          devSpecs.frontSB = zone2frontSB[zone];
        }

        devSpecs.maxHeight = 25;
      } else if (aduType == "jadu") {
        devSpecs.maxSize = 500;
      }
    } else if (devStandard == "state") {
      if (aduType == "detached" || aduType == "attached") {
        devSpecs.maxSize = 800;

        if (zone in zone2frontSB) {
          // Front setback may be encroached if no other option enables a minimum 800 sf ADU on the site.
          devSpecs.frontSB = zone2frontSB[zone];
        }

        devSpecs.sideSB = 4;
        devSpecs.rearSB = 4;

        devSpecs.maxHeight = 18;
      } else if (aduType == "jadu") {
        devSpecs.maxSize = 500;
      }
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    devSpecs.minSize = 150; // always 150 sqft

    if (devStandard == "city") {
      devSpecs.allowedAdus = 1; // always 1 for r-2 r-m zones according to city standard

      if (aduType == "detached") {
        if (Number(lotSqft) < 9000) {
          devSpecs.maxSize = 1000;
        } else {
          devSpecs.maxSize = 1200;
        }
        // Not including swimming pools, not more than 40% of the rear yard may be covered by structures.
        devSpecs.maxSize = Math.min(devSpecs.maxSize, 0.4 * rearYardSqft);

        // 1. Satisfy zone based front setback rule
        if (zone in zone2frontSB) {
          devSpecs.frontSB = zone2frontSB[zone];
        }
        // 2. Behind main home OR 45 ft front setback
        devSpecs.rearYardFrontSB = 45;

        devSpecs.sideSB = 4;
        devSpecs.rearSB = 4;
        if (aduStory == 2) {
          devSpecs.sideSB = 4;
          devSpecs.rearSB = 4;
        }

        devSpecs.maxHeight = 25;

        devSpecs.separation = 6;
      } else if (aduType == "attached") {
        if (Number(lotSqft) < 9000) {
          devSpecs.maxSize = 1000;
        } else {
          devSpecs.maxSize = Math.min(devSpecs.mainHouseSqft / 2, 1200);
        }

        // 1. Satisfy zone based front setback rule
        if (zone in zone2frontSB) {
          devSpecs.frontSB = zone2frontSB[zone];
        }

        devSpecs.sideSB = 4;
        devSpecs.rearSB = 4;

        devSpecs.maxHeight = 25;
      }
    } else if (devStandard == "state") {
      if (aduType == "detached" || aduType == "attached") {
        devSpecs.allowedAdus = 2; // always 1 for r-2 r-m zones according to city standard

        devSpecs.maxSize = 800;

        if (zone in zone2frontSB) {
          // Front setback may be encroached if no other option enables a minimum 800 sf ADU on the site.
          devSpecs.frontSB = zone2frontSB[zone];
        }

        devSpecs.sideSB = 4;
        devSpecs.rearSB = 4;

        devSpecs.maxHeight = 18;
      }
    }
  } else {
    if (aduType == "detached") {
      devSpecs.separation = 6;
    }
    if (Number(lotSqft) < 9000) {
      devSpecs.maxSize = 1000;
    } else {
      devSpecs.maxSize = 1200;
    }
    findings.push({
      type: FindingType.WARN,
      content:
        "Some zoning does not have front setback rules in San Jose, it depends on main hourse permit.<br>In that case, just use minimum front setback and add the following warning:<br><br>      We cannot decide your setbacks based on this properties' available information, please contact you adu provider for more acccurate siting guideline.",
    });
  }
}
