const d = document;
const textareaOrigen = d.getElementById("texto-encriptar");
const textareaDestino = d.getElementById("texto-desencriptar");
const cubierta = d.getElementById("cubierta");

// Letras minúsculas y espacios solamente
const REGEX_FILTRO = /[A-Z~!@#$%^&*()_+|}{[\]\\\/?=><:"`;.,áéíóúàèìòù'1-9]/g;

// Diccionario de encriptación (fácil de mantener)
const LLAVES = {
    "e": "enter",
    "i": "imes",
    "a": "ai",
    "o": "ober",
    "u": "ufat"
};


const foco = () => textareaOrigen.focus();

const limpiar = () => {
    textareaOrigen.value = "";
    textareaDestino.value = "";
    foco();
};

const actualizarInterfaz = () => {
    const tieneContenido = textareaDestino.value.trim() !== "";
    cubierta.style.opacity = tieneContenido ? "0" : "1";
    cubierta.style.visibility = tieneContenido ? "hidden" : "visible";
    
    if (tieneContenido) {
        $(".animacion").fadeIn(1000).fadeOut(2000);
    }
};

function validarTexto() {
    const texto = textareaOrigen.value;
    if (texto.match(REGEX_FILTRO)) {
        Swal.fire({
            title: '<span style="font-family: Raleway; font-weight: 800;">¡Cuidado!</span>',
            text: 'Solo letras minúsculas y sin acentos',
            imageUrl: './images/DrawKit Vector Illustration Fun & Playful Finn Character (14).svg',
            imageWidth: 150,
            imageHeight: 150,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#38424C',
            borderRadius: '30px'
        });
        limpiar();
        return false;
    }
    return true;
}

function procesarTexto(modo) {
    if (!validarTexto()) return;

    let texto = textareaOrigen.value.trimStart();
    if (texto === "") return;

    if (modo === 'encriptar') {
        texto = texto.replace(/[eiaou]/g, i => LLAVES[i]);
    } else {
        // Invertimos el diccionario para desencriptar
        const llavesInversas = Object.fromEntries(Object.entries(LLAVES).map(([k, v]) => [v, k]));
        const pattern = new RegExp(Object.values(LLAVES).join('|'), 'g');
        texto = texto.replace(pattern, i => llavesInversas[i]);
    }

    textareaDestino.value = texto;
    textareaDestino.style.color = "#000000";
    actualizarInterfaz();
}

async function copiar() {
    const texto = textareaDestino.value;

    if (texto.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: '¡Vaya!',
            text: 'No hay nada que copiar',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    try {
        await navigator.clipboard.writeText(texto);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            background: '#bbffd0',
            color: '#38424C'
        });
        Toast.fire({ icon: 'success', title: '¡Copiado!' });
        
        borrar(); // Limpia todo después de copiar satisfactoriamente
    } catch (err) {
        console.error("Error al copiar", err);
    }
}

function borrar() {
    textareaOrigen.placeholder = "Ingrese el texto aquí...";
    textareaDestino.placeholder = "";
    limpiar();
    actualizarInterfaz();
}

d.getElementById("btn-encriptar").addEventListener("click", () => procesarTexto('encriptar'));
d.getElementById("btn-desencriptar").addEventListener("click", () => procesarTexto('desencriptar'));
d.getElementById("btn-copiar").addEventListener("click", copiar);
d.getElementById("btn-borrar-1").addEventListener("click", borrar);
d.getElementById("btn-borrar-2").addEventListener("click", borrar);

// Inicio
foco();