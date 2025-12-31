import { check as checkSanJose } from "./aduCheckSanJose";
import { check as checkSantaClara } from "./aduCheckSantaClara";
import { check as checkCalifornia } from "./aduCheckCalifornia";
import { check as checkSunnyvale } from "./aduCheckSunnyvale";
import { check as checkMountainView } from "./aduCheckMountainView";
import { check as checkMilpitas } from "./aduCheckMilpitas";
import { check as checkPaloAlto } from "./aduCheckPaloAlto";
import { check as checkCupertino } from "./aduCheckCupertino";
import { check as checkMorganHill } from "./aduCheckMorganHill";
import { check as checkGilroy } from "./aduCheckGilroy";
import { check as checkCampbell } from "./aduCheckCampbell";
import { check as checkSaratoga } from "./aduCheckSaratoga";
import { check as checkLosAltos } from "./aduCheckLosAltos";
import { check as checkMonteSereno } from "./aduCheckMonteSereno";
import { check as checkPomona } from "./aduCheckPomona";
import { check as checkGardenGrove } from "./aduCheckGardenGrove";
import { check as checkSantaAna } from "./aduCheckSantaAna";
import { check as checkRanchoCucamonga } from "./aduCheckRanchoCucamonga";
import { check as checkChino } from "./aduCheckChino";
import { check as checkOntario } from "./aduCheckOntario";
import { check as checkFontana } from "./aduCheckFontana";
import { check as checkPerris } from "./aduCheckPerris";
import { check as checkRiverside } from "./aduCheckRiverside";
import { check as checkLosAngeles } from "./aduCheckLosAngeles";

export enum FindingType {
  PASS = "pass",
  INFO = "info",
  WARN = "warn",
  FAIL = "fail",
}

export type Finding = {
  type: FindingType;
  content: string;
};

export type DevSpecs = {
  allowedAdus: number;
  existAdus: number;
  minSize: number;
  maxSize: number;
  frontSB: number;
  sideSB: number;
  rearSB: number;
  maxHeight: number;
  maxStories: number;
  separation: number;
  rearYardFrontSB: number;
  mainHouseSqft: number;
  floodZone: string;
  historicResource: string;
  geohazardZones: string;
};

const cities = [
  "San Jose",
  "Santa Clara",
  "Sunnyvale",
  "Mountain View",
  "Milpitas",
  "Palo Alto",
  "Cupertino",
  "Morgan Hill",
  "Gilroy",
  "Campbell",
  "Saratoga",
  "Los Altos",
  "Monte Sereno",
  "Pomona",
  "Garden Grove",
  "Santa Ana",
  "Rancho Cucamonga",
  "Chino",
  "Ontario",
  "Fontana",
  "Perris",
  "Riverside",
  "Los Angeles",
];

function getCityByAddress(addr: string) {
  let res = "";
  if (!addr) {
    return res;
  }
  const parts = addr.split(",");
  if (parts?.length >= 2) {
    res = parts[1].trim();
  }
  return res;
}

// function getCity(address: string) {
//   const cityFromAddress = getCityByAddress(address).toLowerCase();
//   if (!address) return address;
//   for (const city of cities) {
//     if (cityFromAddress === city.toLowerCase()) {
//       return city;
//     }
//   }
//   return undefined;
// }

export enum ADUType {
  ATTACHED = "attached",
  DETACHED = "detached",
  JADU = "jadu",
}

export function getAduType(detached: boolean): ADUType {
  if (detached) return ADUType.DETACHED;
  else if (!detached) return ADUType.ATTACHED;
  return ADUType.JADU;
}

export enum ZoningType {
  SINGLE_FAMILY = "single-family",
  MULTI_FAMILY = "multi-family",
  BOTH = "both",
  UNKNOWN = "unknown",
}

export function getZoningType(
  zoningCode: string | null | undefined
): ZoningType {
  if (!zoningCode) return ZoningType.UNKNOWN;
  const code = zoningCode.toUpperCase();

  // Explicit known patterns
  if (
    /R-1/.test(code) ||
    /R1/.test(code) ||
    /RDL/.test(code) ||
    /RDM/.test(code) ||
    /RDH/.test(code)
  )
    return ZoningType.SINGLE_FAMILY; // R-1-8, R-1-6, etc.
  if (/R-2/.test(code) || /R2/.test(code) || /RAL/.test(code))
    return ZoningType.MULTI_FAMILY; // R-2 = duplex/multi
  if (
    /R-3/.test(code) ||
    /R3/.test(code) ||
    /R-4/.test(code) ||
    /R4/.test(code) ||
    /R-5/.test(code) ||
    /R5/.test(code) ||
    /R-6/.test(code) ||
    /R6/.test(code) ||
    /RM/.test(code) ||
    /MF/.test(code) ||
    /R-M/.test(code) ||
    /RAM/.test(code) ||
    /RAH/.test(code)
  )
    return ZoningType.MULTI_FAMILY; // multi-family patterns
  if (/MIXED/.test(code) || /MU/.test(code)) return ZoningType.BOTH; // mixed use

  return ZoningType.UNKNOWN; // fallback for unrecognized codes
}

