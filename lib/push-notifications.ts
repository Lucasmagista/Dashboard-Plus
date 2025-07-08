// push-notifications.ts
// Utilitário para registrar e solicitar permissão de push notification

export async function registerPushNotifications() {
  if (!('serviceWorker' in navigator)) return { supported: false };
  if (!('PushManager' in window)) return { supported: false };

  const registration = await navigator.serviceWorker.ready;
  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') return { supported: true, permission };

  // Exemplo: chave pública VAPID (substitua por sua chave real)
  const vapidPublicKey = '<SUA_CHAVE_PUBLICA_VAPID_AQUI>';
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });
  // Aqui você pode enviar a subscription para o backend
  return { supported: true, permission, subscription };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
