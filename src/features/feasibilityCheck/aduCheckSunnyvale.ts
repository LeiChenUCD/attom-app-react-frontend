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
    if (aduType === ADUType.ATTACHED) {
      // TODO
      // Maximum size : 850 SQ FT (1 bedroom)
      // Interior space within existing SF home : no max
      // Interior space within proposed new home: No max.
      // Expansion of existing SF home to add an interior/attached ADU: Non streamlined SADUs  850 sf, or 1,000 sf with 2+ BR; not >50% of the existing home
      devSpecs.maxSize = 850;
      findings.push({
        type: FindingType.INFO,
        content:
          "For this property, the maximum ADU size is 850 sq ft for a one-bedroom unit. If expanding an existing single-family home to add an interior or attached ADU, non-streamlined SADUs are limited to 850 sq ft, or 1,000 sq ft for two or more bedrooms, and must not exceed 50% of the existing home's size.",
      });
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.minSize = 150;
      devSpecs.maxSize = 800;
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    // TODO
    // Attached:
    //  Existing setbacks
    //  Non Streamlines SADUs: 4 ft
    // Detached:
    //  Converted Existing Accessory Structure: Sufficient for fire safety
    //  Newly Built: 4ft
    //  Non Streamlined (over 800 sf): 4ft
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    if (story === 1) {
      devSpecs.maxHeight = 16;
    } else if (story === 2) {
      devSpecs.maxHeight = 28;
    }
    if (aduType === ADUType.ATTACHED) {
      // Attached
      // TODO
      // Attached:
      //  Interior space within existing SF home : existing height
      //  Interior space within proposed new home: No max. (within allowed SF height)
      //  Second story addition: Not Allowed
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 16;
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 5;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    }

    // Size
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      if (lotSize < 5500) {
        devSpecs.maxSize = 1000;
      } else {
        devSpecs.maxSize = 1200;
      }
    }

    // Setback
    // Detached:
    //  Interior space of existing/proposed home: Existing setbacks
    //  Home additions: 4 feet
    //  Detached (<800 sq ft, converted structure): sufficient for fire safety
    //  Detached (<800 sq ft, newly built): 4 feet, or if replacing an existing structure with setbacks less than 4 feet the same as that structure
    //  Detached (800+ sq ft): 4 feet
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    // TODO
    //  Interior space of existing/proposed home: For existing home, the height of the existing home; for ADUs within newly built homes, the allowable height for single family homes
    //  Home additions: 25’ or the height of primary dwelling, whichever is lower
    //  Detached (<800 sq ft, converted structure): existing height
    //  Detached (<800 sq ft, newly built): 18’ if on a lot within ½ mile of major transit stop or high quality transit corridor; otherwise 16’
    //  Detached (800+ sq ft): 18’ if on a lot within ½ mile of major transit stop or high quality transit corridor; otherwise 16’

    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 16;
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached ADUs under 800 sq ft that are converted from existing structures may keep the existing height. Newly built detached ADUs under 800 sq ft may be up to 18 feet if located within ½ mile of a major transit stop or high-quality transit corridor, and 16 feet otherwise. Detached ADUs over 800 sq ft follow the same 18-foot or 16-foot rule based on proximity to major transit.",
      });
    } else {
      devSpecs.maxHeight = 16;
      findings.push({
        type: FindingType.INFO,
        content:
          "For interior space within existing homes, the maximum height is the height of the existing home. For ADUs within newly built homes, the limit is the height allowed for single-family homes. For home additions, the limit is 25 feet or the height of the primary dwelling, whichever is lower.",
      });
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 5;
    }
  }
  if (aduType === ADUType.JADU) {
    devSpecs.maxSize = 500;
  } else {
    devSpecs.maxSize = 1000;
  }
  devSpecs.separation = 6;
}
