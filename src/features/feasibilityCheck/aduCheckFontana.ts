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

    // size
    if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 1200;
      // TODO
      // Up to 50% of the sf of the main house, 1200 sf max
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs may be up to 50% of the square footage of the main house, with a maximum size of 1,200 square feet.",
      });
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 800;
      // TODO
      // Limited Detached - Requires Building Permit - 800 sf max
      // Requires ADU permit + Building Permit - 800 - 1200 must be allowed
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached ADUs up to 800 square feet are considered limited detached units and require a building permit. Detached ADUs between 800 and 1,200 square feet require both an ADU permit and a building permit.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;
    devSpecs.frontSB = 18;
    // TODO
    // Limited detached: front setback = 0
    if (aduType === ADUType.DETACHED) {
      findings.push({
        type: FindingType.INFO,
        content:
          "The front setback for standard ADUs is 18 feet. However, limited detached ADUs may have a front setback of zero feet.",
      });
    }

    // Height Limit
    devSpecs.maxHeight = 16;
    // TODO
    // 16-18 ft high max. (see Sec. 30-467 of the FMC)
    if (aduType === ADUType.DETACHED) {
      findings.push({
        type: FindingType.INFO,
        content: `A detached ADU generally cannot exceed 16 feet in height. If located within half a mile of a major transit stop or high-quality corridor, it may reach 18 feet, or up to 20 feet to match the primary dwelling's roof pitch.`,
      });
    } else if (aduType === ADUType.ATTACHED) {
      findings.push({
        type: FindingType.INFO,
        content: `An ADU attached to the primary dwelling shall not exceed 25 feet in height or the maximum height allowed by the underlying zoning for the primary dwelling, whichever is less. Additionally, such ADUs are limited to a maximum of two stories.`,
      });
    }

    // Separation
    devSpecs.separation = 15;
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 1;
      // TODO
      // max(1, floor(25% of total units on site))
      findings.push({
        type: FindingType.INFO,
        content: `The number of attached ADUs permitted cannot exceed 25% of the total existing units on site, with a minimum of one ADU allowed.`,
      });
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 800;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = Number.MAX_VALUE;
    }

    // Setback
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;
    devSpecs.frontSB = 18;

    // Height Limit
    devSpecs.maxHeight = 16;
    if (aduType === ADUType.DETACHED) {
      findings.push({
        type: FindingType.INFO,
        content: `Except as otherwise provided, a detached ADU on a lot with an existing or proposed single-family or multi-family dwelling may not exceed 16 feet in height. If located within half a mile of a major transit stop or high-quality transit corridor, the height limit increases to 18 feet, or up to 20 feet to accommodate a roof pitch matching the primary dwelling. Detached ADUs on lots with multi-family dwellings having more than one story above grade are limited to 18 feet in height.`,
      });
    } else if (aduType === ADUType.ATTACHED) {
      findings.push({
        type: FindingType.INFO,
        content: `An ADU attached to the primary dwelling shall not exceed 25 feet in height or the maximum height allowed by the underlying zoning for the primary dwelling, whichever is less. Additionally, such ADUs are limited to a maximum of two stories.`,
      });
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 15;
    }
  }
}
