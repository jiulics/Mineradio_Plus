const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

function assertIncludes(needle, description) {
  if (!html.includes(needle)) {
    throw new Error(`Missing ${description}: ${needle}`);
  }
}

function assertNotIncludes(needle, description) {
  if (html.includes(needle)) {
    throw new Error(`Unexpected ${description}: ${needle}`);
  }
}

assertNotIncludes('此处施工，敬请期待', 'old construction placeholder');
assertIncludes('id="home-local-time"', 'local time display');
assertIncludes('id="home-local-date"', 'local date display');
assertIncludes('id="home-weather-location"', 'weather location display');
assertIncludes('id="home-weather-summary"', 'weather summary display');
assertIncludes('function updateHomeWeatherClock', 'home weather clock updater');
assertIncludes('function renderHomeWeatherHero', 'home weather hero renderer');
assertIncludes('function syncPlaybackRightSide', 'right-side playback sync hook');
assertIncludes('focusCurrentTrack: function', '3D detail current-track focus API');
assertIncludes('safePlaybackStep(\'right-side-sync\'', 'playback sync call from playQueueAt');
assertIncludes('navigator.geolocation.getCurrentPosition', 'GPS-first weather location');
assertIncludes('syncPlaybackRightSide({ reason: \'content-open-sync\'', '3D detail sync after content load');
assertNotIncludes("safeShelfCloseContent('content-play-row')", 'auto closing 3D detail when playing a row');
assertNotIncludes("safeShelfRebuild('content-play-row'", 'rebuilding 3D shelf when playing a detail row');
assertIncludes('东莞市松山湖', 'default Songshan Lake weather city');
assertIncludes('readHomeWeatherCity()', 'weather city localStorage migration');
assertIncludes('GPS 获取失败，请手动更新', 'GPS failure manual update prompt');
assertIncludes('function updateHomeWeatherAtmosphere', 'audio-reactive weather atmosphere updater');
assertIncludes('--weather-beat', 'weather atmosphere audio sync CSS variable');

console.log('home weather and right-side sync checks passed');
