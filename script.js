
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
        evento.currentTarget.classList.add('ativa');
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