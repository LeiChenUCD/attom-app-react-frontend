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
      devSpecs.maxSize = 1000;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 900;
      // TODO
      // Attached: not exceed 50 percent of the existing primary dwelling.
      // 1 bedroom: 900 SQ FT
      // 2 bedroom: 1,000 SQ FT
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs cannot exceed 50% of the existing primary dwelling's size, with maximum sizes of 900 sq ft for one-bedroom units and 1,000 sq ft for two-bedroom units.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.rearSB = 4;
    devSpecs.sideSB = 4;

    // Height Limit
    if (story === 1) {
      devSpecs.maxHeight = 16;
    }

    // Separation no specific FT
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 2;
    }

    // Size
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      // TODO
      // Maximum size : must not exceed twenty-five percent (25%) of the existing multifamily dwelling units or one (1) unit
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached and attached ADUs are limited to either one unit or 25% of the number of existing multifamily dwelling units, whichever is greater.",
      });
    }

    // Setback
    if (story === 1) {
      devSpecs.sideSB = 4;
      devSpecs.rearSB = 4;
    } else if (story === 2) {
      devSpecs.sideSB = 4;
      devSpecs.rearSB = 4;
    }

    // Height Limit
    if (story === 1) {
      devSpecs.maxHeight = 16;
    }
  }
}
