// panchanga.js

const AstroConsts = {
  THITHI_LENGTH: 12,
  YOGA_LENGTH: 13.3333333,
  KARANA_LENGTH: 6,
  MILLIS_IN_HR: 3600000,
  PAN_APPROXIMATION: 0.01
};

function getMoonSunDiff(sun, moon) {
  let diff = moon >= sun ? moon - sun : (moon + 360) - sun;
  if (diff > 180) diff -= 180;
  return diff;
}

const THITHI_NAMES = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dvadashi",
  "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
];

const THITHI_NAMES_TAMIL = {
  Pratipada: "பிரதமை",
  Dvitiya: "த்விதியை",
  Tritiya: "த்ரிதியை",
  Chaturthi: "சதுர்த்தி",
  Panchami: "பஞ்சமி",
  Shashthi: "ஷஷ்டி",
  Saptami: "ஸப்தமி",
  Ashtami: "அஷ்டமி",
  Navami: "நவமி",
  Dashami: "தசமி",
  Ekadashi: "ஏகாதசி",
  Dvadashi: "த்வாதசி",
  Trayodashi: "த்ரயோதசி",
  Chaturdashi: "சதுர்த்தசி",
  "Purnima/Amavasya": "பௌர்ணமி/அமாவாசை"
};

// Speeds are degrees per day, so bal / speed is in days: × 24 gives hours after the base clock time.
// The base ("timeZone" here) is the local clock time of the moment, in hours.
function findThithi(sun, moon, diffSpeed, timeZone) {
  const diff = getMoonSunDiff(sun, moon);
  const thithiIndex = Math.floor(diff / AstroConsts.THITHI_LENGTH);
  const bal = AstroConsts.THITHI_LENGTH - (diff % AstroConsts.THITHI_LENGTH);
  const endTime = (bal / diffSpeed) * 24 + timeZone;

  return { name: THITHI_NAMES[thithiIndex], endTime };
}

const YOGA_NAMES = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti"
];

const YOGA_NAMES_TAMIL = {
  Vishkambha: "விஷ்கம்ப",
  Priti: "ப்ரீதி",
  Ayushman: "ஆயுஷ்மான்",
  Saubhagya: "சௌபாக்யம்",
  Shobhana: "சோபனம்",
  Atiganda: "அதிகண்டம்",
  Sukarma: "சுகர்மா",
  Dhriti: "த்ருதி",
  Shoola: "சூலம்",
  Ganda: "கண்டம்",
  Vriddhi: "வ்ருத்தி",
  Dhruva: "த்ருவம்",
  Vyaghata: "வ்யாகாதம்",
  Harshana: "ஹர்ஷணம்",
  Vajra: "வஜ்ரம்",
  Siddhi: "சித்தி",
  Vyatipata: "வியதிபாதம்",
  Variyana: "வரியான்",
  Parigha: "பரிகம்",
  Shiva: "சிவம்",
  Siddha: "சித்தம்",
  Sadhya: "சாத்யம்",
  Shubha: "சுபம்",
  Shukla: "சுக்லம்",
  Brahma: "பிரம்மம்",
  Indra: "இந்திரம்",
  Vaidhriti: "வைதிருதி"
};

function findYoga(sun, moon, totalSpeed, timeZone) {
  const pos = (sun + moon) % 360;
  const yogaIndex = Math.floor(pos / AstroConsts.YOGA_LENGTH);
  const bal = AstroConsts.YOGA_LENGTH - (pos % AstroConsts.YOGA_LENGTH);
  const endTime = (bal / totalSpeed) * 24 + timeZone;

  return { name: YOGA_NAMES[yogaIndex], endTime };
}

const KARANA_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara",
  "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"
];

const KARANA_NAMES_TAMIL = {
  Bava: "பவ",
  Balava: "பலவ",
  Kaulava: "கௌலவ",
  Taitila: "தைதில",
  Gara: "கரஜ",
  Vanija: "வணிஜ",
  Vishti: "விஷ்டி",
  Shakuni: "சகுனி",
  Chatushpada: "சதுஷ்பாத",
  Naga: "நாக",
  Kimstughna: "கிம்ஸ்துக்ன"
};

const PAKSHA_TAMIL = {
  "Shukla Paksha": "சுக்ல பக்ஷ",
  "Krishna Paksha": "கிருஷ்ண பக்ஷ"
};

