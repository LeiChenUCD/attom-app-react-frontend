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
      devSpecs.maxSize = 1200;
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // Maximum size :
      //  Up to 850 SQ FT (Studio or 1-bedroom)
      //  Up to 1,000 SQ FT (2 or more bedrooms)
      devSpecs.maxSize = 850;
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs can be up to 850 sq ft for studios or one-bedroom units, and up to 1,000 sq ft for units with two or more bedrooms.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    // TODO
    // Front: Same as Primary Home
    findings.push({
      type: FindingType.INFO,
      content: "The front setback for the ADU is the same as the primary home.",
    });
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    // TODO
    // Detached ADUs may not exceed the height of the primary home, except that a minimum allowable height of 18-feet is permitted. Attached and interior ADUs must comply with the height maximum applicable to the primary home. (CL: 25)
    findings.push({
      type: FindingType.INFO,
      content:
        "Detached ADUs may not exceed the height of the primary home, except that a minimum allowable height of 18-feet is permitted. Attached and interior ADUs must comply with the height maximum applicable to the primary home.",
    });

    // Separation
    // TODO
    // Behind: 10 FT
    // front: 10 FT
    // side: 5 FT
    findings.push({
      type: FindingType.INFO,
      content:
        "ADUs require a separation of 10 feet at the front and rear, and 5 feet on the sides.",
    });
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 1;
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 1;
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1200;
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // Maximum size :
      //  Up to 850 SQ FT (Studio or 1-bedroom)
      //  Up to 1,000 SQ FT (2 or more bedrooms)
      devSpecs.maxSize = 850;
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs can be up to 850 sq ft for studios or one-bedroom units, and up to 1,000 sq ft for units with two or more bedrooms.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    // TODO
    // Front: Same as Primary Home
    findings.push({
      type: FindingType.INFO,
      content: "The front setback for the ADU is the same as the primary home.",
    });
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    // TODO
    // Detached ADUs may not exceed the height of the primary home, except that a minimum allowable height of 18-feet is permitted. Attached and interior ADUs must comply with the height maximum applicable to the primary home. (CL: 25)
    findings.push({
      type: FindingType.INFO,
      content:
        "Detached ADUs may not exceed the height of the primary home, except that a minimum allowable height of 18-feet is permitted. Attached and interior ADUs must comply with the height maximum applicable to the primary home.",
    });

    // Separation
    // TODO
    // Behind: 10 FT
    // front: 10 FT
    // side: 5 FT
    findings.push({
      type: FindingType.INFO,
      content:
        "ADUs require a separation of 10 feet at the front and rear, and 5 feet on the sides.",
    });
  }
  devSpecs.separation = 10;
}
