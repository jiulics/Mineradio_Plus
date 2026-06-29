const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
const mainPath = path.join(__dirname, '..', 'desktop', 'main.js');
const preloadPath = path.join(__dirname, '..', 'desktop', 'preload.js');
const serverPath = path.join(__dirname, '..', 'server.js');
const html = fs.readFileSync(indexPath, 'utf8');
const mainJs = fs.readFileSync(mainPath, 'utf8');
const preloadJs = fs.readFileSync(preloadPath, 'utf8');
const serverJs = fs.readFileSync(serverPath, 'utf8');

function assertIncludes(needle, description) {
  if (!html.includes(needle)) throw new Error(`Missing ${description}: ${needle}`);
}
function assertFileIncludes(content, needle, description) {
  if (!content.includes(needle)) throw new Error(`Missing ${description}: ${needle}`);
}
function assertNotIncludes(needle, description) {
  if (html.includes(needle)) throw new Error(`Unexpected ${description}: ${needle}`);
}
function functionBody(name) {
  const marker = `function ${name}`;
  const start = html.indexOf(marker);
  if (start < 0) throw new Error(`Missing function: ${name}`);
  const braceStart = html.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < html.length; i += 1) {
    const ch = html[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return html.slice(braceStart, i + 1);
    }
  }
  throw new Error(`Unclosed function body: ${name}`);
}
function assertFunctionIncludes(functionName, needle, description) {
  const body = functionBody(functionName);
  if (!body.includes(needle)) throw new Error(`Missing ${description} in ${functionName}: ${needle}`);
}
function assertFunctionNotIncludes(functionName, needle, description) {
  const body = functionBody(functionName);
  if (body.includes(needle)) throw new Error(`Unexpected ${description} in ${functionName}: ${needle}`);
}
function assertBefore(left, right, description) {
  const li = html.indexOf(left);
  const ri = html.indexOf(right);
  if (li < 0) throw new Error(`Missing left marker for ${description}: ${left}`);
  if (ri < 0) throw new Error(`Missing right marker for ${description}: ${right}`);
  if (li > ri) throw new Error(`Wrong order for ${description}: ${left} must appear before ${right}`);
}
function assertFunctionEntryCall(functionName, needle, description) {
  const body = functionBody(functionName).trim();
  const withoutClosingBrace = body.slice(0, -1).trim();
  if (!withoutClosingBrace.endsWith(needle)) throw new Error(`Missing final entry call for ${description} in ${functionName}: ${needle}`);
}

assertNotIncludes('施工', 'old construction placeholder');
assertIncludes('id="home-local-time"', 'local time display');
assertIncludes('id="home-local-date"', 'local date display');
assertIncludes('id="home-weather-location"', 'weather location display');
assertIncludes('id="home-weather-summary"', 'weather summary display');
assertIncludes('id="home-now-playing"', 'Home now-playing card');
assertIncludes('class="home-weather-actions"', 'Home weather action row');
assertIncludes('重新定位', 'weather locate action');
assertIncludes('更换城市', 'weather city action');
assertIncludes('开启天气电台', 'weather radio action');
assertIncludes('展开播放器控制台', 'player console action');
assertIncludes('home-weather-actions{display:grid', 'compact weather action grid');
assertIncludes('minmax(0,1fr)', 'weather actions use stable grid tracks');
assertBefore('class="home-weather-actions"', 'id="home-now-playing"', 'weather actions remain visible above now playing');
assertIncludes('function renderHomeWeatherHero', 'home weather hero renderer');
assertIncludes('function renderHomeNowPlaying', 'Home now-playing renderer');
assertIncludes('function updateHomeWeatherAtmosphere', 'audio-reactive weather atmosphere updater');
assertIncludes('--weather-beat', 'weather atmosphere audio sync CSS variable');
assertIncludes('id="home-wave-track"', 'home audio waveform DOM');
assertIncludes('updateHomeAudioVisual(dt)', 'home waveform animation loop hook');