// The 60 half-tithis of a lunar month (6° of Moon−Sun each): 1 is Kimstughna, 2–57 cycle the
// 7 movable karanas (Bava … Vishti), 58 Shakuni, 59 Chatushpada, 60 Naga.
function karanaForHalfTithi(n) {
  if (n === 1) return "Kimstughna";
  if (n >= 58) return ["Shakuni", "Chatushpada", "Naga"][n - 58];
  return KARANA_NAMES[(n - 2) % 7];
}

function calcKarana(sun, moon, diffSpeed, thithiEnd, timeZone) {
  const elongation = ((moon - sun) % 360 + 360) % 360;   // full 0–360°, not folded at 180
  const half = Math.floor(elongation / AstroConsts.KARANA_LENGTH) + 1;   // 1..60
  const firstBal = AstroConsts.KARANA_LENGTH - (elongation % AstroConsts.KARANA_LENGTH);
  const firstEndTime = (firstBal / diffSpeed) * 24 + timeZone;
  const secondEndTime = firstEndTime + (AstroConsts.KARANA_LENGTH / diffSpeed) * 24;

  return {
    firstKarana: { name: karanaForHalfTithi(half), endTime: firstEndTime },
    secondKarana: { name: karanaForHalfTithi(half % 60 + 1), endTime: secondEndTime }
  };
}

function calcPaksha(sun, moon) {
  const elongation = ((moon - sun) % 360 + 360) % 360;   // handles the wrap at 0° Aries
  return elongation < 180 ? "Shukla Paksha" : "Krishna Paksha";
}

// panchanga.js

function calculatePanchanga(sunPosition, moonPosition, sunSpeed, moonSpeed, adjustedTimeZone) {
  const totalSpeed = sunSpeed + moonSpeed;
  const diffSpeed = moonSpeed - sunSpeed;

  const thithi = findThithi(sunPosition, moonPosition, diffSpeed, adjustedTimeZone);
  const yoga = findYoga(sunPosition, moonPosition, totalSpeed, adjustedTimeZone);
  const karana = calcKarana(sunPosition, moonPosition, diffSpeed, thithi.endTime, adjustedTimeZone);
  const paksha = calcPaksha(sunPosition, moonPosition);
  const nakshatraInfo = calculateNakshatraPada(moonPosition);

  return {
    thithi,
    yoga,
    karana,
    paksha,
    nakshatraInfo
  };
}

function displayPanchang(thithi, yoga, karana, paksha, nakshatraInfo) {
  const sentence = buildPanchangaSentence(thithi, yoga, karana, paksha, nakshatraInfo);
  const inlineLine = document.getElementById('panchangaLine');
  if (inlineLine) {
    inlineLine.textContent = sentence;
    return;
  }

  document.getElementById('panchangInfo').innerHTML = `
    <p>${sentence}</p>
  `;
}

function buildPanchangaSentence(thithi, yoga, karana, paksha, nakshatraInfo) {
  let thithiName = THITHI_NAMES_TAMIL[thithi.name] || thithi.name;
  // The 15th tithi is Purnima in the bright half, Amavasya in the dark half
  if (thithi.name === "Purnima/Amavasya") thithiName = paksha === "Shukla Paksha" ? "பௌர்ணமி" : "அமாவாசை";
  const yogaName = YOGA_NAMES_TAMIL[yoga.name] || yoga.name;
  const pakshaName = PAKSHA_TAMIL[paksha] || paksha;
  const karanaName = KARANA_NAMES_TAMIL[karana.firstKarana.name] || karana.firstKarana.name;
  const thithiEnd = formatPanchangaTime(thithi.endTime);
  const karanaEnd = formatPanchangaTime(karana.firstKarana.endTime);
  const yogaEnd = formatPanchangaTime(yoga.endTime);
  return `${nakshatraInfo.nakshatra} நக்ஷத்திரம் ${pakshaName} ${thithiName} திதி (${thithiEnd} வரை) ${karanaName} கரணம் (${karanaEnd} வரை) ${yogaName} யோகம் (${yogaEnd} வரை)`;
}

// Clock time of an end time given in hours from the birth day's midnight; later days are marked
function formatPanchangaTime(hoursValue) {
  const days = Math.floor(hoursValue / 24);
  const normalized = ((hoursValue % 24) + 24) % 24;
  const hh = Math.floor(normalized);
  const mm = Math.floor((normalized - hh) * 60);
  const dayMark = days === 1 ? ' மறுநாள்' : days > 1 ? ` +${days} நாள்` : '';
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}${dayMark}`;
}
