import { validateAppointment } from './Appointment';

describe('Pruebas de Validación de Cita', () => {
  test('Debe permitir un insuredId válido de 5 dígitos', () => {
    const validData = { insuredId: "00123", scheduleId: 100, countryISO: "PE" };
    expect(() => validateAppointment(validData)).not.toThrow();
  });

  test('Debe fallar si el insuredId no tiene 5 dígitos', () => {
    const invalidData = { insuredId: "123", scheduleId: 100, countryISO: "PE" };
    expect(() => validateAppointment(invalidData)).toThrow();
  });

  test('Debe fallar si el país no es PE o CL', () => {
    const invalidData = { insuredId: "12345", scheduleId: 100, countryISO: "US" };
    expect(() => validateAppointment(invalidData)).toThrow();
  });
});