assertNotIncludes('id="current-queue-stack"', 'rejected current playback stack overlay DOM');
assertNotIncludes('#current-queue-stack', 'rejected current playback stack overlay CSS');
assertNotIncludes('function renderCurrentQueueStack', 'rejected current playback stack renderer');
assertNotIncludes('function syncCurrentQueueStack', 'rejected current playback stack sync');
assertNotIncludes('function setCurrentQueueStackHidden', 'rejected current playback stack visibility setter');
assertNotIncludes('function toggleCurrentQueueStackVisibility', 'rejected current playback stack top toggle');
assertIncludes('function toggleHomeRightVisibility', 'Home right-side visibility toggle');
assertIncludes('function setHomeRightHidden', 'Home right-side visibility setter');
assertIncludes('home-right-hidden', 'Home right-side hidden state class');
assertIncludes('显示/隐藏 Home 右侧内容', 'Home right-side toggle label');
assertFunctionIncludes('showPlaybackQueueSide', 'safeRenderQueuePanel', 'playback sync updates existing queue panels');
assertFunctionIncludes('showPlaybackQueueSide', 'setPlaybackQueueSideActive(true)', 'playback sync enables queue shelf mode');
assertFunctionIncludes('showPlaybackQueueSide', 'shelfManager.focusCurrentQueue(currentIdx)', 'playback sync centers queue shelf current track');
assertFunctionIncludes('showPlaybackQueueSide', 'setShelfPinnedOpen(true, true)', 'playback queue pins the stable 3D shelf');
assertFunctionIncludes('currentItems', 'if (playbackQueueSideActive && !emptyHomeActive && playQueue.length) return queueShelfItems();', '3D shelf shows current playback queue while playing');
assertFunctionNotIncludes('syncPlaybackRightSide', 'syncCurrentQueueStack', 'playback sync must not update rejected queue stack');
assertIncludes("syncPlaybackRightSide({ reason: 'play-queue-at'", 'playback sync call from playQueueAt');
assertIncludes("forceQueue: !opts.preserveHomeState", 'playback switches right shelf to current queue outside Home');

assertIncludes('navigator.geolocation.getCurrentPosition', 'GPS-first weather location');
assertIncludes('东莞市松山湖', 'default Songshan Lake weather city');
assertFileIncludes(serverJs, "name: '东莞市松山湖'", 'server default Songshan Lake weather location');
assertFileIncludes(serverJs, 'latitude: 22.921', 'server default Songshan Lake latitude');
assertFileIncludes(serverJs, 'longitude: 113.895', 'server default Songshan Lake longitude');
assertIncludes('readHomeWeatherCity()', 'weather city localStorage migration');
assertIncludes('function homeWeatherManualCityValue', 'manual city dialog value helper');
assertFunctionIncludes('openWeatherCityDialog', 'homeWeatherManualCityValue()', 'manual city dialog avoids GPS display labels');
assertFunctionIncludes('applyWeatherCity', 'saveHomeWeatherCity(city)', 'manual city update persists real city');
assertIncludes('GPS 获取失败，请手动更新', 'GPS failure manual update prompt');
assertIncludes('locationSource', 'weather location source state');
assertIncludes('function isTransientWeatherCity', 'transient GPS weather city guard');
assertIncludes("city === 'GPS 定位'", 'GPS label is not treated as a saved city');
assertFunctionNotIncludes('loadHomeWeatherRadio', 'localStorage.setItem(HOME_WEATHER_CITY_KEY, homeWeatherRadioState.city);', 'blindly saving transient weather city labels');
assertIncludes('function useDesktopSystemLocation', 'desktop system GPS helper');
assertIncludes('desktopWindow.getSystemLocation', 'desktop system GPS bridge call');
assertFunctionIncludes('locateWeatherRadio', 'useDesktopSystemLocation()', 'weather location tries native desktop GPS before browser GPS');
assertFunctionIncludes('locateWeatherRadio', 'useGpsLocation()', 'weather location keeps browser GPS fallback');
assertFunctionEntryCall('locateWeatherRadio', 'useDesktopSystemLocation();', 'desktop GPS is the weather location entrypoint');
assertFunctionNotIncludes('locateWeatherRadio', "homeWeatherRadioState.city = previousWeatherCity && previousWeatherCity !== '定位中' ? previousWeatherCity : '当前位置';", 'GPS success reusing stale weather city');
assertFunctionNotIncludes('locateWeatherRadio', "showToast(sourceLabel + ' 定位成功')", 'premature GPS success toast before weather update');
assertFunctionIncludes('locateWeatherRadio', "showToast(sourceLabel + ' 已获取，正在更新天气')", 'GPS coordinate acquired toast');
assertFunctionIncludes('loadHomeWeatherRadio', "showToast(gpsLabel + ' 天气已更新')", 'GPS weather update success toast');
assertFunctionIncludes('locateWeatherRadio', "city: 'GPS 定位'", 'GPS weather request uses neutral GPS city label');
assertIncludes('locationCoordinateLabel', 'GPS coordinate display helper');
assertIncludes('locationDisplayName', 'GPS place display helper');
assertIncludes('location.displayName || location.name', 'weather card prefers resolved GPS place name');
assertFileIncludes(serverJs, '经纬度定位', 'coordinate-based weather location metadata');
assertFileIncludes(serverJs, "source: 'gps'", 'coordinate-based weather source metadata');
assertFileIncludes(serverJs, 'OSM_REVERSE_GEOCODE_URL', 'reverse geocoding endpoint');
assertFileIncludes(serverJs, 'resolveReverseWeatherLocation', 'reverse geocoding helper');
assertFileIncludes(serverJs, 'nominatim.openstreetmap.org/reverse', 'OSM reverse geocoding provider');
assertFileIncludes(serverJs, 'HttpsProxyAgent', 'server HTTPS proxy support');
assertFileIncludes(serverJs, 'proxyAgentForUrl', 'server request proxy helper');
assertFileIncludes(serverJs, 'displayName', 'weather response includes human readable place');
assertFileIncludes(serverJs, 'admin2', 'weather response includes district/county metadata');
assertFileIncludes(serverJs, 'admin3', 'weather response includes town/suburb metadata');
assertIncludes('function openWeatherCityDialog', 'in-app city dialog');
assertNotIncludes("window.prompt('输入城市名'", 'browser prompt city changer');
assertIncludes('function weatherRadioProviderPreference', 'weather radio provider preference helper');
assertIncludes("params.push('providers=' + encodeURIComponent(weatherRadioProviderPreference().join(',')))", 'weather radio sends provider preference');
assertIncludes('function trialBannerTextForPlayback', 'provider-aware trial banner text');
assertFileIncludes(mainJs, "const LOCAL_MINERADIO_HOSTS = new Set(['127.0.0.1', 'localhost', '::1']);", 'local geolocation permission host allowlist');
assertFileIncludes(mainJs, "ipcMain.handle('mineradio-system-location'", 'desktop system location IPC');
assertFileIncludes(mainJs, 'Windows.Devices.Geolocation.Geolocator', 'Windows Runtime geolocation usage');
assertFileIncludes(mainJs, '[Permission] geolocation', 'geolocation permission diagnostic log');
assertFileIncludes(preloadJs, "getSystemLocation: () => ipcRenderer.invoke('mineradio-system-location')", 'desktop system location preload bridge');