function dualDiligenceV2(findings: Finding[], project?: any | null) {
  if (!project) {
    return;
  }
  const floodZone = project.floodZone;
  const alquistFault = project.alquist_fault;
  const landslide = project.landslide;
  const liquefaction = project.liquefaction;
  var missingField = [];
  if (floodZone === null) {
    missingField.push("flood zone");
  } else {
    if (["A", "AE", "AH", "AO"].includes(floodZone)) {
      findings.push({
        type: FindingType.WARN,
        content: "The property is in flood zone [" + floodZone + "].",
      });
    } else {
      findings.push({
        type: FindingType.PASS,
        content: "Not in flood zone",
      });
    }
  }

  if (alquistFault === null) {
    missingField.push("earthquake fault zone");
  } else {
    if (alquistFault) {
      findings.push({
        type: FindingType.WARN,
        content:
          "The property is in earthquake fault zone [" + floodZone + "].",
      });
    } else {
      findings.push({
        type: FindingType.PASS,
        content: "Not in earthquake fault zone",
      });
    }
  }

  if (landslide === null) {
    missingField.push("landslide fault zone");
  } else {
    if (landslide) {
      findings.push({
        type: FindingType.WARN,
        content: "The property is in landslide zone [" + floodZone + "].",
      });
    } else {
      findings.push({
        type: FindingType.PASS,
        content: "Not in landslide zone",
      });
    }
  }

  if (liquefaction === null) {
    missingField.push("liquefaction zone");
  } else {
    if (liquefaction) {
      findings.push({
        type: FindingType.WARN,
        content: "The property is in liquefaction zone [" + floodZone + "].",
      });
    } else {
      findings.push({
        type: FindingType.PASS,
        content: "Not in liquefaction zone",
      });
    }
  }

  function capFirstLetter(message: string) {
    return message.charAt(0).toUpperCase() + message.slice(1);
  }

  if (missingField.length > 0) {
    findings.push({
      type: FindingType.WARN,
      content: `${capFirstLetter(missingField.join("/"))} data ${
        missingField.length === 1 ? "is" : "are"
      } not available.`,
    });
  }
}

export function aduCheck(
  projectAddress: string,
  property: any,
  detached: boolean,
  story: number,
  devStandard: string,
  project?: any | null
) {
  // console.log("aduCheck", project);
  // console.log("adsadda", project.area);
  let devSpecs = {
    allowedAdus: 0,
    existAdus: 0,
    minSize: 150,
    maxSize: 1200,
    frontSB: 15,
    sideSB: 4,
    rearSB: 4,
    maxHeight: -1,
    maxStories: 2,
    separation: 6,
    rearYardFrontSB: 1000000, // as long as behind this front setback, it is considered rear yard, may not behind main house
    mainHouseSqft: 1000000, // a ridiculously large number as place holder
    floodZone: "",
    historicResource: "",
    geohazardZones: "",
  };
  let findings: Finding[] = [];
  const bedroomCount = project.bedrooms || 0;
  // console.log("bedroomCount", bedroomCount);
  const curCity = getCityByAddress(projectAddress);
  // console.log("curCity", project.address, "=>", curCity);
  // console.log("project", project);
  // call different check util for different city or state
  // only San Jose for now
  if (curCity === "San Jose") {
    checkSanJose(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Santa Clara") {
    checkSantaClara(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Sunnyvale") {
    checkSunnyvale(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Mountain View") {
    checkMountainView(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Milpitas") {
    checkMilpitas(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Palo Alto") {
    checkPaloAlto(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Cupertino") {
    checkCupertino(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings,
      bedroomCount
    );
  } else if (curCity === "Morgan Hill") {
    checkMorganHill(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Gilroy") {
    checkGilroy(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Campbell") {
    checkCampbell(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Saratoga") {
    checkSaratoga(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Los Altos") {
    checkLosAltos(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Monte Sereno") {
    checkMonteSereno(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Pomona") {
    checkPomona(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Garden Grove") {
    checkGardenGrove(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Santa Ana") {
    checkSantaAna(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Rancho Cucamonga") {
    checkRanchoCucamonga(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Chino") {
    checkChino(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Ontario") {
    checkOntario(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Fontana") {
    checkFontana(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Perris") {
    checkPerris(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Riverside") {
    checkRiverside(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  } else if (curCity === "Los Angeles") {
    checkLosAngeles(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  }

  if (
    devStandard &&
    typeof devStandard === "string" &&
    devStandard.toLowerCase() === "state"
  ) {
    checkCalifornia(
      property,
      detached,
      story,
      devStandard,
      project,
      devSpecs,
      findings
    );
  }
  if (curCity !== "San Jose") {
    dualDiligenceV2(findings, project);
  }
  // console.log(
  //   curCity,
  //   getZoningType(project?.zoning),
  //   detached,
  //   story,
  //   getAduType(detached),
  //   devStandard,
  //   devSpecs
  // );
  return {
    findings: findings,
    developmentSpecs: devSpecs,
  };
}
