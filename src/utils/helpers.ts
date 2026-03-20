export function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
export function capitalize(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const CHROME_IOS_REGEXP = /CriOS/i;
const isServer = typeof window === 'undefined';

function isIOS() {
  return (
    !isServer &&
    typeof window.webkit !== 'undefined' &&
    typeof window.webkit.messageHandlers !== 'undefined' &&
    !CHROME_IOS_REGEXP.test(window.navigator.userAgent)
  );
}

function isAndroid() {
  return !isServer && typeof window.Android !== 'undefined';
}

export function sendMessage(message: Record<string, string>) {
  const payload = {
    androidPayload: JSON.stringify(message),
    iosPayload: message,
  };
  console.log(payload);

  if (isAndroid()) {
    window.Android?.postMessage(JSON.stringify(message));
    console.log('@@@ [android] postMessage sent', JSON.stringify(message));
    return;
  }

  if (isIOS()) {
    window.webkit?.messageHandlers?.inDrive?.postMessage(message);
    console.log('@@@ [ios] postMessage sent', message);
    return;
  }

  window.postMessage(message, '*');
}