url = "https://{URL_API}";

configStorage = {
    platform: 'XXXXXX', // Save last date where registred code
    lastDayGenerated: 'XXXXXX', // Save last date where the code was generated
    totalGenerated: 'XXXXXX' // Total code generated
};

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    instances = M.FormSelect.init(elems);
});

async function getRandomCode() {
    document.querySelector('.progress-random-code').style.display = 'block';

    if(await validateGenerator()) {
        const platform = document.querySelector('select').value;
        const response = await fetch(
            `${url}/${platform}`, {
                mode: 'cors',
                method: 'GET'
            }
        );

        const result = await response.text();
        document.querySelector('#random_code').value = result;
        await registerGenerator();
    } else {
        M.toast({html: 'Haz generado el número maximo de códigos diarios', classes: 'red'});
    }

    document.querySelector('.progress-random-code').style.display = 'none';
}

async function registerCode() {
    let code = document.querySelector('#register_code').value;
    code = code.split(' ').join(''); 
    if(!code || code === '') {
        M.toast({html: 'Código invalido', classes: 'red'});
        return;
    }

    const platform = document.querySelector('select').value;
    document.querySelector('.progress-register-code').style.display = 'block';

    if(await validateRegistrator(platform)) {
        const response = await fetch(
            `${url}/${platform}/${code}`, {
                mode: 'cors',
                method: 'POST'
            }
        );
    
        const result = await response.text();
        if(result.toString() === false) {
            M.toast({html: 'Error al guardar el código', classes: 'red'});
        } else {
            M.toast({html: 'Código guardado con existo', classes: 'green'});
            document.querySelector('#register_code').value = '';

            await registerRegistrator(platform);
        }
    } else {
        M.toast({html: 'Ya registraste código para esta plataforma', classes: 'red'});
    }

    document.querySelector('.progress-register-code').style.display = 'none';
}

async function registerGenerator() {
    let total = 0;
    if( configStorage.lastDayGenerated in localStorage &&
        configStorage.totalGenerated in localStorage) {
            
        const totalGeneratedStorage = localStorage.getItem(configStorage.totalGenerated);
        total = 0;
        if(totalGeneratedStorage) {
            total = parseInt(totalGeneratedStorage) + 1;
        }
    }

    localStorage.removeItem(configStorage.totalGenerated);
    localStorage.removeItem(configStorage.lastDayGenerated);

    localStorage.setItem(configStorage.totalGenerated, total);
    localStorage.setItem(configStorage.lastDayGenerated,  new Date().getDay());
}

async function validateGenerator() {
    if( configStorage.lastDayGenerated in localStorage &&
        configStorage.totalGenerated in localStorage) {
            
        const lastDayStorage = localStorage.getItem(configStorage.lastDayGenerated);
        const totalGeneratedStorage = localStorage.getItem(configStorage.totalGenerated);

        let total = 0;
        if(totalGeneratedStorage) {
            total = parseInt(totalGeneratedStorage);
        } 

        if(total < 2) {
            return true;
        } else {
            if(lastDayStorage !== new Date().getDay().toString()) {
                await resetGenerator();
                return true;
            } else {
                return false;
            }
        }
    }

    return true;
}

async function resetGenerator() {
    localStorage.setItem(configStorage.totalGenerated, 0);
}

async function registerRegistrator(platform) {
    localStorage.removeItem(`${configStorage.platform}_${platform}`);
    localStorage.setItem(`${configStorage.platform}_${platform}`, platform);
}

async function validateRegistrator(platform) {
    const platformStorage = localStorage.getItem(`${configStorage.platform}_${platform}`);

    if(!platformStorage) {
        return true;
    }

    return false;
}