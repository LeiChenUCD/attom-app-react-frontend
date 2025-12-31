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
      // TODO
      // Ordinance ADU: 1200 sf
      // State ADU: 800 sf
      findings.push({
        type: FindingType.INFO,
        content: `For detached ADUs, the maximum size allowed varies by category: an Ordinance ADU may be up to 1,200 square feet, while a State ADU is limited to 800 square feet.`,
      });
    } else if (aduType === ADUType.ATTACHED) {
      // TODO
      // 50% of existing dwelling
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    devSpecs.maxHeight = 16;
    // If within 1/2 mi transit, 18 feet. Plus an additional 2 feet (total 20 feet) if roof pitch aligns w/ primary dwelling unit
    findings.push({
      type: FindingType.INFO,
      content: `An ADU may not exceed 16 feet in height, except that the maximum height may be increased to 18 feet if the property is located within one-half mile of a major transit stop or a high-quality transit corridor. An additional increase of up to 2 feet (for a total maximum height of 20 feet) is permitted if necessary to match the roof pitch of the primary dwelling.`,
    });

    // Separation
    devSpecs.separation = 6;
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      // TODO
      // min(8, 25% * #existing units)
      devSpecs.allowedAdus = 8;
    } else if (aduType === ADUType.ATTACHED) {
      devSpecs.allowedAdus = 1;
      findings.push({
        type: FindingType.INFO,
        content: `Attached ADUs may be developed up to 25% of the total number of existing dwelling units on the property.`,
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 1;
    }

    // Size
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      // TODO
      // 50% of existing dwelling, or none if new building
      findings.push({
        type: FindingType.INFO,
        content: `The maximum size for detached or attached ADUs is limited to 50% of the existing dwelling's floor area; however, no ADUs are permitted if the primary building is newly constructed.`,
      });
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;

    // Height Limit
    devSpecs.maxHeight = 16;
    findings.push({
      type: FindingType.INFO,
      content: `An ADU may not exceed 16 feet in height, except that the maximum height may be increased to 18 feet if the property is located within one-half mile of a major transit stop or a high-quality transit corridor.`,
    });

    // Separation
    if (aduType === ADUType.DETACHED) {
      devSpecs.separation = 6;
      // TODO
      // ADUs <= 800 sf: 6
      // ADUs > 800: 10
      findings.push({
        type: FindingType.INFO,
        content: `Separation requirements specify a minimum distance of 6 feet for ADUs that are 800 square feet or less, and 10 feet for ADUs larger than 800 square feet.`,
      });
    }
  }
}
