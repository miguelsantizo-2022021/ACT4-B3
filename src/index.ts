import { MenúPrincipal } from './menu/menu';

async function iniciarApp() {
    await MenúPrincipal.mostrar();
}

iniciarApp();