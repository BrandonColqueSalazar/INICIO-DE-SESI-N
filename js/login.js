const PREFIX = 'auth_v1_';

let usuarios = JSON.parse(localStorage.getItem(PREFIX + 'usuarios')) || {};
let intentosFallidos = JSON.parse(localStorage.getItem(PREFIX + 'intentos')) || {};

// Función mostrar mensaje
function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    mensaje.style.display = 'block';
    setTimeout(() => mensaje.style.display = 'none', 5000);
}

// Toggle contraseña
function togglePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    input.type = input.type === 'password' ? 'text' : 'password';
    toggle.textContent = input.type === 'password' ? '👁️' : '🙈';
}

// Actualizar contados de intentos
function actualizarIntentos() {
    const usuario = document.getElementById('loginUsuario').value.trim();
    document.getElementById('intentos').textContent = `Intentos: ${intentosFallidos[usuario] || 0}/3`;
}

// Event listeners
document.getElementById('toggleLogin').addEventListener('click', () => 
    togglePassword('loginPassInput', 'toggleLogin')
);

document.getElementById('loginUsuario').addEventListener('input', actualizarIntentos);

document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('loginUsuario').value.trim();
    const pass = document.getElementById('loginPassInput').value;
    
    // Usuario no existe
    if (!usuarios[usuario]) {
        mostrarMensaje('Usuario o contraseña incorrectos', 'error');
        actualizarIntentos();
        return;
    }
    
    const userData = usuarios[usuario];
    
    // Cuenta bloqueada
    if (userData.bloqueado) {
        mostrarMensaje('Cuenta bloqueada por intentos fallidos', 'bloqueado');
        return;
    }
    
    // Contraseña incorrecta
    if (userData.pass !== pass) {
        userData.intentos = (userData.intentos || 0) + 1;
        intentosFallidos[usuario] = userData.intentos;
        
        localStorage.setItem(PREFIX + 'usuarios', JSON.stringify(usuarios));
        localStorage.setItem(PREFIX + 'intentos', JSON.stringify(intentosFallidos));
        
        if (userData.intentos >= 3) {
            userData.bloqueado = true;
            localStorage.setItem(PREFIX + 'usuarios', JSON.stringify(usuarios));
            mostrarMensaje('¡CUENTA BLOQUEADA por 3 intentos!', 'bloqueado');
        } else {
            actualizarIntentos();
            mostrarMensaje('Usuario o contraseña incorrectos', 'error');
        }
        return;
    }
    
    // Login exitoso
    mostrarMensaje(`¡Bienvenido ${userData.nombre}!`, 'exito');
});

actualizarIntentos();
