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
    // located in the front setback: 800 SQ FT
    // located within required setbacks: 1000 SQ FT
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1200;
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // cannot exceed 50% of the existing or concurrently approved living area of the main home, with a maximum size of 1,200 square feet, not including the garage
      devSpecs.maxSize = 1200;
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs may be no larger than 50% of the existing or concurrently approved living area of the main home (excluding the garage). The total size cannot exceed 1,200 square feet.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    findings.push({
      type: FindingType.INFO,
      content:
        "If the ADU is located within the required setbacks, it may be up to 1,000 square feet. If it is located in the front setback, the maximum size is 800 square feet.",
    });

    // Setback
    devSpecs.rearSB = 4;
    devSpecs.sideSB = 4;
    // TODO
    // Above existing garage: 5 FT rear and side
    findings.push({
      type: FindingType.INFO,
      content:
        "For ADUs built above an existing garage, the required setback is 5 feet from the rear and side property lines.",
    });

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 18;
      // 16 ft. on single-family lots when located within required setback
      // 18 ft. on multi-family lot, or single-family lot within 1/2-mile walking distance to transit stop, or on any lot when ADU is located outside required setbacks
      findings.push({
        type: FindingType.INFO,
        content:
          "For detached ADUs, the maximum height is 16 feet on single-family lots when located within the required setbacks. The limit increases to 18 feet on multi-family lots, on single-family lots within one-half mile walking distance of a transit stop, or on any lot where the ADU is located outside the required setbacks.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 25;
      // Maximum 25 ft., or maximum applied to main home, whichever is lower
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the height may not exceed 25 feet or the maximum height allowed for the main home, whichever is lower.",
      });
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 2;
    }

    // Size
    // located in the front setback: 800 SQ FT
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1200;
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // cannot exceed 50% of the existing or concurrently approved living area of the main home, with a maximum size of 1,200 square feet, not including the garage
      devSpecs.maxSize = 1200;
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs may be no larger than 50% of the existing or concurrently approved living area of the main home (excluding the garage). The total size cannot exceed 1,200 square feet.",
      });
    }

    findings.push({
      type: FindingType.INFO,
      content:
        "If the ADU is located in the front setback, the maximum size is 800 square feet.",
    });

    // Setback
    devSpecs.rearSB = 4;
    devSpecs.sideSB = 4;
    // TODO
    // Above existing garage: 5 FT rear and side
    findings.push({
      type: FindingType.INFO,
      content:
        "For ADUs built above an existing garage, the required setback is 5 feet from the rear and side property lines.",
    });

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 18;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 25;
      // Maximum 25 ft., or maximum applied to main home, whichever is lower
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the height may not exceed 25 feet or the maximum height allowed for the main home, whichever is lower.",
      });
    }

    // Separation
    devSpecs.separation = 6;
  }
}
