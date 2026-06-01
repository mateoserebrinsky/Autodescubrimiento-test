import type { TalentArea } from './types';

export const TALENT_AREAS: TalentArea[] = [
  {
    id: 'area-1',
    name: 'Administración, Economía y Negocios',
    talents: [
      'Trabajar con números',
      'Iniciar proyecto propio',
      'Liderar',
      'Asumir riesgos',
      'Tareas de oficina',
      'Manejar contabilidad',
      'Convencer a otros',
      'Llevar cuentas',
      'Supervisar',
      'Detectar oportunidades',
      'Planificar ganancias',
      'Diseñar inversiones',
    ],
  },
  {
    id: 'area-2',
    name: 'Sociales y RRHH',
    talents: [
      'Ayudar a otros',
      'Percibir necesidades',
      'Leer sobre problemas sociales',
      'Tareas solidarias',
      'Aconsejar',
      'Incentivar relaciones',
      'Actividades con niños/ancianos',
      'Contención emocional',
      'Trabajo en equipo',
      'Interés en conducta humana',
    ],
  },
  {
    id: 'area-3',
    name: 'Humanidades, Educación y Psicología',
    talents: [
      'Enseñar/Entrenar',
      'Idiomas',
      'Facilitar comunicación',
      'Planear recreación',
      'Interés educativo',
      'Talleres literarios/culturales',
      'Retiros espirituales',
      'Hablar en público',
      'Escribir',
      'Reflexión filosófica',
      'Leer',
    ],
  },
  {
    id: 'area-4',
    name: 'Salud',
    talents: [
      'Anatomía/Fisiología',
      'Investigación en salud',
      'Ayudar enfermos',
      'Leer sobre medicina',
      'Voluntariado hospitalario',
      'Prevención',
      'Emergencias',
      'Primeros auxilios',
      'Nutrición',
    ],
  },
  {
    id: 'area-5',
    name: 'Jurídicas, Políticas y Seguridad',
    talents: [
      'Seguridad de los demás',
      'Relaciones internacionales',
      'Defensa del territorio',
      'Política',
      'Noticias delictivas',
      'Defender causas justas',
      'Conciliar disputas',
      'Prevención del delito',
      'Defender derechos',
      'Juzgar con objetividad',
    ],
  },
  {
    id: 'area-6',
    name: 'Ecología y Naturaleza',
    talents: [
      'Medio ambiente',
      'Alimentación humana',
      'Reservas animales',
      'Preservación de especies',
      'Actividad agrícola/ganadera',
      'Crianza de animales',
      'Biología/Ecología',
      'Vida marina',
      'Cocina',
      'Genética',
      'Geografía',
    ],
  },
  {
    id: 'area-7',
    name: 'Exactas, Ingeniería y Sistemas',
    talents: [
      'Relacionar teorías',
      'Organizar objetos/datos',
      'Informática',
      'Programar software',
      'Lógica',
      'Leer revistas científicas',
      'Cálculos complejos',
      'Fórmulas matemáticas/químicas',
      'Manipular herramientas',
      'Experimentos',
      'Reparaciones',
    ],
  },
  {
    id: 'area-8',
    name: 'Comunicación y Medios',
    talents: [
      'Promocionar',
      'Indagar culturas/historia',
      'Planificar viajes/eventos',
      'Luces y sonido',
      'Relatar',
      'Crítica de espectáculos',
      'Periodismo',
      'Operar sistemas electrónicos',
      'Transmitir comunicación',
      'Entrevistar',
      'Organizar eventos',
    ],
  },
  {
    id: 'area-9',
    name: 'Arte y Diseño',
    talents: [
      'Decorar',
      'Leer partituras',
      'Historia del arte',
      'Tocar instrumento',
      'Fotografía',
      'Danza',
      'Teatro',
      'Diseño de objetos/imágenes',
      'Dibujar/Pintar',
      'Manualidades/Escultura',
      'Confección de ropa',
      'Maquetas',
      'Diseño web',
    ],
  },
];

export const SKIP_REASONS = [
  'No me interesa',
  'No se me da bien',
  'Nunca lo probé',
  'Me aburre',
  'Es muy difícil para mí',
  'No la conozco bien',
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