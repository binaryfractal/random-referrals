import { Config } from './config';
import { InternalStorage } from './storage';

import '../assets/images/binaryfractal.png'
import '../assets/fonts/Avalon.ttf'
import '../assets/fonts/AvalonBold.ttf'
import '../styles.css';

document.addEventListener('DOMContentLoaded', async function() {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    await getRanking();
});

const btnGenerator = document.querySelector("#btn_generator");
btnGenerator.addEventListener('click', async function(event) {
    event.preventDefault(); 
    await getRandomCode();
});

const btnRegistrator = document.querySelector('#btn_registrator');
btnRegistrator.addEventListener('click', async function(event) {
    event.preventDefault(); 
    await registerCode();
});

const selectPlatform = document.querySelector('select');
selectPlatform.addEventListener('change', async function(event) {
    event.preventDefault();

    const collection = document.querySelector(".collection");
    collection.innerHTML = '';

    const ranking = document.querySelector("#ranking");
    ranking.style.display = 'none';

    await getRanking();
})

async function getRandomCode() {
    document.querySelector('.progress-random-code').style.display = 'block';

    const storage = new InternalStorage();
    if(await storage.validateGenerator()) {
        const platform = document.querySelector('select').value;
        const response = await fetch(
            `${Config.URL}/${platform}`, {
                mode: 'cors',
                method: 'GET'
            }
        );

        const result = await response.text();
        if(!result) {
            M.toast({html: `Todavía no hay códigos para ${platform}`, classes: 'red'});
            document.querySelector('.progress-random-code').style.display = 'none';
            return;
        }
            
        document.querySelector('#random_code').value = result; 
        document.querySelector('#random_code_hide').value = result;
        await storage.registerGenerator();
        
        const copyText = document.getElementById('random_code_hide');
        copyText.focus();
        document.execCommand('SelectAll');
        document.execCommand("Copy", false, null);
        
        M.toast({html: `Se ha copiado el código: ${copyText.value}`, classes: 'green'});
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

    const storage = new InternalStorage();
    if(await storage.validateRegistrator(platform)) {
        const response = await fetch(
            `${Config.URL}/${platform}/${code}`, {
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

            await storage.registerRegistrator(platform);
        }
    } else {
        M.toast({html: 'Ya registraste código para esta plataforma', classes: 'red'});
    }

    document.querySelector('.progress-register-code').style.display = 'none';
}

async function getRanking() {
    const platform = document.querySelector('select').value;
    const response = await fetch(
        `${Config.URL}/${platform}/ranking/10`, {
            mode: 'cors',
            method: 'GET'
        }
    );

    const collection = document.querySelector(".collection");
    const results = await response.json();

    if(results.length > 0) {
        const ranking = document.querySelector("#ranking");
        ranking.style.display = 'block';

        for(let result of results) {
            collection.innerHTML += `<a href="#!" class="collection-item"><span class="badge blue white-text">${result.count}</span>${result.code}</a>`;
        }
    } 
}