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
      devSpecs.maxSize = 800;
      // TODO
      // Up to 1,000 square feet or 50% of the floor area of the primary residence, whichever is less (may exceed 50% to permit 800 square feet unit).
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the maximum allowable size is up to 1,000 square feet or 50% of the floor area of the primary residence, whichever is less. However, the 50% limitation may be exceeded when necessary to allow for a unit of at least 800 square feet.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.frontSB = 20;
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    if (story === 2) {
      devSpecs.maxHeight = 20;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 15;
      // TODO
      // From ADU: 5ft
      findings.push({
        type: FindingType.INFO,
        content:
          "For separation requirements, an ADU must maintain a minimum distance of 15 feet from the primary building and at least 5 feet from any other ADU.",
      });
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    // TODO
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      // 1)Up to eight detached ADUs, not to exceed the number of primary units; and
      // 2) up to 25% of the existing units in the multifamily building through conversion of existing non-habitable space.
      // Example: An existing 12 unit apartment complex can develop a maximum eight (8) detached units, with an additional three (3) conversion units (12 * 25%) from existing, attached non-habitable space, for a total of eleven (11) ADUs.
      devSpecs.allowedAdus = 2;
      findings.push({
        type: FindingType.INFO,
        content:
          "Multifamily properties may add up to eight (8) detached ADUs (not exceeding the number of primary units) plus up to 25% of existing units through conversion of non-habitable space. Example: A 12-unit building could add 8 detached ADUs and 3 conversion ADUs, totaling 11.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 0;
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1000;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 800;
      // TODO
      // Up to 1,000 square feet or 50% of the floor area of the primary residence, whichever is less (may exceed 50% to permit 800 square feet unit).
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the maximum allowable size is up to 1,000 square feet or 50% of the floor area of the primary residence, whichever is less. However, the 50% limitation may be exceeded when necessary to allow for a unit of at least 800 square feet.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
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

    // Height Limit
    devSpecs.maxHeight = 20;

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 15;
      // TODO
      // From ADU: 5ft
      findings.push({
        type: FindingType.INFO,
        content:
          "For separation requirements, an ADU must maintain a minimum distance of 15 feet from the primary building and at least 5 feet from any other ADU.",
      });
    }
  }
}
