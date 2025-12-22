/**
 * HOME CLEAN - SCRIPT DE INTEGRAÇÃO
 * Calendário customizado integrado com o motor do Missale Romanum
 */

(function () {
  'use strict';

  // ============================================
  // ESTADO DO CALENDÁRIO
  // ============================================

  let currentMonth = new Date().getMonth(); // 0-11
  let currentYear = new Date().getFullYear();
  let selectedDate = new Date(); // Data selecionada

  // Nomes dos meses em português (pode ser traduzido)
  const monthNames = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];

  // ============================================
  // INICIALIZAÇÃO
  // ============================================

  function init() {
    setupTodayBadge();
    renderCalendar(currentMonth, currentYear);
    setupEventListeners();
    setupMacDetection();

    // Carrega o dia litúrgico inicial
    loadInitialDate();
  }

  // Executa quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================
  // BADGE DO DIA DE HOJE
  // ============================================

  function setupTodayBadge() {
    const now = new Date();
    const todayNum = now.getDate();
    const todayBadge = document.getElementById('todayBadge');
    if (todayBadge) {
      todayBadge.textContent = String(todayNum);
    }
  }

  // ============================================
  // RENDERIZAÇÃO DO CALENDÁRIO
  // ============================================

  function renderCalendar(month, year) {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    // Atualiza o cabeçalho com mês/ano
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    if (monthYearDisplay) {
      monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
    }

    // Remove apenas os números dos dias (mantém os nomes dos dias da semana)
    const dayNumbers = grid.querySelectorAll('.day-number, .empty');
    dayNumbers.forEach(el => el.remove());

    // Calcula primeiro dia do mês e total de dias
    const firstDay = new Date(year, month, 1).getDay(); // 0 = DOM, 1 = SEG...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Data de hoje para destacar
    const today = new Date();
    const isCurrentMonth = (month === today.getMonth() && year === today.getFullYear());

    // Adiciona células vazias antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'empty';
      grid.appendChild(emptyCell);
    }

    // Adiciona os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'day-number';

      const isToday = (isCurrentMonth && day === today.getDate());
      const isSelected = (
        day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear()
      );

      if (isToday) {
        dayCell.classList.add('current-day');
      }

      if (isSelected) {
        const box = document.createElement('div');
        box.className = 'day-box';
        box.textContent = day;
        dayCell.appendChild(box);
      } else {
        dayCell.textContent = day;
      }

      // Evento de clique no dia
      dayCell.addEventListener('click', () => handleDayClick(day, month, year));
      dayCell.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleDayClick(day, month, year);
      });

      grid.appendChild(dayCell);
    }
  }

  // ============================================
  // MANIPULAÇÃO DE CLIQUE EM DIA
  // ============================================

  function handleDayClick(day, month, year) {
    selectedDate = new Date(year, month, day);

    // Re-renderiza o calendário para mostrar seleção
    renderCalendar(month, year);

    // Formata a data para o formato do misal (d.m.yyyy)
    const dateStr = `${day}.${month + 1}.${year}`;

    // Chama a função do misal para atualizar informações litúrgicas
    if (typeof window.dia_liturgico === 'function') {
      try {
        const respuesta = window.dia_liturgico(dateStr);
        const cabecera = document.getElementById('cabecera');
        if (cabecera) {
          // Mantém o "Hodie" no topo
          const hodieText = cabecera.querySelector('.hodie-text');
          cabecera.innerHTML = '';
          if (hodieText) {
            cabecera.appendChild(hodieText);
          } else {
            const newHodie = document.createElement('div');
            newHodie.className = 'hodie-text';
            newHodie.textContent = 'Hodie';
            cabecera.appendChild(newHodie);
          }

          const pintarAqui = document.createElement('span');
          pintarAqui.id = 'pintar_aqui';
          pintarAqui.innerHTML = respuesta;
          cabecera.appendChild(pintarAqui);
        }

        // Chama pintacuadro se existir
        if (typeof window.pintacuadro === 'function') {
          window.pintacuadro();
        }

        // Limpa arrays de enlaces
        if (window.mienlace_santo) window.mienlace_santo = [];
        if (window.mienlace_lecturas) window.mienlace_lecturas = [];
        if (window.mienlace_misa) window.mienlace_misa = [];
        if (window.mienlace_texto) window.mienlace_texto = [];

      } catch (err) {
        console.error('Erro ao carregar dia litúrgico:', err);
      }
    }
  }

  // ============================================
  // CARREGA DATA INICIAL
  // ============================================

  function loadInitialDate() {
    const now = new Date();
    handleDayClick(now.getDate(), now.getMonth(), now.getFullYear());
  }

  // ============================================
  // NAVEGAÇÃO ENTRE MESES
  // ============================================

  function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  }

  function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  }

  // ============================================
  // GERENCIAMENTO DO SHEET DE CONFIGURAÇÕES
  // ============================================

  const backdrop = document.getElementById('backdrop');
  const sheet = document.getElementById('settingsSheet');

  function openSheet() {
    if (backdrop) backdrop.hidden = false;
    if (sheet) sheet.hidden = false;
  }

  function closeSheet() {
    if (backdrop) backdrop.hidden = true;
    if (sheet) sheet.hidden = true;
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  function setupEventListeners() {
    // Navegação do calendário
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (prevBtn) {
      prevBtn.addEventListener('click', previousMonth);
      prevBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        previousMonth();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextMonth);
      nextBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        nextMonth();
      });
    }

    // Fechar sheet
    const btnCloseSheet = document.getElementById('btnCloseSheet');
    if (btnCloseSheet) {
      btnCloseSheet.addEventListener('click', closeSheet);
      btnCloseSheet.addEventListener('touchend', function(e) {
        e.preventDefault();
        closeSheet();
      });
    }

    // Backdrop fecha o sheet
    if (backdrop) {
      backdrop.addEventListener('click', closeSheet);
      backdrop.addEventListener('touchend', function(e) {
        e.preventDefault();
        closeSheet();
      });
    }

    // Botão configurações
    const btnSettings = document.getElementById('btnSettings');
    if (btnSettings) {
      btnSettings.addEventListener('click', handleSettingsClick);
      btnSettings.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleSettingsClick();
      });
    }

    // Botão HOJE
    const btnToday = document.getElementById('btnToday');
    if (btnToday) {
      btnToday.addEventListener('click', handleTodayClick);
      btnToday.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleTodayClick();
      });
    }

    // Botão FIAT
    const btnFiat = document.getElementById('btnFiat');
    if (btnFiat) {
      btnFiat.addEventListener('click', handleFiatClick);
      btnFiat.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleFiatClick();
      });
    }
  }

  // ============================================
  // HANDLERS DOS BOTÕES
  // ============================================

  function handleSettingsClick() {
    // Tenta usar função de configurações existente
    if (typeof window.abrir_config === 'function') {
      return window.abrir_config();
    }
    if (typeof window.abre_config === 'function') {
      return window.abre_config();
    }
    // Se não existir, abre o sheet
    openSheet();
  }

  function handleTodayClick() {
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();

    renderCalendar(currentMonth, currentYear);
    handleDayClick(now.getDate(), now.getMonth(), now.getFullYear());
  }

  async function handleFiatClick() {
    const btnFiat = document.getElementById('btnFiat');

    try {
      // Desabilita botão durante execução
      if (btnFiat) {
        btnFiat.disabled = true;
        btnFiat.style.opacity = '0.4';
      }

      // Garante que os valores do formulário estão corretos
      const formulario = document.formulario;
      if (formulario) {
        // Verifica se há santo selecionado
        const misanto = document.getElementById('misanto');
        if (misanto && misanto.length > 0) {
          formulario.santo_elegido.value = misanto.value;
        }
      }

      // Tenta executar a função FIAT existente
      if (typeof window.ejecuta_fiat === 'function') {
        await window.ejecuta_fiat();
        return;
      }

      if (typeof window.executa_fiat === 'function') {
        await window.executa_fiat();
        return;
      }

      // Se a função não existir, tenta chamar prepara_misal diretamente
      if (typeof window.prepara_misal === 'function' && formulario) {
        await window.prepara_misal(
          formulario.misa_elegida.value,
          formulario.lect_elegida.value,
          formulario.santo_elegido.value
        );
        return;
      }

      console.warn('Função FIAT não encontrada.');

    } catch (err) {
      console.error('Erro ao executar FIAT:', err);

      // Mostra erro ao usuário de forma amigável
      if (typeof window.alert === 'function') {
        alert('Erro ao carregar a missa. Por favor, tente novamente.');
      }

    } finally {
      // Re-habilita botão
      if (btnFiat) {
        btnFiat.disabled = false;
        btnFiat.style.opacity = '1';
      }
    }
  }

  // ============================================
  // DETECÇÃO DE PLATAFORMA (Mac/Android)
  // ============================================

  function setupMacDetection() {
    const estoymac = window.localStorage.getItem('estoymac');

    if (estoymac != 1) {
      window.estoymac = false;
      // Mostra elementos específicos do Android
      const soloAndroid = document.querySelectorAll('.solo_android');
      soloAndroid.forEach(el => el.style.display = 'block');

      const soloMac = document.querySelectorAll('.solo_mac');
      soloMac.forEach(el => el.style.display = 'none');
    } else {
      window.estoymac = true;
      // Mostra elementos específicos do Mac/iOS
      const soloAndroid = document.querySelectorAll('.solo_android');
      soloAndroid.forEach(el => el.style.display = 'none');

      const soloMac = document.querySelectorAll('.solo_mac');
      soloMac.forEach(el => el.style.display = 'block');
    }
  }

  // ============================================
  // UTILITÁRIOS
  // ============================================

  /**
   * Garante que miciclo está definido (previne ReferenceError)
   */
  function ensureMiciclo() {
    if (typeof window.miciclo === 'undefined') {
      try {
        window.miciclo = window.dime_pref('ciclo', 'A');
      } catch (err) {
        window.miciclo = 'A';
      }
    }
  }

  /**
   * Garante que tipoanio2 está definido
   */
  function ensureTipoanio2() {
    if (typeof window.tipoanio2 === 'undefined') {
      try {
        const anio = new Date().getFullYear();
        window.tipoanio2 = (anio % 2 === 0) ? 'par' : 'impar';
      } catch (err) {
        window.tipoanio2 = 'par';
      }
    }
  }

  // Chama as funções de garantia logo na inicialização
  ensureMiciclo();
  ensureTipoanio2();

  // ============================================
  // PREVINE ERROS COMUNS EM iOS
  // ============================================

  // Previne erro de "unhandled promise rejection"
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Previne que o erro apareça no console
  });

  // ============================================
  // EXPOSIÇÃO PARA DEBUG
  // ============================================

  // Útil para debug no console
  window.homeClean = {
    openSheet,
    closeSheet,
    handleTodayClick,
    handleFiatClick,
    ensureMiciclo,
    ensureTipoanio2,
    renderCalendar: () => renderCalendar(currentMonth, currentYear),
    goToMonth: (month, year) => {
      currentMonth = month;
      currentYear = year;
      renderCalendar(month, year);
    },
    selectDate: (day, month, year) => handleDayClick(day, month, year)
  };

})();
