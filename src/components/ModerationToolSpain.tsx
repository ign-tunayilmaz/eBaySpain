import { useState, useEffect } from 'react';
import { ChevronDown, Copy, Check, Sun, Moon, Pencil, X } from 'lucide-react';

const ModerationToolSpain = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedTemplates, setExpandedTemplates] = useState<Record<string, boolean>>({});
  const [showSection, setShowSection] = useState({ templates: false, ban: false, admin: false });
  const [darkMode, setDarkMode] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [notepad, setNotepad] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [customTemplates, setCustomTemplates] = useState<Record<string, string>>({});

  // Shift timer
  const [shiftRunning, setShiftRunning] = useState(false);
  const [shiftSeconds, setShiftSeconds] = useState(0);
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null);

  const [templateInputs, setTemplateInputs] = useState({
    friendlyEditPost: { username: '', title: '', guidelines: '', quote: '' },
    warningEditPost: { username: '', title: '', guidelines: '', quote: '' },
    friendlyRemovePost: { username: '', title: '', dateTime: '', guidelines: '', quote: '' },
    warningRemovePost: { username: '', title: '', dateTime: '', guidelines: '', quote: '' },
    csRedirect: { username: '' },
    banCombined: { banPeriod: '1 Day', reasoning: '', username: '', email: '', ip: '', spamUrl: '', startDate: '' }
  });

  const [adminNoteInputs, setAdminNoteInputs] = useState({
    edited: { link: '', removed: '', violation: '' },
    removed: { link: '', violation: '' }
  });

  const defaultTemplateInputs = {
    friendlyEditPost: { username: '', title: '', guidelines: '', quote: '' },
    warningEditPost: { username: '', title: '', guidelines: '', quote: '' },
    friendlyRemovePost: { username: '', title: '', dateTime: '', guidelines: '', quote: '' },
    warningRemovePost: { username: '', title: '', dateTime: '', guidelines: '', quote: '' },
    csRedirect: { username: '' },
    banCombined: { banPeriod: '1 Day', reasoning: '', username: '', email: '', ip: '', spamUrl: '', startDate: '' }
  };
  const defaultAdminNoteInputs = {
    edited: { link: '', removed: '', violation: '' },
    removed: { link: '', violation: '' }
  };

  // Ban period options (UI labels in English, output values in Spanish for customer-facing content)
  const banPeriods = ['1 Day', '3 Days', '7 Days', '30 Days', 'Indefinite'];
  const banLenMap: Record<string, string> = {
    '1 Day': '1 día',
    '3 Days': '3 días',
    '7 Days': '7 días',
    '30 Days': '30 días',
    'Indefinite': 'indefinido'
  };

  useEffect(() => {
    try {
      const savedTemplateInputs = localStorage.getItem('ebay-es-mod-template-inputs');
      const savedAdminNotes = localStorage.getItem('ebay-es-mod-admin-notes');
      const savedDarkMode = localStorage.getItem('ebay-es-mod-dark-mode');
      const savedNotepad = localStorage.getItem('ebay-es-mod-notepad');
      const savedCustomTemplates = localStorage.getItem('ebay-es-mod-custom-templates');
      if (savedTemplateInputs) {
        const parsed = JSON.parse(savedTemplateInputs) as Record<string, Record<string, string>>;
        setTemplateInputs({
          ...defaultTemplateInputs,
          ...parsed,
          friendlyEditPost: { ...defaultTemplateInputs.friendlyEditPost, ...parsed?.friendlyEditPost },
          warningEditPost: { ...defaultTemplateInputs.warningEditPost, ...parsed?.warningEditPost },
          friendlyRemovePost: { ...defaultTemplateInputs.friendlyRemovePost, ...parsed?.friendlyRemovePost },
          warningRemovePost: { ...defaultTemplateInputs.warningRemovePost, ...parsed?.warningRemovePost },
          csRedirect: { ...defaultTemplateInputs.csRedirect, ...parsed?.csRedirect },
          banCombined: { ...defaultTemplateInputs.banCombined, ...parsed?.banCombined }
        });
      }
      if (savedAdminNotes) {
        const parsed = JSON.parse(savedAdminNotes) as typeof defaultAdminNoteInputs;
        setAdminNoteInputs({
          edited: { ...defaultAdminNoteInputs.edited, ...parsed?.edited },
          removed: { ...defaultAdminNoteInputs.removed, ...parsed?.removed }
        });
      }
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
      if (savedNotepad) setNotepad(savedNotepad);
      if (savedCustomTemplates) setCustomTemplates(JSON.parse(savedCustomTemplates));
    } catch (e) { console.error('Error loading saved data:', e); }
  }, []);

  useEffect(() => { try { localStorage.setItem('ebay-es-mod-template-inputs', JSON.stringify(templateInputs)); } catch (e) {} }, [templateInputs]);
  useEffect(() => { try { localStorage.setItem('ebay-es-mod-admin-notes', JSON.stringify(adminNoteInputs)); } catch (e) {} }, [adminNoteInputs]);
  useEffect(() => { try { localStorage.setItem('ebay-es-mod-notepad', notepad); } catch (e) {} }, [notepad]);
  useEffect(() => { try { localStorage.setItem('ebay-es-mod-dark-mode', JSON.stringify(darkMode)); } catch (e) {} }, [darkMode]);
  useEffect(() => { try { localStorage.setItem('ebay-es-mod-custom-templates', JSON.stringify(customTemplates)); } catch (e) {} }, [customTemplates]);

  // ─── SPANISH USER-FACING MESSAGE TEMPLATES (eBay España) ───────────────────
  const templates: Record<string, string> = {
    friendlyEditPost: 'Hola {{USERNAME}},\n\nEste es un aviso amistoso de moderación para informarte de que tu publicación reciente, "{{TITLE}}", ha sido editada porque infringía las siguientes Normas de la Comunidad de eBay:\n\n{{GUIDELINES}}\n\nTu publicación fue editada para eliminar lo siguiente:\n\n"{{QUOTE}}"\n\nPor favor, tómate un momento para revisar las Normas de la Comunidad y así evitar cometer el mismo error en el futuro.\n\nGracias por tu colaboración para mantener la Comunidad como un lugar acogedor, útil y respetuoso para todos los usuarios.\n\n— El Equipo de Moderación de la Comunidad de eBay',
    warningEditPost: 'Hola {{USERNAME}},\n\nEste es un aviso oficial de moderación para informarte de que tu publicación reciente, "{{TITLE}}", ha sido editada porque infringía las siguientes Normas de la Comunidad de eBay:\n\n{{GUIDELINES}}\n\nTu publicación fue editada para eliminar lo siguiente:\n\n"{{QUOTE}}"\n\nPor favor, tómate un momento para revisar las Normas de la Comunidad y así evitar cometer el mismo error en el futuro.\n\nGracias por tu colaboración para mantener la Comunidad como un lugar acogedor, útil y respetuoso para todos los usuarios.\n\n— El Equipo de Moderación de la Comunidad de eBay',
    friendlyRemovePost: 'Hola {{USERNAME}},\n\nEste es un aviso amistoso de moderación para informarte de que tu publicación reciente, "{{TITLE}}", de {{DATE_TIME}} ha sido eliminada porque infringía las siguientes Normas de la Comunidad de eBay:\n\n{{GUIDELINES}}\n\nPublicaste lo siguiente:\n\n"{{QUOTE}}"\n\nPor favor, tómate un momento para revisar las Normas de la Comunidad y así evitar cometer el mismo error en el futuro.\n\nGracias por tu colaboración para mantener la Comunidad como un lugar acogedor, útil y respetuoso para todos los usuarios.\n\n— El Equipo de Moderación de la Comunidad de eBay',
    warningRemovePost: 'Hola {{USERNAME}},\n\nEste es un aviso oficial de moderación para informarte de que tu publicación reciente, "{{TITLE}}", de {{DATE_TIME}} ha sido eliminada porque infringía las siguientes Normas de la Comunidad de eBay:\n\n{{GUIDELINES}}\n\nPublicaste lo siguiente:\n\n"{{QUOTE}}"\n\nPor favor, tómate un momento para revisar las Normas de la Comunidad y así evitar cometer el mismo error en el futuro.\n\nGracias por tu colaboración para mantener la Comunidad como un lugar acogedor, útil y respetuoso para todos los usuarios.\n\n— El Equipo de Moderación de la Comunidad de eBay',
    necroThread: 'Hola a todos, Debido a la antigüedad de este hilo, se ha cerrado a nuevas respuestas. No dudéis en abrir un nuevo hilo si queréis seguir hablando sobre este tema. Gracias por vuestra comprensión.',
    opRequest: 'Hola a todos,\n\nEste hilo se ha cerrado a petición del autor del mensaje original.\n\nGracias por tu comprensión.',
    lockingOffTopic: 'Hola a todos,\n\nAgradecemos vuestra participación en esta conversación. Sin embargo, el debate se ha desviado del tema y se ha caldeado. Para mantener la comunidad acogedora y constructiva para todos, cerramos este hilo a nuevas respuestas.\n\nRecordad mantener los debates respetuosos y relacionados con el tema según las normas de la Comunidad.\n\nGracias por vuestra comprensión y por ayudar a mantener los foros cordiales y útiles.\n\n— El equipo de la Comunidad eBay',
    heatedDiscussion: 'Hola a todos,\n\nEsta conversación se ha vuelto un poco acalorada. Recordad que, aunque está bien no estar de acuerdo con otros, el debate siempre debe mantenerse amistoso y respetuoso, tal como exigen las Normas de la Comunidad.\n\nGracias por vuestra colaboración.',
    offTopic: 'Hola a todos, Esta conversación se ha desviado un poco del tema. Por favor, volved al asunto establecido en la publicación original. Gracias.',
    bullying: 'Eliminado por incumplir las normas de la Comunidad: mantened los debates respetuosos y abiertos. Las opiniones distintas son bienvenidas, pero las conversaciones deben ser cordiales, inclusivas y respetuosas con todos los miembros.',
    giftCardScam: 'Hola a todos. Si crees que tú o alguien que conoces ha sido inducido a comprar tarjetas regalo de eBay, visita nuestra página de tarjetas regalo para contactar con Atención al Cliente y obtener más información sobre fraudes con tarjetas regalo. Gracias.',
    csRedirect: 'Hola {{USERNAME}}, gracias por reportar contenido inapropiado. Sin embargo, has contactado con el equipo de moderación de la Comunidad eBay. No podemos ayudarte con tu consulta, ya que nos dedicamos exclusivamente a la Comunidad.',
    gg01: 'Sé respetuoso.',
    gg02: 'Comparte mensajes relevantes.',
    gg03: 'Consecuencias: si los mensajes se desvían del tema, el equipo de la Comunidad eBay puede mover contenidos a su criterio.',
    gg04: 'Reportar contenido inapropiado: la Comunidad eBay está hecha por y para usuarios; es probable que seas de los primeros en ver mensajes que dañen la comunidad o incumplan las normas.',
    gg05: 'No permitido: publicar datos de contacto personales de alguien en un área pública de eBay (correo, teléfono, nombre, dirección, etc.).',
    sg00: 'Por favor, no publiques contenidos ni realices acciones que:',
    sg01: 'Tengan carácter sexual, pornográfico, violento o destinado a adultos',
    sg02: 'Contengan lenguaje o amenazas que incumplan la política de amenazas y lenguaje ofensivo',
    sg03: 'Sean deshonestos, no demostrados o destinados a engañar',
    sg04: 'Sean duplicados o repetitivos (incluidas publicaciones y respuestas en foros)',
    sg05: 'Promuevan peticiones, boicots, demandas u otras formas de activismo',
    sg06: 'Anuncien ofertas, productos o servicios para promover ventas',
    sg07: 'Promocionen páginas, grupos o foros fuera de eBay',
    sg08: 'Vuelvan a publicar contenidos editados o eliminados por el personal de la Comunidad eBay',
    sg09: 'Hagan referencia a advertencias de moderación o consecuencias',
    sg10: 'Mencionen a otro usuario, listing o ID para dañar su reputación',
    sg11: 'Animen a otros a incumplir el Acuerdo de usuario o las políticas de eBay',
    sg12: 'Incluyan contenidos con derechos de autor sin permiso del titular'
  };
  // ──────────────────────────────────────────────────────────────────────────

  type TemplateItem = {
    id: string;
    name: string;
    content: string;
    isDynamic?: boolean;
    type?: string;
  };

  const templateList: TemplateItem[] = [
    { id: 'removedByMod', name: 'Removed by Moderator', content: '[Eliminado por el moderador]' },
    { id: 'friendlyEditPost', name: 'Friendly PM: Edited Post', content: templates.friendlyEditPost, isDynamic: true, type: 'editedPost' },
    { id: 'warningEditPost', name: 'Warning PM: Edited Post', content: templates.warningEditPost, isDynamic: true, type: 'editedPost' },
    { id: 'friendlyRemovePost', name: 'Friendly PM: Removed Post', content: templates.friendlyRemovePost, isDynamic: true, type: 'removedPost' },
    { id: 'warningRemovePost', name: 'Warning PM: Removed Post', content: templates.warningRemovePost, isDynamic: true, type: 'removedPost' },
    { id: 'necroThread', name: 'Locking: Necro Thread', content: templates.necroThread },
    { id: 'opRequest', name: 'Locking: OP Request', content: templates.opRequest },
    { id: 'lockingOffTopic', name: 'Locking: Off Topic', content: templates.lockingOffTopic },
    { id: 'heatedDiscussion', name: 'Steering: Heated Discussion', content: templates.heatedDiscussion },
    { id: 'offTopic', name: 'Steering: Off Topic', content: templates.offTopic },
    { id: 'bullying', name: 'Bullying Reply', content: templates.bullying },
    { id: 'giftCardScam', name: 'Gift Card Scam', content: templates.giftCardScam },
    { id: 'csRedirect', name: 'CS Redirect', content: templates.csRedirect, isDynamic: true, type: 'username' },
    ...(['gg01','gg02','gg03','gg04','gg05','sg00','sg01','sg02','sg03','sg04','sg05','sg06','sg07','sg08','sg09','sg10','sg11','sg12'] as const).map(id => ({ id, name: id.toUpperCase() + ': ' + templates[id].substring(0, 30), content: templates[id] }))
  ];

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (e) { alert('Copy failed. Please copy manually:\n\n' + text); }
      textArea.remove();
    }
  };

  const updateInput = (templateId: string, field: string, value: string) => {
    setTemplateInputs(prev => ({ ...prev, [templateId]: { ...(prev as Record<string, Record<string, string>>)[templateId], [field]: value } }));
  };

  const clearInputs = (templateId: string) => {
    const defaults: Record<string, Record<string, string>> = {
      friendlyEditPost: { username: '', title: '', guidelines: '', quote: '' },
      warningEditPost: { username: '', title: '', guidelines: '', quote: '' },
      friendlyRemovePost: { username: '', title: '', dateTime: '', guidelines: '', quote: '' },
      warningRemovePost: { username: '', title: '', dateTime: '', guidelines: '', quote: '' },
      csRedirect: { username: '' },
      banCombined: { banPeriod: '1 Day', reasoning: '', username: '', email: '', ip: '', spamUrl: '', startDate: '' }
    };
    if (defaults[templateId]) setTemplateInputs(prev => ({ ...prev, [templateId]: defaults[templateId] }));
  };

  const getPopulated = (templateId: string, base: string): string => {
    const i = (templateInputs as Record<string, Record<string, string>>)[templateId] || {};
    let p = base;
    if (templateId === 'friendlyEditPost' || templateId === 'warningEditPost') {
      const baseContent = customTemplates[templateId] ?? templates[templateId];
      p = baseContent
        .replace(/\{\{USERNAME\}\}/g, i.username || '{{USERNAME}}')
        .replace(/\{\{TITLE\}\}/g, i.title || '{{TITLE}}')
        .replace(/\{\{GUIDELINES\}\}/g, i.guidelines || '{{GUIDELINES}}')
        .replace(/\{\{QUOTE\}\}/g, i.quote || '{{QUOTE}}');
    } else if (templateId === 'friendlyRemovePost' || templateId === 'warningRemovePost') {
      const baseContent = customTemplates[templateId] ?? templates[templateId];
      p = baseContent
        .replace(/\{\{USERNAME\}\}/g, i.username || '{{USERNAME}}')
        .replace(/\{\{TITLE\}\}/g, i.title || '{{TITLE}}')
        .replace(/\{\{DATE_TIME\}\}/g, i.dateTime || '{{DATE_TIME}}')
        .replace(/\{\{GUIDELINES\}\}/g, i.guidelines || '{{GUIDELINES}}')
        .replace(/\{\{QUOTE\}\}/g, i.quote || '{{QUOTE}}');
    } else if (templateId === 'csRedirect') {
      p = (customTemplates[templateId] ?? templates.csRedirect).replace(/\{\{USERNAME\}\}/g, i.username || '{{USERNAME}}');
    } else if (templateId === 'banCombined') {
      const len = banLenMap[i.banPeriod] || '1 día';
      p = 'Internal Reason\n\n' + i.banPeriod + ' Login Restriction\n\n' +
        'Reasoning: ' + (i.reasoning || '[Reasoning]') + '\n' +
        'Username: ' + (i.username || '[Username]') + '\n' +
        'Email: ' + (i.email || '[Email]') + '\n' +
        'IP: ' + (i.ip || '[IP]') + '\n' +
        'Spam URL: ' + (i.spamUrl || '[URL]') + '\n' +
        'Start Date: ' + (i.startDate || '[DATE]') + '\n' +
        'Ban Length: ' + len +
        '\n\n---\n\n' +
        'Public Reason\n\n' +
        'Incumplimiento de las normas y políticas de la Comunidad eBay por acciones como ' +
        (i.reasoning || '[Reasoning]') +
        '. Tu restricción es efectiva desde el ' + (i.startDate || '[FECHA]') +
        ' y tiene una duración de ' + len + '.';
    }
    return p;
  };

  const updateAdminNote = (noteId: string, field: string, value: string) => {
    if (noteId === 'edited') setAdminNoteInputs(prev => ({ ...prev, edited: { ...prev.edited, [field]: value } }));
    else if (noteId === 'removed') setAdminNoteInputs(prev => ({ ...prev, removed: { ...prev.removed, [field]: value } }));
  };
  const clearAdminNotes = (noteId: string) => {
    if (noteId === 'edited') setAdminNoteInputs(prev => ({ ...prev, edited: { link: '', removed: '', violation: '' } }));
    else if (noteId === 'removed') setAdminNoteInputs(prev => ({ ...prev, removed: { link: '', violation: '' } }));
  };
  const getAdminNote = (noteId: string): string => {
    if (noteId === 'edited') {
      const i = adminNoteInputs.edited;
      return '<a href="' + (i.link || '[link]') + '">Mensaje editado</a> para eliminar "' + (i.removed || '[eliminado]') + '".<br>\nMensaje amistoso al usuario por: ' + (i.violation || '[incumplimiento]');
    }
    if (noteId === 'removed') {
      const i = adminNoteInputs.removed;
      return '<a href="' + (i.link || '[link]') + '">Mensaje eliminado</a><br>\nMensaje amistoso al usuario por: ' + (i.violation || '[incumplimiento]');
    }
    return '';
  };
  const copyToAdminNotes = (templateId: string) => {
    const i = (templateInputs as Record<string, Record<string, string>>)[templateId] || {};
    if (templateId === 'friendlyRemovePost' || templateId === 'warningRemovePost') {
      setAdminNoteInputs(prev => ({ ...prev, removed: { link: prev.removed.link, violation: i.guidelines || '' } }));
      alert('Copied to Removed Post admin notes!');
    } else if (templateId === 'friendlyEditPost' || templateId === 'warningEditPost') {
      setAdminNoteInputs(prev => ({ ...prev, edited: { link: prev.edited.link, removed: i.quote || '', violation: i.guidelines || '' } }));
      alert('Copied to Edited Post admin notes!');
    }
  };

  const startEditing = (templateId: string, currentContent: string) => {
    setEditingTemplate(templateId);
    setEditDraft(customTemplates[templateId] ?? currentContent);
    setExpandedTemplates(prev => ({ ...prev, [templateId]: true }));
  };

  const saveEdit = (templateId: string) => {
    setCustomTemplates(prev => ({ ...prev, [templateId]: editDraft }));
    setEditingTemplate(null);
    setEditDraft('');
  };

  const cancelEdit = () => {
    setEditingTemplate(null);
    setEditDraft('');
  };

  const resetToDefault = (templateId: string, _defaultContent: string) => {
    setCustomTemplates(prev => { const n = { ...prev }; delete n[templateId]; return n; });
    setEditingTemplate(null);
    setEditDraft('');
  };

  const getTemplateContent = (t: TemplateItem): string => customTemplates[t.id] ?? t.content;

  const getInputsForTemplate = (id: string): Record<string, string> => {
    const key = id as keyof typeof templateInputs;
    return templateInputs[key] ?? {};
  };

  // Shift timer tick
  useEffect(() => {
    if (!shiftRunning) return;
    const interval = setInterval(() => setShiftSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [shiftRunning]);

  const startShift = () => {
    setShiftSeconds(0);
    setShiftStartTime(new Date());
    setShiftRunning(true);
  };
  const resumeShift = () => setShiftRunning(true);
  const stopShift = () => setShiftRunning(false);
  const resetShift = () => { setShiftRunning(false); setShiftSeconds(0); setShiftStartTime(null); };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return (h > 0 ? h + 'h ' : '') + String(m).padStart(2, '0') + 'min ' + String(s).padStart(2, '0') + 's';
  };

  const WARN_90 = 60 * 60;
  const timerColor = shiftSeconds >= WARN_90
    ? 'text-red-500'
    : shiftSeconds >= 45 * 60
    ? 'text-yellow-500'
    : 'text-green-500';

  const bg = darkMode ? 'min-h-screen bg-slate-900 p-6' : 'min-h-screen bg-slate-50 p-6';
  const card = darkMode ? 'bg-slate-800' : 'bg-white';
  const text1 = darkMode ? 'text-slate-100' : 'text-slate-800';
  const text2 = darkMode ? 'text-slate-400' : 'text-slate-600';
  const border = darkMode ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className={bg}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className={`${card} rounded-lg shadow-lg p-6 mb-6 ${border} border`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className={`text-3xl font-bold ${text1}`}>eBay Community Moderation <span className="text-yellow-500">🇪🇸 España</span></h1>
              <p className={text2}>Quick reference guide with ready-to-use templates</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://comunidad.ebay.es/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg font-semibold text-sm bg-yellow-500 hover:bg-yellow-600 text-white">Go to eBay ES</a>
              <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                {darkMode ? <><Sun className="w-5 h-5" /><span>Light</span></> : <><Moon className="w-5 h-5" /><span>Dark</span></>}
              </button>
            </div>
          </div>
        </div>

        {/* Shift Timer */}
        <div className={`${card} rounded-lg shadow p-4 mb-6 border ${border}`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">⏱️</span>
              <div>
                <div className={`text-xs font-semibold uppercase tracking-wide ${text2}`}>Shift Timer</div>
                <div className={`text-2xl font-mono font-bold ${timerColor}`}>{formatTime(shiftSeconds)}</div>
                {shiftStartTime && (
                  <div className={`text-xs ${text2}`}>Started at {shiftStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {shiftSeconds >= WARN_90 && (
                <span className="text-xs font-semibold text-red-500 bg-red-100 px-2 py-1 rounded-full animate-pulse">⚠️ 60 min target exceeded</span>
              )}
              {!shiftRunning && shiftSeconds === 0 && (
                <button onClick={startShift} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm">Start Shift</button>
              )}
              {shiftRunning && (
                <button onClick={stopShift} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-sm">Pause</button>
              )}
              {!shiftRunning && shiftSeconds > 0 && (
                <button onClick={resumeShift} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm">Resume</button>
              )}
              {shiftSeconds > 0 && (
                <button onClick={resetShift} className={`px-4 py-2 rounded-lg font-semibold text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>Reset</button>
              )}
            </div>
          </div>
          <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div
              className={`h-full rounded-full transition-all duration-1000 ${shiftSeconds >= WARN_90 ? 'bg-red-500' : shiftSeconds >= 45 * 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: Math.min((shiftSeconds / WARN_90) * 100, 100) + '%' }}
            />
          </div>
          <div className={`flex justify-between text-xs mt-1 ${text2}`}>
            <span>0</span>
            <span>45 min</span>
            <span>60 min target</span>
          </div>
        </div>

        {/* Collapsible Sections */}
        {[
          { key: 'ban', title: 'Ban Templates', render: () => {
            const ban = templateInputs.banCombined ?? defaultTemplateInputs.banCombined;
            return (
            <div className={`border rounded-lg overflow-hidden ${border}`}>
              <div className={`${darkMode ? 'bg-orange-900' : 'bg-orange-100'} px-3 py-2 flex items-center justify-between border-b ${border}`}>
                <span className={`text-sm font-semibold ${darkMode ? 'text-orange-100' : 'text-slate-700'}`}>Fill ban details</span>
                <div className="flex gap-2">
                  <button onClick={() => clearInputs('banCombined')} className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-300 hover:bg-slate-400 text-slate-700'}`}>Clear</button>
                  <button onClick={() => copy(getPopulated('banCombined', ''), 'banCombined')} className="flex items-center gap-2 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium">{copiedId === 'banCombined' ? <><Check className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}</button>
                </div>
              </div>
              <div className={`${darkMode ? 'bg-slate-900' : 'bg-orange-50'} p-3 space-y-2`}>
                <select value={ban.banPeriod ?? '1 Day'} onChange={(e) => updateInput('banCombined', 'banPeriod', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}`}>
                  {banPeriods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <textarea placeholder="Reasoning" value={ban.reasoning ?? ''} onChange={(e) => updateInput('banCombined', 'reasoning', e.target.value)} rows={3} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                {[{ f: 'username', label: 'Username' }, { f: 'email', label: 'Email' }, { f: 'ip', label: 'IP' }, { f: 'spamUrl', label: 'Spam URL' }].map(({ f, label }) => (
                  <input key={f} type="text" placeholder={label} value={ban[f as keyof typeof ban] ?? ''} onChange={(e) => updateInput('banCombined', f, e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                ))}
                <input type="date" value={ban.startDate ?? ''} onChange={(e) => updateInput('banCombined', 'startDate', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}`} />
              </div>
              <div className={`${card} p-3`}><pre className={`text-xs ${text2} whitespace-pre-wrap font-mono`}>{getPopulated('banCombined', '')}</pre></div>
            </div>
            );
          }},
          { key: 'templates', title: 'Additional Templates', render: () => (
            <>
              <div className="mb-3"><input type="text" placeholder="Search templates..." value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} /></div>
              <div className="space-y-2">
                {templateList.filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase())).map((t) => {
                  const isExp = expandedTemplates[t.id] === true;
                  const isEditing = editingTemplate === t.id;
                  const currentContent = getTemplateContent(t);
                  const isCustomized = !!customTemplates[t.id];
                  const pop = t.isDynamic ? getPopulated(t.id, currentContent) : currentContent;
                  return (
                    <div key={t.id} className={`border rounded-lg overflow-hidden ${border}`}>
                      <div className={`${darkMode ? 'bg-slate-700' : 'bg-slate-100'} px-3 py-2 flex items-center justify-between border-b ${border}`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${text1}`}>{t.name}</span>
                          {isCustomized && <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500 text-white font-medium">Edited</span>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => isEditing ? cancelEdit() : startEditing(t.id, currentContent)}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium ${isEditing ? 'bg-red-500 hover:bg-red-600 text-white' : darkMode ? 'bg-slate-500 hover:bg-slate-400 text-white' : 'bg-slate-400 hover:bg-slate-500 text-white'}`}
                          >
                            {isEditing ? <><X className="w-3 h-3" />Cancel</> : <><Pencil className="w-3 h-3" />Edit</>}
                          </button>
                          <button onClick={() => copy(pop || currentContent, t.id)} className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium">{copiedId === t.id ? <><Check className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}</button>
                          <button onClick={() => setExpandedTemplates({...expandedTemplates, [t.id]: !isExp})} className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExp ? 'rotate-180' : ''}`} />
                            {isExp ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>

                      {isExp && (
                        <>
                          {isEditing && (
                            <div className={`${darkMode ? 'bg-slate-900' : 'bg-yellow-50'} p-4 border-b ${border} space-y-3`}>
                              <div className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>✏️ Editing macro content</div>
                              <textarea
                                value={editDraft}
                                onChange={(e) => setEditDraft(e.target.value)}
                                rows={10}
                                className={`w-full px-3 py-2 text-sm border-2 rounded font-mono ${darkMode ? 'bg-slate-800 border-yellow-500 text-slate-200' : 'bg-white border-yellow-400 text-slate-800'}`}
                              />
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit(t.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold">Save</button>
                                <button onClick={cancelEdit} className={`px-4 py-2 rounded text-sm font-semibold ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>Cancel</button>
                                {isCustomized && <button onClick={() => resetToDefault(t.id, t.content)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold">Reset to Default</button>}
                              </div>
                            </div>
                          )}

                          {!isEditing && t.isDynamic && (
                            <div className={`${darkMode ? 'bg-slate-900' : 'bg-slate-50'} p-4 border-b ${border} space-y-3`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className={`text-sm font-semibold ${text1}`}>Fill fields</div>
                                <div className="flex gap-2">
                                  {(t.type === 'editedPost' || t.type === 'removedPost') && (
                                    <button onClick={() => copyToAdminNotes(t.id)} className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium">Copy to Admin Notes</button>
                                  )}
                                  <button onClick={() => clearInputs(t.id)} className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-300 hover:bg-slate-400 text-slate-700'}`}>Clear</button>
                                </div>
                              </div>
                              {t.type === 'editedPost' && (
                                <>
                                  <input type="text" placeholder="USERNAME" value={getInputsForTemplate(t.id).username || ''} onChange={(e) => updateInput(t.id, 'username', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <input type="text" placeholder="TITLE" value={getInputsForTemplate(t.id).title || ''} onChange={(e) => updateInput(t.id, 'title', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <textarea placeholder="GUIDELINES" value={getInputsForTemplate(t.id).guidelines || ''} onChange={(e) => updateInput(t.id, 'guidelines', e.target.value)} rows={3} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <textarea placeholder="QUOTE (removed content)" value={getInputsForTemplate(t.id).quote || ''} onChange={(e) => updateInput(t.id, 'quote', e.target.value)} rows={3} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                </>
                              )}
                              {t.type === 'removedPost' && (
                                <>
                                  <input type="text" placeholder="USERNAME" value={getInputsForTemplate(t.id).username || ''} onChange={(e) => updateInput(t.id, 'username', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <input type="text" placeholder="TITLE" value={getInputsForTemplate(t.id).title || ''} onChange={(e) => updateInput(t.id, 'title', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <input type="text" placeholder="DATE / TIME" value={getInputsForTemplate(t.id).dateTime || ''} onChange={(e) => updateInput(t.id, 'dateTime', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <textarea placeholder="GUIDELINES" value={getInputsForTemplate(t.id).guidelines || ''} onChange={(e) => updateInput(t.id, 'guidelines', e.target.value)} rows={3} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <textarea placeholder="QUOTE (posted content)" value={getInputsForTemplate(t.id).quote || ''} onChange={(e) => updateInput(t.id, 'quote', e.target.value)} rows={3} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                </>
                              )}
                              {t.type === 'username' && (
                                <input type="text" placeholder="USERNAME" value={getInputsForTemplate(t.id).username || ''} onChange={(e) => updateInput(t.id, 'username', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                              )}
                            </div>
                          )}

                          <div className={`${card} p-3`}><pre className={`text-xs ${text2} whitespace-pre-wrap font-mono`}>{isEditing ? editDraft : (pop || currentContent)}</pre></div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )},
          { key: 'admin', title: 'Admin Notes', render: () => {
            const edited = adminNoteInputs?.edited ?? defaultAdminNoteInputs.edited;
            const removed = adminNoteInputs?.removed ?? defaultAdminNoteInputs.removed;
            return (
            <div className={`space-y-6 pt-3 border-t ${border}`}>
              {[{ id: 'edited' as const, title: 'Edited Post', data: edited }, { id: 'removed' as const, title: 'Removed Post', data: removed }].map(n => (
                <div key={n.id}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-sm font-semibold ${text1}`}>{n.title}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => clearAdminNotes(n.id)} className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-300 hover:bg-slate-400 text-slate-700'}`}>Clear</button>
                      <button onClick={() => copy(getAdminNote(n.id), 'admin-' + n.id)} className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium">{copiedId === 'admin-' + n.id ? <><Check className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input type="text" placeholder="Link to post" value={n.data.link ?? ''} onChange={(e) => updateAdminNote(n.id, 'link', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                    {n.id === 'edited' && <input type="text" placeholder="Removed portion" value={n.data.removed ?? ''} onChange={(e) => updateAdminNote(n.id, 'removed', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />}
                    <input type="text" placeholder="Rule violation" value={n.data.violation ?? ''} onChange={(e) => updateAdminNote(n.id, 'violation', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                    <div className={`rounded-lg p-3 border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}><pre className={`text-xs whitespace-pre-wrap font-mono ${text2}`}>{getAdminNote(n.id)}</pre></div>
                  </div>
                </div>
              ))}
            </div>
            );
          }}
        ].map(s => (
          <div key={s.key} className={`${card} rounded-lg shadow p-4 mb-6 border ${border}`}>
            <button onClick={() => setShowSection({...showSection, [s.key]: !showSection[s.key as keyof typeof showSection]})} className="w-full flex items-center justify-between mb-3">
              <h3 className={`font-semibold ${text1}`}>{s.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${text2}`}>{showSection[s.key as keyof typeof showSection] ? 'Hide' : 'Show'}</span>
                <ChevronDown className={`w-5 h-5 ${text2} transition-transform duration-200 ${showSection[s.key as keyof typeof showSection] ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {showSection[s.key as keyof typeof showSection] && s.render()}
          </div>
        ))}

        {/* Notepad */}
        <div className={`${card} rounded-lg shadow p-4 mb-6 border ${border}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <h3 className={`font-semibold ${text1}`}>Shift Notes</h3>
            </div>
            <button onClick={() => setNotepad('')} className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>Clear</button>
          </div>
          <textarea
            value={notepad}
            onChange={(e) => setNotepad(e.target.value)}
            placeholder="Jot down usernames to watch, pending escalations, reminders..."
            rows={6}
            className={`w-full px-3 py-2 text-sm border rounded resize-y ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400'}`}
          />
          <p className={`text-xs mt-1 ${text2}`}>Notes are saved automatically and persist until cleared.</p>
        </div>

        {/* Footer */}
        <div className={`rounded-lg shadow p-4 text-center text-sm ${card} ${text2} border ${border}`}>
          <p>Contact: <a href="mailto:tuna.yilmaz@ignitetech.com" className="text-yellow-500 underline">tuna.yilmaz@ignitetech.com</a></p>
          <p className="mt-2 text-xs">Version 1.0.0 - eBay España 🇪🇸</p>
        </div>

      </div>
    </div>
  );
};

export default ModerationToolSpain;
