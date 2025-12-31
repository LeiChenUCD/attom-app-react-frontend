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
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 850;
      // TODO
      // Studio Unit or 1-Bedroom: 850 sq ft
      // 2 or more Bedroom Unit: 1,200 SQ FT
      findings.push({
        type: FindingType.INFO,
        content:
          "For detached ADUs, the maximum size is 850 square feet for studio or one-bedroom units, and 1,200 square feet for units with two or more bedrooms. These size limits apply regardless of the size of the main residential unit.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      // Attached ADUs limited to 50% of main residential unit living area or as noted above, whichever is less
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the maximum size is limited to 50% of the living area of the main residential unit or 850 square feet for studio or one-bedroom units, and 1,200 square feet for units with two or more bedrooms, whichever is less.",
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
      devSpecs.maxHeight = 16;
    }

    // separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 850;
      // TODO
      // Studio Unit or 1-Bedroom: 850 sq ft
      // 2 or more Bedroom Unit: 1,200 SQ FT
      findings.push({
        type: FindingType.INFO,
        content:
          "For detached ADUs, the maximum size is 850 square feet for studio or one-bedroom units, and 1,200 square feet for units with two or more bedrooms. These size limits apply regardless of the size of the main residential unit.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      // Attached ADUs limited to 50% of main residential unit living area or as noted above, whichever is less
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the maximum size is limited to 50% of the living area of the main residential unit or 850 square feet for studio or one-bedroom units, and 1,200 square feet for units with two or more bedrooms, whichever is less.",
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
      devSpecs.maxHeight = 16;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  }
}
