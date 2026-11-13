/*
  Navamsa (D9): pure calculations, no DOM.
*/

// Navamsa sign index (0 = Mesha … 11 = Meena) of a sidereal longitude. Each sign holds nine 3°20' parts; the count starts
// from Mesha for fire signs, Makara for earth, Thula for air and Kataka for water, which is (sign × 9 + part) mod 12.
function navamsaSignIndex(longitude) {
  var lon = ((longitude % 360) + 360) % 360;
  var sign = Math.floor(lon / 30);
  var part = Math.min(8, Math.floor((lon - sign * 30) / (10 / 3)));
  return (sign * 9 + part) % 12;
}

// Vargottama: the same sign in rasi and navamsa
function isVargottama(longitude) {
  var lon = ((longitude % 360) + 360) % 360;
  return navamsaSignIndex(lon) === Math.floor(lon / 30);
}
