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
      devSpecs.allowedAdus = 1;
    }

    // Size
    // TODO
    // Maximum size :
    //  1 bedroom: 850 SQ FT
    //  2 bedrooms or more: 1,000 SQ FT
    // Attached: cannot exceed 50% of the gfa of existing primary unit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 850;
      findings.push({
        type: FindingType.INFO,
        content:
          "For this property, the maximum ADU size is 850 sq ft for a one-bedroom unit, or 1,000 sq ft for two or more bedrooms.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 850;
      findings.push({
        type: FindingType.INFO,
        content:
          "For this property, the maximum ADU size is 850 sq ft for a one-bedroom unit, or 1,000 sq ft for two or more bedrooms, and must not exceed 50% of the gross floor area of the existing primary unit.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.frontSB = 20;
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    if (story === 1) {
      devSpecs.maxHeight = 28;
    } else if (story === 2) {
      devSpecs.maxHeight = 28;
    }

    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 10;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // Attached: at least one ADU and up to 25% of the number of existing Multi-family housing units
      devSpecs.allowedAdus = 1;
      findings.push({
        type: FindingType.INFO,
        content:
          "For multi-family lots, you can have at least one attached ADU and up to 25% of the number of existing multi-family housing units.",
      });
    }

    // Size
    // No max

    // Setback
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

    // Height Limit
    devSpecs.maxHeight = 16;
    if (story === 2) {
      devSpecs.maxHeight = 28;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 10;
    }
  }
}
