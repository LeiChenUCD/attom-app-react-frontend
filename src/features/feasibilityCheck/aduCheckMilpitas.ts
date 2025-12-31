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
  findings: Finding[]
): void {
  // feasibility check results will be saved here.
  // let findings: Finding[] = [];
  // Check results.

  // if (!property) {
  //   return;
  // }
  const aduType: ADUType = getAduType(detached);
  const zoningType: ZoningType = getZoningType(project?.zoning);
  const lotSize: number = project?.sqft;

  // Single Family
  if (zoningType === ZoningType.SINGLE_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 1;
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 1;
    }

    // Size
    // TODO
    // Maximum size :
    //  850 SQ FT (1 bedroom)
    //  1,000 SQ FT (2 bedrooms)
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      findings.push({
        type: FindingType.INFO,
        content:
          "The maximum size allowed is 850 sq ft for a one-bedroom unit and 1,000 sq ft for a two-bedroom unit.",
      });
      devSpecs.maxSize = 850;
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.frontSB = 25;
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height
    if (story === 1) {
      devSpecs.maxHeight = 16;
    } else if (story === 1) {
      devSpecs.maxHeight = 16;
    }

    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 2;
    }

    // Size
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      // TODO
      // Maximum size :
      //  850 SQ FT (1 bedroom)
      //  1,000 SQ FT (2 bedrooms)
      findings.push({
        type: FindingType.INFO,
        content:
          "The maximum size allowed is 850 sq ft for a one-bedroom unit and 1,000 sq ft for a two-bedroom unit.",
      });
    }

    // Setback
    devSpecs.frontSB = 25;
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    if (story === 1) {
      devSpecs.maxHeight = 16;
    } else if (story === 2) {
      devSpecs.maxHeight = 18;
    }
    // Attached:
    if (aduType === ADUType.ATTACHED) {
      //  not exceed 25 feet in height or the height limitation imposed by the standards for the underlying zoning district, whichever is less
      devSpecs.maxHeight = 25;
    } else if (aduType === ADUType.DETACHED) {
      // TODO
      // may be up to two additional feet in height (for a maximum of 20 feet) if needed to accommodate a roof pitch on the ADU that is aligned with the roof pitch of the primary dwelling unit.
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached ADUs may be up to two feet taller (maximum height of 20 feet) if the extra height is needed to match the roof pitch of the primary dwelling.",
      });
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  }
  if (aduType === ADUType.JADU) {
    devSpecs.maxSize = 500;
  } else {
    devSpecs.maxSize = 1000;
  }
}
