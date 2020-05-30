url = "https://{URL_API}"

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    instances = M.FormSelect.init(elems);
});

async function getRandomCode() {
    document.querySelector('.progress-random-code').style.display = 'block';

    const platform = document.querySelector('select').value;
    const response = await fetch(
        `${url}/${platform}`, {
            mode: 'cors',
            method: 'GET'
        }
    );

    const result = await response.text();
    document.querySelector('#random_code').value = result;
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
    }

    document.querySelector('.progress-register-code').style.display = 'none';
}