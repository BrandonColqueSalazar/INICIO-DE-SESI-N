const PREFIX = 'auth_v1_';

const regex = {
    contrasena: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
};

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

// Event listeners
document.getElementById('toggleRecup').addEventListener('click', () => 
    togglePassword('nuevaPassInput', 'toggleRecup')
);

document.getElementById('formRecuperar').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('recupUsuario').value.trim();
    const nuevaPass = document.getElementById('nuevaPassInput').value;
    
    // Usuario no existe
    if (!usuarios[usuario]) {
        mostrarMensaje('Usuario no encontrado', 'error');
        return;
    }
    
    // Validar nueva contraseña
    if (!regex.contrasena.test(nuevaPass)) {
        mostrarMensaje('Nueva contraseña debe: 6+ chars, mayús, mínus, número, especial', 'error');
        return;
    }
    
    // Actualizar contraseña y desbloquear
    usuarios[usuario].pass = nuevaPass;
    usuarios[usuario].bloqueado = false;
    usuarios[usuario].intentos = 0;
    delete intentosFallidos[usuario];
    
    localStorage.setItem(PREFIX + 'usuarios', JSON.stringify(usuarios));
    localStorage.setItem(PREFIX + 'intentos', JSON.stringify(intentosFallidos));
    
    mostrarMensaje('¡Contraseña actualizada correctamente! Ya puedes iniciar sesión.', 'exito');
});
