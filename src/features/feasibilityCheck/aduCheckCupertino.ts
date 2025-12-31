import {
  ADUType,
  FindingType,
  type Finding,
  type DevSpecs,
  getAduType,
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
  findings: Finding[],
  bedroomCount: number
): void {
  // feasibility check results will be saved here.
  // let findings: Finding[] = [];
  // Check results.

  // if (!property) {
  //   return;
  // }
  const zoningType: ZoningType = getZoningType(project?.zoning);
  const aduType: ADUType = getAduType(detached);
  const lotSize: number = project?.sqft;

  // Single Family
  if (zoningType === ZoningType.SINGLE_FAMILY) {
    // Number
    // TODO
    // Detached Maximum size < 800 sf: Two units are allowed if one is a JADU and one is a detached 800 s.f. ADU
    //  JADU: 1
    // Detached (> 800 sf) / Attached  ADU:
    //  Only one ADU of this kind is allowed.
    //   JADU: not allowed
    devSpecs.allowedAdus = 1;
    findings.push({
      type: FindingType.INFO,
      content:
        "For detached ADUs under 800 sq ft, two units are allowed if one is a JADU and the other is a detached ADU under 800 sq ft; however, only one JADU is permitted. For detached ADUs over 800 sq ft or attached ADUs, only one unit of this kind is allowed, and JADUs are not permitted.",
    });
    // Size
    // TODO
    // Size:
    //  Detached ADU:
    //   Maximum size < 800 sf.:
    //    800 SQ FT
    //   Maximum size > 800 sf.:
    //    850 SQ FT (1 bedroom)
    //    1,000 SQ FT (2 bedrooms)
    //     Must meet Floor Area Ratio and Lot Coverage
    // Attached ADU:
    //  850 SQ FT (1 bedroom)
    //  1,000 SQ FT (2 bedrooms)
    //   Must meet Floor Area Ratio and Lot Coverage
    if (aduType === ADUType.DETACHED) {
      if (bedroomCount === 1) {
        devSpecs.maxSize = 850;
      } else {
        devSpecs.maxSize = 1000;
      }
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached ADUs under 800 sq ft have a maximum size of 800 sq ft. For detached ADUs over 800 sq ft, the maximum size is 850 sq ft for one-bedroom units and 1,000 sq ft for two-bedroom units. These larger ADUs must comply with Floor Area Ratio and Lot Coverage requirements.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      if (bedroomCount === 1) {
        devSpecs.maxSize = 850;
      } else {
        devSpecs.maxSize = 1000;
      }
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs have a maximum size of 850 sq ft for one-bedroom units and 1,000 sq ft for two-bedroom units. These ADUs must also comply with Floor Area Ratio and Lot Coverage requirements.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    if (aduType === ADUType.DETACHED) {
      // TODO
      // Maximum size < 800 sf.:
      //  Front per underlying zoning; Rear and sides 4 ft
      // Maximum size > 800 sf.:
      //  must comply with Accessory Structure Ordinance3
      devSpecs.frontSB = 20;
      devSpecs.sideSB = 4;
      devSpecs.rearSB = 4;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.frontSB = 20;
      devSpecs.sideSB = 4;
      devSpecs.rearSB = 4;
    }

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 16;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 25;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 5;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 1;
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1200;
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setbacks
    if (aduType === ADUType.DETACHED) {
      if (
        project?.zoning.toLowerCase().includes("R-2") ||
        project?.zoning.toLowerCase().includes("R2")
      ) {
        devSpecs.frontSB = 15;
      } else {
        devSpecs.frontSB = 10;
      }

      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
    }

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 16;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 32;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 5;
    }
  } else {
    devSpecs.maxSize = 1000;
  }
  devSpecs.separation = 6;
}
