export interface AppointmentRequest {
  insuredId: string;
  scheduleId: number;
  countryISO: string;
}

export const validateAppointment = (data: AppointmentRequest) => {
  const isIdValid = /^\d{5}$/.test(data.insuredId);
  const isCountryValid = ['PE', 'CL'].includes(data.countryISO);
  
  if (!isIdValid || !isCountryValid) {
    throw new Error("Datos de entrada inválidos: Verifique insuredId (5 dígitos) y countryISO (PE/CL).");
  }
};