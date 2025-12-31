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
  project: any,
  devSpecs: DevSpecs,
  findings: Finding[]
): void {
  // feasibility check results will be saved here.
  // let findings: Finding[] = [];
  // Check results.

  const zoningType: ZoningType = getZoningType(project?.zoning);

  // if (!property) {
  //   return;
  // }
  let apnInfo = {};
  let propInfos = {};
  let permitInfos = {};
  let codeComplaintInfo = {};
  let mainRsn = null;

  if (property) {
    ({
      apn_info: apnInfo,
      prop_infos: propInfos,
      permit_infos: permitInfos,
      code_complaint_info: codeComplaintInfo,
    } = property);

    // Assume main house has smaller RSN
    let mainRsn = Math.min(
      ...Object.keys(propInfos).map((num) => parseInt(num, 10))
    );
  }

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

  // PART 3.  CHOOSE THE CITY OR STATE ADU DEVELOPMENT STANDARDS
  /* 
    User inputs
    These are user inputs, but aduType and aduStory are selected when user chooses a preapproved model.
    */
  // For apex use case, aduType is always detached
  let aduType = detached ? "detached" : "attached"; //detached,attached,jadu

  let zone = "";
  if (apnInfo && "data" in apnInfo) {
    for (const ai of (apnInfo as any).data) {
      zone = ai.zone;
      if (parseInt(ai.rsn) == mainRsn) {
        // Get zone from main house, shouldn't make a difference anyway.
        zone = ai.zone;
        break;
      }
    }
  }

  if (zoningType === ZoningType.SINGLE_FAMILY) {
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
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
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
  devSpecs.maxSize = 800;
  if (aduType == "jadu") {
    devSpecs.maxSize = 500;
  }
  devSpecs.separation = 0;
}
