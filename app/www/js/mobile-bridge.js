// Mobile App Native Bridge for Handi-pro
// Handles Camera/Gallery, Network Offline states, Safe Intent links, and Splash screen

document.addEventListener('DOMContentLoaded', async () => {
  setupOfflineDetection();
  setupMobileLinks();
  setupNativeMediaUpload();
  hideSplashScreenSafely();
});

// 1. Hide Splash Screen cleanly when web UI is ready
async function hideSplashScreenSafely() {
  try {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {
      setTimeout(async () => {
        await window.Capacitor.Plugins.SplashScreen.hide();
      }, 500);
    }
  } catch (e) {
    console.log('SplashScreen plugin note:', e);
  }
}

// 2. Offline / Online Network Detection with Offline Banner & Screen
function setupOfflineDetection() {
  const offlineBanner = document.createElement('div');
  offlineBanner.id = 'offlineBanner';
  offlineBanner.className = 'offline-banner hidden';
  offlineBanner.innerHTML = '<i class="fa-solid fa-wifi-slash"></i> You are currently offline. Check your internet connection.';
  document.body.prepend(offlineBanner);

  function updateStatus(isOnline) {
    if (!isOnline) {
      offlineBanner.classList.remove('hidden');
    } else {
      offlineBanner.classList.add('hidden');
      const fullScreenOffline = document.getElementById('offlineFullScreen');
      if (fullScreenOffline) fullScreenOffline.remove();
    }
  }

  // Use Capacitor Network plugin if present, otherwise browser events
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Network) {
    window.Capacitor.Plugins.Network.getStatus().then(status => {
      updateStatus(status.connected);
    });
    window.Capacitor.Plugins.Network.addListener('networkStatusChange', status => {
      updateStatus(status.connected);
    });
  } else {
    window.addEventListener('online', () => updateStatus(true));
    window.addEventListener('offline', () => updateStatus(false));
    updateStatus(navigator.onLine);
  }
}

// 3. Native Intent Linking for Phone Calls and WhatsApp
function setupMobileLinks() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (!target) return;

    const href = target.getAttribute('href');
    if (!href) return;

    // Handle tel: links cleanly
    if (href.startsWith('tel:')) {
      // Let native OS phone dialer take over directly
      return;
    }

    // Handle whatsapp links cleanly
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      // Ensure target opens without blocking native deep-linking
      target.setAttribute('target', '_system');
    }
  });
}

// 4. Native Camera / Photo Gallery Integration
function setupNativeMediaUpload() {
  const profileInput = document.getElementById('profileImage');
  const portfolioInput = document.getElementById('portfolioImages');

  if (!window.Capacitor || !window.Capacitor.Plugins || !window.Capacitor.Plugins.Camera) {
    // Standard web browser fallback continues functioning
    return;
  }

  const Camera = window.Capacitor.Plugins.Camera;

  // Enhance Profile Image with Native Camera / Photo Prompt if available
  if (profileInput) {
    const container = profileInput.parentElement;
    const nativeBtn = document.createElement('button');
    nativeBtn.type = 'button';
    nativeBtn.className = 'btn btn-secondary';
    nativeBtn.style.marginTop = '8px';
    nativeBtn.style.display = 'inline-flex';
    nativeBtn.style.alignItems = 'center';
    nativeBtn.style.gap = '8px';
    nativeBtn.innerHTML = '<i class="fa-solid fa-camera"></i> Take Photo or Pick from Gallery';

    nativeBtn.addEventListener('click', async () => {
      try {
        const photo = await Camera.getPhoto({
          quality: 85,
          allowEditing: false,
          resultType: 'dataUrl',
          source: 'PROMPT' // Lets user choose between Camera and Photos
        });

        if (photo && photo.dataUrl) {
          // Convert dataUrl to a File object and set on profileInput
          const res = await fetch(photo.dataUrl);
          const blob = await res.blob();
          const file = new File([blob], 'camera-profile.jpg', { type: 'image/jpeg' });

          const dt = new DataTransfer();
          dt.items.add(file);
          profileInput.files = dt.files;

          nativeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Photo Selected (' + Math.round(blob.size / 1024) + ' KB)';
          nativeBtn.style.borderColor = '#22c55e';
          nativeBtn.style.color = '#22c55e';
        }
      } catch (err) {
        console.log('Camera dismissed or failed:', err);
      }
    });

    container.appendChild(nativeBtn);
  }
}
