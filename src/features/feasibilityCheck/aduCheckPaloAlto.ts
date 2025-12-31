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
    if (aduType === ADUType.ATTACHED || aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 1;
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 1;
    }

    // Size
    if (aduType === ADUType.ATTACHED || aduType === ADUType.DETACHED) {
      // TODO
      // 900 SQ FT 1 bedroom or 1,000 SQ FT for 2 or more bedrooms
      devSpecs.maxSize = 900;
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached and detached ADUs can be up to 900 sq ft for one-bedroom units, or 1,000 sq ft for units with two or more bedrooms.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    if (aduType === ADUType.DETACHED) {
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
    }

    // Height Limit
    if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 25;
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 45;
      // TODO
      // OS zones: 30 FT max
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 2;
    }

    // Size
    devSpecs.minSize = 150;
    devSpecs.maxSize = Number.MAX_SAFE_INTEGER;
    if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    if (aduType === ADUType.ATTACHED) {
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
      if (
        project?.zoning.toLowerCase().includes("R-2") ||
        project?.zoning.toLowerCase().includes("R2")
      ) {
        devSpecs.frontSB = 15;
      } else {
        devSpecs.frontSB = 10;
      }
    }

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      // TODO
      // Detached: max. height is 16 ft 18 ft if within 1/2 mile from transit or if existing dwelling is multi-story
      devSpecs.maxHeight = 16;
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached ADUs have a maximum height of 16 feet, or 18 feet if located within half a mile of transit or if the existing dwelling is multi-story.",
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
  devSpecs.separation = 6;
}
