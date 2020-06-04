import { Config } from './config';

export class InternalStorage {
    async registerGenerator() {
        let total = 0;
        if( Config.LAST_DAY_GENERATED_KEY in localStorage &&
            Config.TOTAL_GENERATED_KEY in localStorage) {
                
            const totalGeneratedStorage = localStorage.getItem(Config.TOTAL_GENERATED_KEY);
            total = 0;
            if(totalGeneratedStorage) {
                total = parseInt(totalGeneratedStorage) + 1;
            }
        }
    
        localStorage.removeItem(Config.TOTAL_GENERATED_KEY);
        localStorage.removeItem(Config.LAST_DAY_GENERATED_KEY);
    
        localStorage.setItem(Config.TOTAL_GENERATED_KEY, total);
        localStorage.setItem(Config.LAST_DAY_GENERATED_KEY,  new Date().getDay());
    }
    
    async validateGenerator() {
        if( Config.LAST_DAY_GENERATED_KEY in localStorage &&
            Config.TOTAL_GENERATED_KEY in localStorage) {
                
            const lastDayStorage = localStorage.getItem(Config.LAST_DAY_GENERATED_KEY);
            const totalGeneratedStorage = localStorage.getItem(Config.TOTAL_GENERATED_KEY);
    
            let total = 0;
            if(totalGeneratedStorage) {
                total = parseInt(totalGeneratedStorage);
            } 
            
            if(total < 10) {
                return true;
            } else {
                if(lastDayStorage !== new Date().getDay().toString()) {
                    await this.#resetGenerator();
                    return true;
                } else {
                    return false;
                }
            }
        }
    
        return true;
    }
    
    async registerRegistrator(platform) {
        localStorage.removeItem(`${Config.PLATFORM_KEY}_${platform}`);
        localStorage.setItem(`${Config.PLATFORM_KEY}_${platform}`, platform);
    }
    
    async validateRegistrator(platform) {
        const platformStorage = localStorage.getItem(`${Config.PLATFORM_KEY}_${platform}`);
    
        if(!platformStorage) {
            return true;
        }
    
        return false;
    }

    async #resetGenerator() {
        localStorage.setItem(Config.TOTAL_GENERATED_KEY, 0);
    }
}