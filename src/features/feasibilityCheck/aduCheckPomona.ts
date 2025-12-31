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
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      // TODO
      if (lotSize < 7200) {
        // one bedroom: not exceed 850 square feet for a studio or unit or
        // two or more bedrooms: 1,000 SQ FT
        devSpecs.maxSize = 850;
        findings.push({
          type: FindingType.INFO,
          content:
            "For both detached and attached ADUs, the maximum size shall not exceed 850 square feet for a studio or one-bedroom unit, and 1,000 square feet for units with two or more bedrooms.",
        });
      } else if (lotSize >= 7200) {
        devSpecs.maxSize = 1200;
      }
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.frontSB = 20; // Front: must be established by the underlying zoning district
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 18;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 25;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      // TODO
      // Unit Separation: minimum of 10 Ft from the primary dwelling unit and 6 ft from any accessory structure
      devSpecs.separation = 10;
      findings.push({
        type: FindingType.INFO,
        content:
          "For detached ADUs, a minimum separation of 10 feet is required from the primary dwelling unit and 6 feet from any accessory structure.",
      });
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 2;
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 1;
    }

    // Size
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      // TODO
      if (lotSize < 7200) {
        // one bedroom: not exceed 850 square feet for a studio or unit or
        // two or more bedrooms: 1,000 SQ FT
        devSpecs.maxSize = 850;
        findings.push({
          type: FindingType.INFO,
          content:
            "For both detached and attached ADUs, the maximum size shall not exceed 850 square feet for a studio or one-bedroom unit, and 1,000 square feet for units with two or more bedrooms.",
        });
      } else if (lotSize >= 7200) {
        devSpecs.maxSize = 1200;
      }
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      // TODO
      // Unit Separation: minimum of 10 Ft from the primary dwelling unit and 6 ft from any accessory structure
      devSpecs.separation = 10;
      findings.push({
        type: FindingType.INFO,
        content:
          "For detached ADUs, a minimum separation of 10 feet is required from the primary dwelling unit and 6 feet from any accessory structure.",
      });
    }
  }
}
