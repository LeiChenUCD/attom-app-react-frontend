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
      devSpecs.maxSize = 900;
      // TODO
      // Less than the primary single-family dwelling on the lot or parcel
      findings.push({
        type: FindingType.INFO,
        content:
          "For both detached and attached ADUs, the maximum size must be less than 900 square feet and smaller than the primary single-family dwelling located on the lot or parcel.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;
    devSpecs.frontSB = 20;

    // Height Limit
    devSpecs.maxHeight = 28;

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 0;
    }
    // TODO
    // Conversion of non-habitable space for a minimum of one ADU or up to 25 percent of number of existing residential units
    findings.push({
      type: FindingType.INFO,
      content:
        "Conversion of non-habitable space is permitted to create a minimum of one accessory dwelling unit or up to 25 percent of the existing residential units on the property, whichever is greater.",
    });

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 850;
      // TODO
      // Studio or 1-bedroom: 850 sf
      // 2+-bedroom: 1000 sf
      findings.push({
        type: FindingType.INFO,
        content:
          "For detached ADUs, the maximum size is 850 square feet for studio or one-bedroom units, and 1,000 square feet for units with two or more bedrooms.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 850;
      // TODO
      // Studio or 1-bedroom: 850 sf
      // 2+-bedroom: 1000 sf
      // limited to 50% of floor area of existing primary dwelling
      findings.push({
        type: FindingType.INFO,
        content:
          "For attached ADUs, the maximum size is 850 square feet for studio or one-bedroom units, and 1,000 square feet for units with two or more bedrooms. Additionally, attached ADUs are limited to no more than 50% of the floor area of the existing primary dwelling.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
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

    // Height Limit
    devSpecs.maxHeight = 16;
    // TODO
    // Exceptions
    if (aduType === ADUType.DETACHED) {
      findings.push({
        type: FindingType.INFO,
        content:
          "A detached ADU on a lot with an existing or proposed single- or multi-family dwelling shall not exceed 16 feet in height, except as follows: it may be up to 18 feet tall if located within half a mile of a major transit stop or high-quality transit corridor, and up to 20 feet if necessary to match the roof pitch of the primary dwelling. Additionally, for lots with an existing or proposed multi-family dwelling of more than one story, detached ADUs may not exceed 18 feet in height.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      findings.push({
        type: FindingType.INFO,
        content:
          "An ADU attached to the primary dwelling shall not exceed 25 feet in height or the maximum height allowed by the underlying zoning district for the primary dwelling, whichever is lower. Additionally, such ADUs are limited to a maximum of two stories.",
      });
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  }
}
