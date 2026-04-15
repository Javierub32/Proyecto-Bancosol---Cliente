const trabajadores = [
  { id:1, nombre:'Ana García',   puesto:'trabajador',    habilidades:['Fontanería','Electricidad'] },
  { id:2, nombre:'Bob Martín',   puesto:'trabajador',    habilidades:['Albañilería','Carpentry'] },
  { id:3, nombre:'Carlos López', puesto:'trabajador',    habilidades:['Electricidad','Climatización'] },
  { id:4, nombre:'Diana Ruiz',   puesto:'supervisor',    habilidades:['Planificación','Seguridad'] },
  { id:5, nombre:'Emilio Sanz',  puesto:'trabajador',    habilidades:['Fontanería','Albañilería'] },
  { id:6, nombre:'Fran Torres',  puesto:'trabajador',    habilidades:['Carpintería','Pintura'] },
  { id:7, nombre:'Gloria Pérez', puesto:'trabajador',    habilidades:['Climatización','Electricidad'] },
  { id:8, nombre:'Hugo Moreno',  puesto:'administrador', habilidades:['Gestión','Planificación'] },
];

const obras = [
  { id:1, nombre:'Residencial Alameda', localizacion:'Málaga Centro',   inicio:'2026-03-10', final:'2026-04-18', estado:'active',   color: COLORS.work[0] },
  { id:2, nombre:'Oficinas Torre Sur',  localizacion:'Campanillas',     inicio:'2026-03-17', final:'2026-05-02', estado:'active',   color: COLORS.work[1] },
  { id:3, nombre:'Parking Subterráneo', localizacion:'El Palo',         inicio:'2026-02-20', final:'2026-03-28', estado:'active',   color: COLORS.work[2] },
  { id:4, nombre:'Nave Industrial',     localizacion:'Polígono Astro',  inicio:'2026-04-01', final:'2026-06-15', estado:'upcoming', color: COLORS.work[3] },
  { id:5, nombre:'Reform. Hotel Playa', localizacion:'Torremolinos',    inicio:'2026-03-05', final:'2026-03-25', estado:'active',   color: COLORS.work[4] },
];

// Assignments: { idObra, idTrabajador, fecha: 'YYYY-MM-DD' }
const asignaciones = [
  {idObra:1, idTrabajador:1, fecha:'2026-03-23'}, {idObra:1, idTrabajador:2, fecha:'2026-03-23'},
  {idObra:2, idTrabajador:3, fecha:'2026-03-23'}, {idObra:2, idTrabajador:4, fecha:'2026-03-23'},
  {idObra:3, idTrabajador:5, fecha:'2026-03-23'}, {idObra:5, idTrabajador:6, fecha:'2026-03-23'},
  {idObra:1, idTrabajador:1, fecha:'2026-03-24'}, {idObra:1, idTrabajador:7, fecha:'2026-03-24'},
  {idObra:2, idTrabajador:3, fecha:'2026-03-24'}, {idObra:3, idTrabajador:5, fecha:'2026-03-24'},
  {idObra:5, idTrabajador:6, fecha:'2026-03-24'}, {idObra:5, idTrabajador:2, fecha:'2026-03-24'},
  {idObra:1, idTrabajador:1, fecha:'2026-03-25'}, {idObra:2, idTrabajador:3, fecha:'2026-03-25'},
  {idObra:2, idTrabajador:7, fecha:'2026-03-25'}, {idObra:3, idTrabajador:5, fecha:'2026-03-25'},
  {idObra:1, idTrabajador:2, fecha:'2026-03-26'}, {idObra:2, idTrabajador:3, fecha:'2026-03-26'},
  {idObra:1, idTrabajador:1, fecha:'2026-03-27'}, {idObra:1, idTrabajador:2, fecha:'2026-03-27'},
  {idObra:2, idTrabajador:4, fecha:'2026-03-27'}, {idObra:3, idTrabajador:5, fecha:'2026-03-27'},
  {idObra:5, idTrabajador:6, fecha:'2026-03-27'}, {idObra:1, idTrabajador:7, fecha:'2026-03-18'},
  {idObra:2, idTrabajador:3, fecha:'2026-03-18'}, {idObra:3, idTrabajador:5, fecha:'2026-03-18'},
  {idObra:1, idTrabajador:1, fecha:'2026-03-19'}, {idObra:5, idTrabajador:6, fecha:'2026-03-19'},
  {idObra:2, idTrabajador:3, fecha:'2026-03-20'}, {idObra:1, idTrabajador:2, fecha:'2026-03-20'},
];
