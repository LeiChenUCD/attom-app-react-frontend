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
  const zoningType: ZoningType = getZoningType(project?.zoning);
  const aduType: ADUType = getAduType(detached);
  const lotSize: number = project?.sqft;

  // Single Family
  if (zoningType === ZoningType.SINGLE_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 1;
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 2;
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1200;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 1200;
      // but no more than 50% of the floor area of the existing or proposed primary dwelling
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the maximum size is up to 1,200 square feet, but it may not exceed 50% of the floor area of the existing or proposed primary dwelling.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.frontSB = 20;
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
    }

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 18;
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // 16 feet, or the height of the underlying zoning district, whichever is greater
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the height limit is 16 feet or the maximum height allowed by the underlying zoning district, whichever is greater.",
      });
      devSpecs.maxHeight = 25;
    }

    // Separation
    devSpecs.separation = 6;
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 1;
      // TODO
      // Ceiling(25% of existing multi-family dwelling units)
      findings.push({
        type: FindingType.INFO,
        content:
          "At least one accessory dwelling unit built within an existing multi-family dwelling unit is allowed, but no more than up to twenty-five (25) percent of the existing multi-family dwelling units in the same multi-family dwelling development are allowed to build an accessory dwelling unit within its units. Fractional units will be rounded up to the next whole unit.",
      });
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1200;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 1200;
      // TODO
      // Up to 1,200 SQ FT (but no more than 50% of the floor area of the existing or proposed primary dwelling)
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the maximum size is up to 1,200 square feet, but it may not exceed 50% of the floor area of the existing or proposed primary dwelling.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      if (
        project?.zoning.toLowerCase().includes("R-2") ||
        project?.zoning.toLowerCase().includes("R2")
      ) {
        devSpecs.frontSB = 15;
      } else {
        devSpecs.frontSB = 10;
      }
      devSpecs.sideSB = 4;
      devSpecs.rearSB = 4;
    }

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 18;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 32;
      // TODO
      // 16 feet, or the height of the underlying zoning district, whichever is greater
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the height limit is 16 feet or the maximum height allowed by the underlying zoning district, whichever is greater.",
      });
    }

    // Separation
    devSpecs.separation = 6;
  }
}
