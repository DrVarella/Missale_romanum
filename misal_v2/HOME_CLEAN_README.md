# Nova Interface Clean - Missale Romanum

## 📱 O que foi criado

Uma nova interface minimalista e moderna para o Missale Romanum, mantendo **toda a lógica e funcionalidade existentes** intactas.

## 🎨 Arquivos criados

1. **home_clean.html** - Nova página inicial com layout moderno
2. **home_clean.css** - Estilos modernos e responsivos
3. **home_clean.js** - Script de integração com o código existente

## ✨ Recursos da nova interface

### Barra Superior (Appbar)
- **Botão HOJE** - Badge com o número do dia atual; clique para ir para a data de hoje
- **Botão Calendário** - Toggle para mostrar/ocultar o calendário
- **Botão Configurações** (⋮) - Acesso rápido às configurações

### Card do Calendário
- Calendário original integrado em um card moderno
- Pode ser ocultado/mostrado com o botão de calendário
- Mantém toda a funcionalidade de seleção de datas

### Informações Litúrgicas
- Exibição clean das informações do dia:
  - "Hodie" (título)
  - Data
  - Ciclo
  - Tempo litúrgico
  - Dia litúrgico

### Botão FIAT
- Design moderno com cor maroon (mantém identidade visual)
- Executa a mesma função do botão original
- Com tratamento de erros melhorado para iOS

### Sheet de Configurações
- Menu deslizante inferior moderno
- Acesso rápido a:
  - Preferências completas
  - Devotionarium
  - Sacerdotale
  - IGMR

## 🚀 Como usar

### Opção 1: Substituir a página inicial
Renomeie os arquivos:
```bash
cd misal_v2
mv feria_actual.html feria_actual_original.html
mv home_clean.html feria_actual.html
```

### Opção 2: Usar como alternativa
Mantenha ambas versões e use `home_clean.html` como entrada alternativa:
```bash
# Apenas abra home_clean.html no navegador ou app
```

### Opção 3: Testar primeiro
1. Abra `home_clean.html` diretamente no navegador
2. Teste todas as funcionalidades
3. Se estiver satisfeito, use a Opção 1

## 🔧 Correções implementadas

### Erro "miciclo is not defined"
- Adicionada inicialização preventiva de `miciclo` no arquivo principal ([feria_actual.html:6077](feria_actual.html#L6077))
- Garantia de variável mesmo antes de `dia_liturgico()` executar
- Fallback para preferências salvas

### Melhorias iOS/Safari
- Event listeners com `touchend` além de `click`
- Tratamento de Promise com try/catch
- Prevenção de "unhandled promise rejection"
- Suporte a safe-area-inset para notch/Dynamic Island

## 📐 Design

### Princípios
- **Minimalista** - Só o essencial visível
- **Clean** - Muito espaço em branco, visual respirável
- **Moderno** - Bordas arredondadas, sombras suaves, tipografia moderna
- **Responsivo** - Funciona em qualquer tamanho de tela

### Cores
```css
--bg: #ffffff           /* Fundo branco limpo */
--text: #111827         /* Texto escuro */
--muted: #6b7280        /* Texto secundário */
--border: #e5e7eb       /* Bordas suaves */
--card: #ffffff         /* Cards brancos */
--maroon: #800000       /* Maroon tradicional (botão FIAT) */
```

### Tipografia
- Sistema de fontes nativas (ui-sans-serif, system-ui)
- Suavização anti-aliasing
- Hierarquia clara de tamanhos

## 🔌 Compatibilidade

### Código Preservado
✅ Todas as funções originais mantidas:
- `dia_liturgico()`
- `prepara_misal()`
- `ejecuta_fiat()`
- `pintacuadro()`
- Sistema de preferências
- Calendário jscalendar

### Elementos Escondidos (não deletados)
- Navegação com abas (Devotionarium, Sacerdotale, etc.)
- Rodapé original
- Menu diamante
- Ícone de gear

Os elementos estão apenas ocultos com CSS (`display: none`), não deletados. Podem ser restaurados facilmente.

## 🐛 Debug

O script expõe funções úteis para debug no console:

```javascript
// No console do navegador:
window.homeClean.openSheet()      // Abre sheet de configurações
window.homeClean.closeSheet()     // Fecha sheet
window.homeClean.handleTodayClick()   // Vai para hoje
window.homeClean.ensureMiciclo()  // Garante miciclo definido
```

## 📱 Suporte a Plataformas

- ✅ iOS (iPhone/iPad) - com safe-area
- ✅ Android
- ✅ Desktop/Web
- ✅ Cordova/PhoneGap (mantém compatibilidade)

## 🎯 Próximos passos (opcionais)

Se quiser melhorar ainda mais:

1. **Modo escuro** - CSS já preparado (comentado), só descomentar
2. **Animações** - Já incluídas animações suaves de fade-in
3. **Gestos** - Adicionar swipe para navegar entre datas
4. **PWA** - Adicionar service worker para uso offline

## ⚠️ Importante

- **NÃO delete feria_actual.html** até ter certeza que tudo funciona
- **Teste em iPhone real** se possível (simulador não mostra todos os bugs)
- **Verifique que o botão FIAT funciona** corretamente
- **Confirme que o calendário seleciona datas** como esperado

## 🆘 Resolução de Problemas

### "Botão FIAT não funciona"
- Abra o console (F12) e veja se há erros
- Verifique se `mis_funciones_misal.js` está carregado
- Confirme que o formulário tem os campos `misa_elegida`, `lect_elegida`, `santo_elegido`

### "Calendário não aparece"
- Verifique se os arquivos `jscalendar/*.js` estão no lugar
- Confirme que o card não está com classe `.collapsed`
- Use o botão de calendário para toggle

### "Erro miciclo ainda acontece"
- Limpe o cache do navegador
- Confirme que a linha 6077 de [feria_actual.html](feria_actual.html#L6077) tem a inicialização
- Verifique as preferências com `dime_pref("ciclo")`

## 📄 Licença

Mantém a mesma licença do projeto original Missale Romanum.

---

**Desenvolvido com ❤️ mantendo respeito ao código original**
