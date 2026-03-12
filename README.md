# Rimac Backend - Reto de Agendamiento Médico

Este proyecto implementa un sistema de agendamiento de citas médicas utilizando una **Arquitectura Orientada a Eventos (EDA)** en AWS. Está diseñado para ser escalable, desacoplado y seguir las mejores prácticas de **Clean Architecture**.

## 🏗️ Arquitectura del Sistema
El flujo de datos sigue estos pasos definidos en el reto:
1. **API Gateway & Lambda (`createAppointment`)**: Recibe la petición, valida la lógica de negocio y registra en **DynamoDB** con estado `pending`.
2. **SNS**: Notifica el evento de creación.
3. **SQS (Fan-out)**: Los mensajes se filtran por país (`PE` o `CL`) y se encolan para su procesamiento regional.
4. **Lambdas de Procesamiento**: Los consumidores de SQS insertan el registro en la base de datos **MySQL (RDS)**.
5. **EventBridge**: Notifica la conformidad del procesamiento.
6. **Lambda de Cierre (`updateStatus`)**: Escucha el bus de eventos y actualiza el estado en DynamoDB a `completed`.



## 📂 Estructura del Proyecto
Organizado bajo principios **SOLID**:
- `src/core`: Reglas de negocio y entidades (Independiente de la tecnología).
- `src/functions`: Controladores (Handlers) de los eventos de entrada.
- `src/infrastructure`: Configuraciones de bases de datos y servicios externos.

## 🚀 Cómo Desplegar
1. **Requisitos**: Tener instalado el Serverless Framework V4 y credenciales de AWS configuradas.
2. **Instalación**:
   ```bash
   npm install