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
    if (aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 1000;
      // TODO
      // min(max(800, 50% * primary dwelling's floor area), 1000)
      findings.push({
        type: FindingType.INFO,
        content: `Must be at least 800 sq ft or 50% of the primary dwelling's floor area, whichever is greater, but no more than 1,000 sq ft.`,
      });
    } else if (aduType === ADUType.DETACHED) {
      devSpecs.maxSize = 1000;
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
    devSpecs.sideSB = 4;
    devSpecs.rearSB = 4;
    devSpecs.frontSB = 20;

    // Height Limit
    devSpecs.maxHeight = 16;

    // Separation
    // Separation of buildings or structures shall comply with Title 25 of the California Code of Regulations, as may be amended
    findings.push({
      type: FindingType.INFO,
      content: `Separation of buildings or structures shall comply with Title 25 of the California Code of Regulations, as may be amended.`,
    });
  } else if (zoningType === ZoningType.MULTI_FAMILY) {
    // Number
    if (aduType === ADUType.DETACHED) {
      devSpecs.allowedAdus = 2;
    } else if (aduType === ADUType.JADU) {
      devSpecs.allowedAdus = 1;
    }

    // Size
    if (aduType === ADUType.DETACHED || aduType === ADUType.ATTACHED) {
      devSpecs.maxSize = 1000;
    } else if (aduType === ADUType.JADU) {
      devSpecs.maxSize = 500;
    }

    // Setback
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

    // Separation
    // Separation of buildings or structures shall comply with Title 25 of the California Code of Regulations, as may be amended
    findings.push({
      type: FindingType.INFO,
      content: `Separation of buildings or structures shall comply with Title 25 of the California Code of Regulations, as may be amended.`,
    });
  }
}
