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
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
      // TODO
      // JADU: 50% of the existing primary dwelling structure or 500 square feet, whichever is less
      findings.push({
        type: FindingType.INFO,
        content:
          "Junior Accessory Dwelling Units (JADUs) may be up to 50% of the existing primary dwelling's floor area or 500 square feet, whichever is less.",
      });
    }

    // Setback
    // TODO
    // Front: Same as main building
    findings.push({
      type: FindingType.INFO,
      content:
        "The front setback for the ADU must be the same as that of the main building.",
    });
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    if (story === 1) {
      devSpecs.maxHeight = 16;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    } else {
      // TODO
      // (b)One, but not both, of the following options is permitted on a lot with an existing multifamily residence:
      //  (i)The amount of accessory dwelling units allowed within a multifamily dwelling structure shall be equal to twenty-five percent of the amount of units in the multifamily dwelling structure, provided that fractional units shall be rounded down and at least one accessory dwelling unit shall be allowed in each multifamily dwelling structure. For example, one accessory dwelling unit is allowed in a multifamily dwelling structure with seven or fewer units; two accessory dwelling units are allowed in a multifamily dwelling structure with eight to eleven units; and three accessory dwelling units are allowed in a multifamily dwelling structure with twelve units.
      // max(1, floor(25% * #units))
      //  (ii)No more than two detached accessory dwelling units are allowed on a lot with an existing multifamily residence.
      findings.push({
        type: FindingType.INFO,
        content:
          "The number of accessory dwelling units permitted within a multifamily dwelling structure shall equal twenty-five percent of the existing units, with fractional units rounded down. However, each multifamily dwelling structure is allowed a minimum of one accessory dwelling unit. For example, a building with seven or fewer units may have one ADU; eight to eleven units may have two ADUs; and twelve units may have three ADUs.",
      });
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1200;
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
      // TODO
      // JADU: 50% of the existing primary dwelling structure or 500 square feet, whichever is less
      findings.push({
        type: FindingType.INFO,
        content:
          "Junior Accessory Dwelling Units (JADUs) may be up to 50% of the existing primary dwelling's floor area or 500 square feet, whichever is less.",
      });
    }

    // Setback
    // TODO
    // Front: Same as main building
    findings.push({
      type: FindingType.INFO,
      content:
        "The front setback for the ADU must be the same as that of the main building.",
    });
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height
    if (story === 1) {
      devSpecs.maxHeight = 16;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  }
}
