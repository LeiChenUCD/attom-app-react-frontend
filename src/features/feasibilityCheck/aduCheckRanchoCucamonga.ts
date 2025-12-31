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
      devSpecs.minSize = 350;
      devSpecs.maxSize = 1200;
      // TODO
      // Maximum size: 1200 square feet (but it may be limited to 800 square feet to comply with lot coverage requirements)
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached ADUs may be up to 1,200 square feet, but size may be reduced to 800 square feet if required to meet lot coverage limits.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.minSize = 220;
      devSpecs.maxSize = 1200;
      // TODO
      // Maximum size: 50% of main dwelling unit or 1200 square feet, whichever is less
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs may be up to 50% of the main dwelling's floor area or 1,200 square feet, whichever is less.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.rearSB = 4;
    devSpecs.sideSB = 4;

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      // TODO
      // Maximum Height: 16 feet, unless within 1/2 mile of transit stop, then cannot exceed 18 feet (or 20 feet to match the roof pitch of primary structure). For properties with multi-story, multi-family dwellings, height cannot exceed 18 feet.
      devSpecs.maxHeight = 16;
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached ADUs may have a maximum height of 16 feet. This limit increases to 18 feet if the property is within one-half mile of a transit stop or contains multi-story, multi-family dwellings. A height of up to 20 feet is permitted when necessary to match the roof pitch of the primary structure.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // Cannot exceed the height of the primary structure or 16 feet, whichever is higher. If ADU is constructed above a garage, it cannot exceed the height limits of the underlying zone.
      devSpecs.maxHeight = 16;
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs may not exceed the height of the primary structure or 16 feet, whichever is greater. If constructed above a garage, the height is limited to the maximum allowed under the underlying zoning district.",
      });
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    } else if (aduType === ADUType.ATTACHED) {
      // 2 detached ADUs and at least one interior ADU are permitted (up to 25% of the number of existing units in the multi-family dwelling)
      findings.push({
        type: FindingType.INFO,
        content:
          "A maximum of two detached ADUs and at least one interior ADU are permitted, with interior units limited to no more than 25% of the existing units within the multi-family dwelling.",
      });
    }

    // Size
    if (aduType === ADUType.DETACHED) {
      devSpecs.minSize = 350;
      devSpecs.maxSize = 1200;
      // TODO
      // Maximum size: 1200 square feet (but it may be limited to 800 square feet to comply with lot coverage requirements)
      findings.push({
        type: FindingType.INFO,
        content:
          "Detached ADUs may be up to 1,200 square feet, but size may be reduced to 800 square feet if required to meet lot coverage limits.",
      });
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.minSize = 220;
      devSpecs.maxSize = 1200;
      // TODO
      // Maximum size: 50% of main dwelling unit or 1200 square feet, whichever is less
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs may be up to 50% of the main dwelling's floor area or 1,200 square feet, whichever is less.",
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.rearSB = 4;
    devSpecs.sideSB = 4;

    // Height Limit
    if (aduType === ADUType.DETACHED) {
      devSpecs.maxHeight = 18;
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // Cannot exceed the height of the primary structure or 16 feet, whichever is higher. If ADU is constructed above a garage, it cannot exceed the height limits of the underlying zone.
      devSpecs.maxHeight = 16;
      findings.push({
        type: FindingType.INFO,
        content:
          "Attached ADUs may not exceed the height of the primary structure or 16 feet, whichever is greater. If constructed above a garage, the height is limited to the maximum allowed under the underlying zoning district.",
      });
    }

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
    }
  }
}
