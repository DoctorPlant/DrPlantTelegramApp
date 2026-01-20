import {
  setDebug,
  themeParams,
  initData,
  viewport,
  init as initSDK,
  mockTelegramEnv,
  retrieveLaunchParams,
  emitEvent,
  miniApp,
  backButton,
} from '@tma.js/sdk-react';

type TgThemeParams = Partial<Record<string, `#${string}`>>;

function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

function toTgThemeParams(input: unknown): TgThemeParams {
  if (!input || typeof input !== 'object') return {};

  const out: Record<string, `#${string}` | undefined> = {};

  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    // В sdk-react значения часто являются signals/computed: это функции без аргументов.
    const value = typeof v === 'function' ? (v as () => unknown)() : v;

    // theme_params в Telegram — в основном цвета '#RRGGBB'. Пропускаем всё, что не похоже на это.
    if (typeof value === 'string' && value.startsWith('#')) {
      out[camelToSnake(k)] = value as `#${string}`;
    } else if (value === undefined) {
      out[camelToSnake(k)] = undefined;
    }
  }

  return out;
}

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(options: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
}): Promise<void> {
  // Set @telegram-apps/sdk-react debug mode and initialize it.
  setDebug(options.debug);
  initSDK();

  // Add Eruda if needed.
  options.eruda && void import('eruda').then(({ default: eruda }) => {
    eruda.init();
    eruda.position({ x: window.innerWidth - 50, y: 0 });
  });

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  if (options.mockForMacOS) {
    let firstThemeSent = false;
    mockTelegramEnv({
      onEvent(event, next) {
        if (event.name === 'web_app_request_theme') {
          const tp: TgThemeParams = firstThemeSent
              ? toTgThemeParams(themeParams.state())
              : (retrieveLaunchParams().tgWebAppThemeParams ?? {});

          firstThemeSent = true;
          return emitEvent('theme_changed', { theme_params: tp });
        }

        if (event.name === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', { left: 0, top: 0, right: 0, bottom: 0 });
        }

        next();
      },
    });
  }

  // Mount all components used in the project.
  backButton.mount.ifAvailable();
  initData.restore();

  if (miniApp.mount.isAvailable()) {
    themeParams.mount();
    miniApp.mount();
    themeParams.bindCssVars();
  }

  if (viewport.mount.isAvailable()) {
    viewport.mount().then(() => {
      viewport.bindCssVars();
    });
  }
}