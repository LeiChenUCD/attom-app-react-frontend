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
    if (aduType === ADUType.DETACHED) {
      if (lotSize <= 5500) {
        devSpecs.maxSize = 1000;
      } else {
        devSpecs.maxSize = 1200;
      }
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.minSize = 150;
      devSpecs.maxSize = 1000; // 1,000 sq. Ft or 50% of the size of the main unit.
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }
    // Setback
    if (aduType === ADUType.DETACHED) {
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
      // TODO: Corner Side: min 4 ft
      devSpecs.separation = 6;
      if (story > 1) {
        devSpecs.rearSB = 15;
      }
    } else if (aduType === ADUType.ATTACHED) {
      // TODO: Front: meet the setbacks for the subject zone
      devSpecs.frontSB = 20;
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
      // TODO: Corner Side: min 4 ft
    }

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      if (story === 1) {
        devSpecs.maxHeight = 18;
      } else if (story === 1.5) {
        devSpecs.maxHeight = 25;
      }
    } else if (aduType === ADUType.ATTACHED) {
      if (story === 2) {
        devSpecs.maxHeight = 25;
      }
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    devSpecs.allowedAdus = 2;

    // Size
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      if (lotSize <= 5500) {
        devSpecs.maxSize = 1000;
      } else {
        devSpecs.maxSize = 1200;
      }
    }

    // Setback
    if (aduType === ADUType.ATTACHED) {
      // TODO: Front: meet the setbacks for the subject zone
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
      devSpecs.rearSB = 15;
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.rearSB = 4;
      devSpecs.sideSB = 4;
      devSpecs.separation = 6;
      if (story > 1) {
        devSpecs.rearSB = 15;
      }
    }

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      if (story === 1) {
        devSpecs.maxHeight = 18;
      } else if (story === 1.5) {
        devSpecs.maxHeight = 25;
      }
    } else if (aduType === ADUType.ATTACHED) {
      if (story === 2) {
        devSpecs.maxHeight = 25;
      }
    }

    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  }
}
