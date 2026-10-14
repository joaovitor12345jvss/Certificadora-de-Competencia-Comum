
function mudarSeccao(idSeccao, evento) {
    // 1. Esconde todas as secções
    const secoes = document.querySelectorAll('.secao-spa');
    secoes.forEach(secao => secao.classList.remove('ativa'));

    // 2. Remove a classe 'ativo' de todos os botões do menu
    const botoes = document.querySelectorAll('.nav-btn');
    botoes.forEach(botao => botao.classList.remove('ativo'));

    // 3. Mostra a secção selecionada
    const secaoAtiva = document.getElementById(idSeccao);
    if (secaoAtiva) {
        secaoAtiva.classList.add('ativa');
    }

    // 4. Ativa o botão correspondente no menu
    if (evento && evento.currentTarget) {
        evento.currentTarget.classList.add('ativo');
    } else {
        botoes.forEach(botao => {
            if (botao.getAttribute('onclick').includes(idSeccao)) {
                botao.classList.add('ativo');
            }
        });
    }

    // 5. Rola suavemente para o topo do conteúdo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função auxiliar para o botão principal de introdução
function mudarSeccaoParaBotao() {
    mudarSeccao('botoes');
}

// Alterna entre o tema claro e o tema escuro
function alternarTema() {
    const body = document.body;
    const btnTema = document.getElementById('btn-tema');
    
    if (body.getAttribute('data-tema') === 'escuro') {
        body.setAttribute('data-tema', 'claro');
        btnTema.textContent = '🌙 Modo Escuro';
        localStorage.setItem('tema', 'claro');
    } else {
        body.setAttribute('data-tema', 'escuro');
        btnTema.textContent = '☀️ Modo Claro';
        localStorage.setItem('tema', 'escuro');
    }
}

// Ao carregar a página, verifica se o utilizador já tinha uma preferência de tema guardada
window.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem('tema');
    const btnTema = document.getElementById('btn-tema');
    
    if (temaGuardado === 'escuro') {
        document.body.setAttribute('data-tema', 'escuro');
        if (btnTema) btnTema.textContent = '☀️ Modo Claro';
    }
});

// Reproduz a página dentro da lente para ampliar a área sob o cursor.
let lupaAtiva = false;
let iframeLupa = null;
let ultimoX = innerWidth / 2;
let ultimoY = innerHeight / 2;
const aumentoLupa = 2;

function sincronizarLupa() {
    if (!lupaAtiva || !iframeLupa?.contentDocument?.body) return;
    const origem = document.body;
    const destino = iframeLupa.contentDocument.body;
    destino.setAttribute('data-tema', origem.getAttribute('data-tema'));
    // A navegação por seções e os botões são refletidos na cópia.
    origem.querySelectorAll('.secao-spa, .nav-btn').forEach(el => {
        const copia = iframeLupa.contentDocument.getElementById(el.id) ||
            (el.classList.contains('nav-btn') ? [...destino.querySelectorAll('.nav-btn')][[...origem.querySelectorAll('.nav-btn')].indexOf(el)] : null);
        if (copia) copia.className = el.className;
    });
}

function posicionarLupa(x, y) {
    if (!lupaAtiva || !iframeLupa) return;
    ultimoX = x; ultimoY = y;
    const lupa = document.getElementById('lupa');
    const raio = lupa.offsetWidth / 2;
    lupa.style.left = `${x - raio}px`;
    lupa.style.top = `${y - raio}px`;
    iframeLupa.style.left = `${raio - aumentoLupa * x}px`;
    iframeLupa.style.top = `${raio - aumentoLupa * y}px`;
    iframeLupa.contentWindow?.scrollTo(window.scrollX, window.scrollY);
}

function alternarLupa() {
    const lupa = document.getElementById('lupa');
    const botao = document.getElementById('btn-lupa');
    lupaAtiva = !lupaAtiva;
    botao.setAttribute('aria-pressed', String(lupaAtiva));
    botao.textContent = lupaAtiva ? '🔍 Desativar Lupa' : '🔍 Ativar Lupa';
    botao.setAttribute('aria-label', lupaAtiva ? 'Desativar lupa de ampliação' : 'Ativar lupa de ampliação');
    lupa.classList.toggle('ativa', lupaAtiva);
    if (!lupaAtiva) { lupa.replaceChildren(); iframeLupa = null; return; }

    // srcdoc mantém a aparência e as imagens da página original.
    const corpo = document.body.cloneNode(true);
    corpo.querySelector('#lupa')?.remove();
    corpo.querySelectorAll('script').forEach(s => s.remove());
    const base = `<base href="${document.baseURI.replaceAll('"', '&quot;')}">`;
    const estilos = [...document.head.querySelectorAll('link[rel="stylesheet"], style')]
        .map(el => el.outerHTML).join('');
    iframeLupa = document.createElement('iframe');
    iframeLupa.title = 'Visualização ampliada';
    iframeLupa.tabIndex = -1;
    iframeLupa.setAttribute('aria-hidden', 'true');
    iframeLupa.style.width = `${innerWidth}px`;
    iframeLupa.style.height = `${innerHeight}px`;
    iframeLupa.style.transform = `scale(${aumentoLupa})`;
    iframeLupa.srcdoc = `<!doctype html><html lang="pt-BR"><head>${base}${estilos}</head>${corpo.outerHTML}</html>`;
    iframeLupa.addEventListener('load', () => { sincronizarLupa(); posicionarLupa(ultimoX, ultimoY); });
    lupa.appendChild(iframeLupa);
    posicionarLupa(ultimoX, ultimoY);
}

document.addEventListener('pointermove', e => {
    if (lupaAtiva && e.pointerType !== 'touch') posicionarLupa(e.clientX, e.clientY);
});
window.addEventListener('scroll', () => { if (lupaAtiva) posicionarLupa(ultimoX, ultimoY); }, {passive: true});
window.addEventListener('resize', () => {
    if (lupaAtiva) { alternarLupa(); alternarLupa(); }
});
new MutationObserver(() => sincronizarLupa()).observe(document.body, {
    attributes: true, attributeFilter: ['data-tema'], subtree: false
});
// Atualiza o conteúdo ampliado depois de trocar de seção.
document.addEventListener('click', () => { if (lupaAtiva) requestAnimationFrame(sincronizarLupa); });
