/**
 * Strings en español de la pantalla de perfil del paciente. Extraídos de
 * `PatientProfileCard.tsx` para separar copy de lógica/UI.
 */
export const perfilStrings = {
  updateSuccess: "Perfil actualizado correctamente.",
  updateError: "No se pudo actualizar el perfil. Intenta de nuevo.",
  pregnancyDeactivated: "Embarazo desactivado.",
  pregnancyDeactivateError: "No se pudo desactivar el embarazo. Intenta de nuevo.",
  loading: "Cargando perfil...",
  loadError: "No se pudo cargar el perfil.",
  // Labels visibles
  personalInfo: "Información personal",
  healthData: "Datos de salud",
  email: "Correo electrónico",
  emailEmpty: "No registrado",
  dob: "Fecha de nacimiento",
  gender: "Género",
  diabetesType: "Tipo de diabetes",
  edit: "Editar",
  cancel: "Cancelar",
  save: "Guardar cambios",
  saving: "Guardando...",
  height: "Estatura",
  heightField: "Estatura (cm)",
  heightPlaceholder: "Ej. 165",
  heightEmpty: "No registrada",
  phone: "Teléfono",
  phonePlaceholder: "Ej. +52 664 123 4567",
  phoneEmpty: "No registrado",
  pregnantActive: "Embarazo activo",
  pregnantQuestion: "¿Embarazada actualmente?",
  yes: "Sí",
  no: "No",
  pregnancyStart: "Inicio de embarazo",
  pregnancyDue: "Fecha probable de parto",
  memberSincePrefix: "Paciente desde",
} as const;
