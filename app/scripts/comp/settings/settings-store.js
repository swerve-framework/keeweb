import { Launcher } from 'comp/launcher';
import { StringFormat } from 'util/formatting/string-format';
import { Logger } from 'util/logger';
import swerve from 'swerve';

const logger = new Logger('settings');

const SettingsStore = {
    load(key) {
        let loadPromise;
        if (Launcher) {
            loadPromise = Launcher.loadConfig(key);
        } else {
            loadPromise = swerve
                .ready()
                .then(() => {
                    const data = localStorage[StringFormat.camelCase(key)];
                    return data ? Uint8Array.from(atob(data), (c) => c.charCodeAt(0)) : null;
                })
                .then((data) => (data ? swerve.decrypt(data) : null))
                .then((data) => {
                    return data ? new TextDecoder().decode(data) : null;
                });
        }
        return loadPromise
            .then((data) => (data ? JSON.parse(data) : null))
            .catch((err) => {
                logger.error(`Error loading ${key}`, err);
            });
    },

    save(key, data) {
        if (Launcher) {
            return Launcher.saveConfig(key, JSON.stringify(data)).catch((err) => {
                logger.error(`Error saving ${key}`, err);
            });
        }
        return swerve.ready().then(() => {
            if (typeof localStorage !== 'undefined') {
                return swerve
                    .encrypt(new TextEncoder().encode(JSON.stringify(data)))
                    .then((blob) => {
                        const reader = new FileReader();
                        return new Promise((resolve) => {
                            reader.addEventListener('load', () => {
                                localStorage[StringFormat.camelCase(key)] = btoa(reader.result);
                                resolve();
                            });
                            reader.readAsBinaryString(blob);
                        });
                    });
            }
        });
    }
};

export { SettingsStore };
