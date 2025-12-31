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
      // R-1-8: 850 SQ FT or 1,000 SQ FT (if more than one bedroom)
      // R-1-20: 850 SQ FT or 1,000 SQ FT (if more than one bedroom)
      // R-1-44: 800 SQ FT or 1,200 SQ FT (if more than one bedroom)
      devSpecs.maxSize = 850;
      if (project?.zoning === "R-1-8") {
        devSpecs.maxSize = 850;
      } else if (project?.zoning === "R-1-20") {
        devSpecs.maxSize = 850;
      } else if (project?.zoning === "R-1-44") {
        devSpecs.maxSize = 800;
      }
      findings.push({
        type: FindingType.INFO,
        content:
          "For both attached and detached accessory dwelling units (ADUs), the maximum allowable size is determined by the zoning district. In the R-1-8 and R-1-20 zoning districts, the maximum size permitted is 850 square feet for one-bedroom units and 1,000 square feet for units with more than one bedroom. In the R-1-44 zoning district, the size limits are 800 square feet for one-bedroom units and 1,200 square feet for units with two or more bedrooms.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    if (aduType === ADUType.ATTACHED) {
      // TODO
      // Attached ADU: Underlying zoning district
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the front setback requirement follows that of the underlying zoning district.",
      });
      devSpecs.frontSB = 20;
      devSpecs.rearSB = 20;
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.frontSB = 20;
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
    }

    // Height Limit
    if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 25;
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 16;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 1;
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 1;
    }

    // Size
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      // TODO
      // R-1-8: 850 SQ FT or 1,000 SQ FT (if more than one bedroom)
      // R-1-20: 850 SQ FT or 1,000 SQ FT (if more than one bedroom)
      // R-1-44: 800 SQ FT or 1,200 SQ FT (if more than one bedroom)
      devSpecs.maxSize = 850;
      if (project?.zoning === "R-1-8") {
        devSpecs.maxSize = 850;
      } else if (project?.zoning === "R-1-20") {
        devSpecs.maxSize = 850;
      } else if (project?.zoning === "R-1-44") {
        devSpecs.maxSize = 800;
      }
      findings.push({
        type: FindingType.INFO,
        content:
          "For both attached and detached accessory dwelling units (ADUs), the maximum allowable size is determined by the zoning district. In the R-1-8 and R-1-20 zoning districts, the maximum size permitted is 850 square feet for one-bedroom units and 1,000 square feet for units with more than one bedroom. In the R-1-44 zoning district, the size limits are 800 square feet for one-bedroom units and 1,200 square feet for units with two or more bedrooms.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    if (aduType === ADUType.ATTACHED) {
      // TODO
      // Attached ADU: Underlying zoning district
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the front setback requirement follows that of the underlying zoning district.",
      });
      devSpecs.frontSB = 20;
      devSpecs.rearSB = 20;
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.frontSB = 20;
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
    }

    // Height Limit
    if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 32;
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 16;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  }
}
