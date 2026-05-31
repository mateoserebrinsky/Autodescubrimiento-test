import type { TalentArea } from './types';

export const TALENT_AREAS: TalentArea[] = [
  {
    id: 'admin-negocios',
    name: 'Administración, Economía y Negocios',
    talents: [
      'Trabajar con números',
      'Liderar equipos',
      'Convencer a otros',
      'Detectar oportunidades',
      'Manejar contabilidad',
      'Asumir riesgos',
      'Planificar ganancias',
      'Iniciar proyecto propio',
    ],
  },
  {
    id: 'tecnologia',
    name: 'Tecnología e Informática',
    talents: [
      'Resolver problemas lógicos',
      'Programar o crear software',
      'Diseñar páginas web',
      'Analizar datos',
      'Configurar equipos',
      'Aprender nuevas herramientas',
    ],
  },
  {
    id: 'arte-diseno',
    name: 'Arte y Diseño',
    talents: [
      'Dibujar o ilustrar',
      'Diseñar gráficamente',
      'Fotografiar',
      'Crear contenido visual',
      'Decorar espacios',
      'Expresarte creativamente',
    ],
  },
];

export const SKIP_REASONS = [
  'No me interesa',
  'No se me da bien',
  'Nunca lo probé',
  'Me aburre',
];

export const AUTOBIOGRAPHY_QUESTIONS = [
  {
    id: 'modelos',
    title: 'Modelos a seguir',
    prompt: '¿A quién admirabas cuando eras chico/a? ¿A quién querías parecerte?',
  },
  {
    id: 'lecturas',
    title: 'Lecturas',
    prompt: '¿Qué revistas, libros o sitios web leés o seguís regularmente?',
  },
  {
    id: 'series',
    title: 'Series / películas',
    prompt: '¿Cuál es tu serie, película o programa favorito? ¿Qué te gusta de él?',
  },
  {
    id: 'tiempoLibre',
    title: 'Tiempo libre',
    prompt: '¿Qué hacés en tu tiempo libre? ¿Cuáles son tus hobbies favoritos?',
  },
  {
    id: 'frase',
    title: 'Frase o lema',
    prompt: '¿Tenés alguna frase, dicho o lema que te represente?',
  },
  {
    id: 'recuerdos',
    title: 'Primeros recuerdos',
    prompt: 'Contame tres de tus primeros recuerdos de infancia. ¿Qué pasó, quién estaba, cómo te sentiste?',
  },
];

export const MULTIPLE_CHOICE_QUESTIONS = [
  {
    id: 'multipleChoice1',
    title: '¿Cómo preferís trabajar?',
    options: ['Solo/a', 'En equipo pequeño', 'En grupos grandes', 'Depende del proyecto'],
  },
  {
    id: 'multipleChoice2',
    title: '¿Qué tipo de ambiente te atrae más?',
    options: ['Oficina tradicional', 'Trabajo remoto', 'Al aire libre', 'Lugares creativos'],
  },
];

export const REFLECTION_QUESTIONS = [
  {
    id: 'felicidad',
    title: 'Felicidad',
    prompt: '¿Qué cosas te hacen feliz en el día a día?',
  },
  {
    id: 'infelicidad',
    title: 'Infelicidad',
    prompt: '¿Qué cosas te hacen infeliz y quisieras evitar?',
  },
  {
    id: 'exito',
    title: 'Éxito',
    prompt: '¿Cómo definirías con tus palabras el "éxito profesional"?',
  },
  {
    id: 'certeza',
    title: 'Certeza',
    prompt: 'Si supieras con certeza que algo te saldría exactamente como querés, ¿qué elegirías hacer?',
  },
];