assertFunctionNotIncludes('goHome', 'dismissHomePage({ toast: true })', 'Home button closing Home instead of returning to Home');
assertFunctionIncludes('goHome', 'renderHomeNowPlaying()', 'Home refreshes now-playing state');
assertFunctionIncludes('goHome', 'setHomeRightToggleAvailable', 'Home refreshes right-side toggle state');
assertIncludes('var homeShelfSuppressed = emptyHomeActive;', 'Home always suppresses 3D shelf library cards');
assertFunctionIncludes('nextTrack', "playQueueAt(currentIdx, { preserveHomeState: keepHome })", 'next track keeps the home surface visible when already on home');
assertFunctionIncludes('prevTrack', "playQueueAt(currentIdx, { preserveHomeState: keepHome })", 'previous track keeps the home surface visible when already on home');
assertIncludes("playQueueAt(0, { preserveHomeState: true, userInitiatedQueue: true }).catch(function(e){ console.warn('[HomeDailyPlay]', e); });", 'home daily playback keeps the home surface visible and restores queue');
assertIncludes("playQueueAt(currentIdx, { preserveHomeState: true, userInitiatedQueue: true }).catch(function(e){ console.warn('[HomeSongPlay]', e); });", 'home song card playback keeps the home surface visible and restores queue');
assertIncludes('await playQueueAt(0, { context: activeRadioContext, preserveHomeState: true, userInitiatedQueue: true });', 'weather radio start keeps the home surface visible and restores queue');
assertIncludes('await playQueueAt(index, { context: activeRadioContext, preserveHomeState: true, userInitiatedQueue: true });', 'weather song playback keeps the home surface visible and restores queue');

console.log('home weather and Home right-side visibility checks passed');
