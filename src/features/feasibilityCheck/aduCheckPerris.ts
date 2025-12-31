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
      // Studio or 1-bedroom: 850 sf
      // More than 1-bedroom: min(1200, 75% of primary dwelling)
      findings.push({
        type: FindingType.INFO,
        content: `Detached ADUs are limited to 850 square feet for studios and one-bedroom units. For units with more than one bedroom, the maximum size is 1,200 square feet or 75% of the primary dwelling's floor area, whichever is less.`,
      });
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 850;
      // TODO
      // Studio or 1-bedroom: 850 sf
      // More than 1-bedroom: 1000 sf
      findings.push({
        type: FindingType.INFO,
        content: `Attached ADUs are limited to a maximum size of 850 square feet for studio or one-bedroom units. For units with more than one bedroom, the maximum size allowed is 1,000 square feet.`,
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;
    devSpecs.frontSB = 20;

    // Height Limit
    devSpecs.maxHeight = 16;
    // TODO
    // Shall not exceed 16 feet above grade or the height of the first-floor ridgeline, whichever is greater.
    findings.push({
      type: FindingType.INFO,
      content: `The height limit for the structure shall not exceed 16 feet above grade or the height of the first-floor ridgeline, whichever is greater.`,
    });

    // Separation
    // distance requirements between structures and other standards established by the underlying zoning may be applied so long as application of the requirements does not prohibit the construction of an ADU with a floor area that is 800 square feet or less, or a peak height above grade that is no more than 16 feet, or with side and rear yard setbacks that are no less than four feet.
    findings.push({
      type: FindingType.INFO,
      content: `Separation and other zoning requirements may apply to ADUs, provided they do not prevent the construction of an ADU that is 800 square feet or less, has a maximum peak height of 16 feet above grade, and maintains side and rear yard setbacks of at least four feet.`,
    });
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 1;
      // TODO
      // If no detached ADUs or converted existing space ADUs can be built on the site, one attached ADU is permitted.
      findings.push({
        type: FindingType.INFO,
        content: `If no detached ADUs or converted existing space ADUs can be built on the site, one attached ADU is permitted.`,
      });
    }

    // Size
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 850;
      // TODO
      // Studios and one-bedroom units: 850 sq ft.
      // More than one-bedroom units: 1,000 sq ft.
      findings.push({
        type: FindingType.INFO,
        content: `Both detached and attached ADUs are limited to 850 square feet for studio and one-bedroom units. For units with more than one bedroom, the maximum allowed size is 1,000 square feet.`,
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // setback
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;
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
    // Shall not exceed 16 feet above grade or the height of the first-floor ridgeline, whichever is greater.
    findings.push({
      type: FindingType.INFO,
      content: `The height limit for the structure shall not exceed 16 feet above grade or the height of the first-floor ridgeline, whichever is greater.`,
    });

    // Separation
    // distance requirements between structures and other standards established by the underlying zoning may be applied so long as application of the requirements does not prohibit the construction of an ADU with a floor area that is 800 square feet or less, or a peak height above grade that is no more than 16 feet, or with side and rear yard setbacks that are no less than four feet.
    findings.push({
      type: FindingType.INFO,
      content: `Separation and other zoning requirements may apply to ADUs, provided they do not prevent the construction of an ADU that is 800 square feet or less, has a maximum peak height of 16 feet above grade, and maintains side and rear yard setbacks of at least four feet.`,
    });
  }
}
