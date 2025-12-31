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
      devSpecs.existAdus = 1;
    } else if (aduType === ADUType.JADU) {
      devSpecs.existAdus = 1;
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1000;
    } else if (aduType === ADUType.ATTACHED) {
      // Not to exceed 50% of primary dwelling gross floor area (excluding garage); except that a minimum 850 square foot one-bedroom or 1,000 square foot two or more-bedroom ADU is permitted regardless of primary dwelling gross floor area.
      devSpecs.maxSize = 850;
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs cannot exceed 50% of the primary dwelling's gross floor area (excluding the garage); however, a minimum size of 850 sq ft for one-bedroom units or 1,000 sq ft for two or more bedrooms is permitted regardless of the primary dwelling's size.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    // TODO
    // Front:
    //  Outside of front yard setback unless necessary to accommodate at least an 800 square foot unit.
    findings.push({
      type: FindingType.INFO,
      content:
        "Front setbacks generally apply, but may be waived if needed to accommodate an ADU of at least 800 square feet.",
    });
    devSpecs.rearSB = 4;
    devSpecs.sideSB = 4;

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 16;
      // TODO
      // Other condition
      // Other condition:
      //  18’ for a detached unit within one-half of one-mile walking distance of a major transit stop or a high-quality transit corridor.
      //  24’ if above a detached garage.
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached units can be up to 18 feet tall if located within half a mile of a major transit stop or high-quality transit corridor, and up to 24 feet tall if built above a detached garage.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxHeight = 25;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // TODO
    // Number:
    //  Detached / Attached ADU:
    //   must not exceed twenty-five percent (25%) of the existing multi-family dwelling units or one (1) unit, whichever is greater
    //   may also construct up to a maximum of two (2) detached ADUs on a lot zoned for and developed with an existing or proposed duplex or multi-family dwelling.
    if (aduType === ADUType.ATTACHED || aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 1;
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached and attached ADUs must not exceed 25% of the number of existing multi-family dwelling units or one unit, whichever is greater. Additionally, a maximum of two detached ADUs may be constructed on a lot zoned for and developed with an existing or proposed duplex or multi-family dwelling.",
      });
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1000;
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // Maximum size :
      //  Not to exceed 50% of primary dwelling gross floor area (excluding garage); except that a minimum 850 square foot one-bedroom or 1,000 square foot two or more-bedroom ADU is permitted regardless of primary dwelling gross floor area
      devSpecs.maxSize = 850;
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs cannot exceed 50% of the primary dwelling's gross floor area (excluding the garage); however, a minimum size of 850 sq ft for one-bedroom units or 1,000 sq ft for two or more bedrooms is permitted regardless of the primary dwelling's size.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    // TODO
    // Front:
    //  Outside of front yard setback unless necessary to accommodate at least an 800 square foot unit.
    findings.push({
      type: FindingType.INFO,
      content:
        "Front setbacks generally apply, but may be waived if needed to accommodate an ADU of at least 800 square feet.",
    });
    devSpecs.rearSB = 4;
    devSpecs.sideSB = 4;

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 16;
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached units may be up to 18 feet tall if located within half a mile of a major transit stop or high-quality transit corridor, or if the lot contains an existing or proposed multi-family, multi-story dwelling.",
      });
    }
    // TODO
    // Other condition:
    //  18’ for a detached unit within one-half of one-mile walking distance of a major transit stop or a high-quality transit corridor.
    //  18’ for a detached unit on a lot with an existing or proposed multi-family, multi-story dwelling
  }
}
