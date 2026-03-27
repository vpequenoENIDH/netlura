// Script para alternância entre Dark Mode e Light Mode
class ThemeManager {
    constructor() {
        this.themeButton = null;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.createThemeButton();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    createThemeButton() {
        // Cria o botão de alternância de tema
        this.themeButton = document.createElement('button');
        this.themeButton.id = 'theme-toggle';
        this.themeButton.setAttribute('aria-label', 'Alternar entre modo escuro e claro');
        this.themeButton.innerHTML = `
            <svg class="sun-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
                <path d="M12 1v2M12 21v2M3.22 3.22l1.42 1.42M19.36 19.36l1.42 1.42M1 12h2M21 12h2M3.22 20.78l1.42-1.42M19.36 4.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M12 5v2M12 17v2M7 12H9M15 12h2M8.34 8.34L9.76 9.76M14.24 14.24l1.42 1.42M8.34 15.66l1.42-1.42M14.24 9.76l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <svg class="moon-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>
        `;

        // Adiciona o botão ao body (posição fixed)
        document.body.appendChild(this.themeButton);
    }

    bindEvents() {
        if (this.themeButton) {
            this.themeButton.addEventListener('click', () => this.toggleTheme());
        }

        // Listener para mudanças no sistema operacional
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateButtonIcon(theme);
    }

    updateButtonIcon(theme) {
        if (!this.themeButton) return;

        const sunIcon = this.themeButton.querySelector('.sun-icon');
        const moonIcon = this.themeButton.querySelector('.moon-icon');

        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
}

// Inicializa o gerenciador de tema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new ProfileManager();
});

// Classe para gerenciar edição de perfis
class ProfileManager {
    constructor() {
        this.perfisOriginais = [
            { nome: 'Qc', foto: '/assets/perfil1_raf.png' },
            { nome: 'Té', foto: '/assets/perfil2_huntik.png' },
            { nome: 'Pinha', foto: '/assets/perfil3_akari.png' },
            { nome: 'Jr', foto: '/assets/perfil4_Carl.png' }
        ];
        
        // Carrega perfis salvos do localStorage ou usa os originais
        this.perfis = JSON.parse(localStorage.getItem('perfis')) || this.perfisOriginais;
        
        this.modal = document.getElementById('modal-gerenciar');
        this.botaoGerenciar = document.querySelector('.botao-gerenciar');
        this.selecionarPerfil = document.getElementById('selecionar-perfil');
        this.formEditarPerfil = document.getElementById('form-editar-perfil');
        this.inputNome = document.getElementById('nome-perfil');
        this.inputFoto = document.getElementById('foto-perfil');
        this.previewImg = document.getElementById('preview-img');
        this.previewNome = document.getElementById('preview-nome');
        this.btnSalvar = document.querySelector('.btn-salvar');
        this.btnCancelar = document.querySelector('.btn-cancelar');
        this.btnFechar = document.querySelector('.modal-fechar');
        
        this.perfil_selecionado = null;
        
        this.init();
    }

    init() {
        // Event listeners
        this.botaoGerenciar.addEventListener('click', () => this.abrirModal());
        this.btnFechar.addEventListener('click', () => this.fecharModal());
        this.btnCancelar.addEventListener('click', () => this.fecharModal());
        this.selecionarPerfil.addEventListener('change', (e) => this.selecionarPerfilParaEditar(e.target.value));
        this.formEditarPerfil.addEventListener('submit', (e) => this.salvarAlteracoes(e));
        this.inputNome.addEventListener('input', () => this.atualizarPreview());
        this.inputFoto.addEventListener('input', () => this.atualizarPreview());
        
        // Fechar modal ao clicar fora
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.fecharModal();
        });
        
        // Atualizar nomes no perfil principal
        this.atualizarNomesNoSite();
    }

    abrirModal() {
        this.modal.showModal();
        // Reset do formulário
        this.selecionarPerfil.value = '';
        this.formEditarPerfil.classList.remove('ativo');
        this.inputNome.value = '';
        this.inputFoto.value = '';
    }

    fecharModal() {
        this.modal.close();
    }

    selecionarPerfilParaEditar(index) {
        if (index === '') {
            this.formEditarPerfil.classList.remove('ativo');
            return;
        }

        this.perfil_selecionado = parseInt(index);
        const perfil = this.perfis[this.perfil_selecionado];
        
        this.inputNome.value = perfil.nome;
        this.inputFoto.value = perfil.foto;
        this.atualizarPreview();
        
        this.formEditarPerfil.classList.add('ativo');
    }

    atualizarPreview() {
        const nome = this.inputNome.value || 'Nome';
        const foto = this.inputFoto.value || this.perfis[this.perfil_selecionado].foto;
        
        this.previewNome.textContent = nome;
        this.previewImg.src = foto;
    }

    salvarAlteracoes(e) {
        e.preventDefault();
        
        if (this.perfil_selecionado === null) return;

        const perfil = this.perfis[this.perfil_selecionado];
        perfil.nome = this.inputNome.value;
        perfil.foto = this.inputFoto.value;
        
        // Salva no localStorage
        localStorage.setItem('perfis', JSON.stringify(this.perfis));
        
        // Atualiza o site
        this.atualizarNomesNoSite();
        
        // Feedback visual
        alert('Perfil atualizado com sucesso!');
        
        this.fecharModal();
    }

    atualizarNomesNoSite() {
        // Atualiza os nomes das figcaption no HTML
        const footerCaption = document.querySelectorAll('.profiles figcaption');
        footerCaption.forEach((caption, index) => {
            if (index < this.perfis.length) {
                caption.textContent = this.perfis[index].nome;
                // Atualiza também a imagem
                const img = caption.parentElement.querySelector('img');
                if (img) {
                    img.src = this.perfis[index].foto;
                }
            }
        });
        
        // Adiciona listeners aos links dos perfis para salvar perfil ativo
        this.adicionarListenersPerfis();
    }

    adicionarListenersPerfis() {
        const linksPerfis = document.querySelectorAll('.profiles .profile');
        
        linksPerfis.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                // Previne navegação momentânea para salvar dados
                const perfil = this.perfis[index];
                
                // Armazena o perfil ativo no localStorage
                const perfilAtivo = {
                    nome: perfil.nome,
                    foto: perfil.foto,
                    indice: index,
                    dataAcesso: new Date().toISOString()
                };
                
                localStorage.setItem('perfilAtivo', JSON.stringify(perfilAtivo));
                
                // Permite a navegação
                // O link será seguido normalmente
            });
        });
    }
}