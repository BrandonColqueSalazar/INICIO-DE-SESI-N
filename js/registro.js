const PREFIX = 'auth_v1_';

const regex = {
    nombre: /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/,
    correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    celular: /^[0-9]{7,12}$/,
    contrasena: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
};

let usuarios = JSON.parse(localStorage.getItem(PREFIX + 'usuarios')) || {};

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
document.getElementById('toggleRegistro').addEventListener('click', () => 
    togglePassword('passRegistroInput', 'toggleRegistro')
);

document.getElementById('formRegistro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const pass = document.getElementById('passRegistroInput').value;
    
    // Validaciones
    if (!regex.nombre.test(nombre)) return mostrarMensaje('Nombre solo letras', 'error');
    if (!regex.correo.test(usuario)) return mostrarMensaje('Correo inválido', 'error');
    if (!regex.celular.test(celular)) return mostrarMensaje('Celular 7-12 dígitos', 'error');
    if (!regex.contrasena.test(pass)) return mostrarMensaje('Contraseña débil (6+ chars, mayús, mínus, núm, especial)', 'error');
    if (usuarios[usuario]) return mostrarMensaje('Usuario ya existe', 'error');
    
    // Registro exitoso
    usuarios[usuario] = { nombre, pass, celular, bloqueado: false, intentos: 0 };
    localStorage.setItem(PREFIX + 'usuarios', JSON.stringify(usuarios));
    mostrarMensaje('¡Cuenta creada exitosamente!', 'exito');
});
