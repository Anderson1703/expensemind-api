// import axios from 'axios';
// import { Message } from 'anthropic';

// // Interfaz para la respuesta de Claude
// interface ClaudeResponse {
//   id: string;
//   type: string;
//   role: string;
//   content: Array<{
//     type: string;
//     text?: string;
//   }>;
//   model: string;
//   stop_reason: string;
//   usage: {
//     input_tokens: number;
//     output_tokens: number;
//   };
// }

// export class ClaudeService {
//   private apiKey: string;
//   private apiUrl: string;
//   private defaultModel: string;
//   private defaultMaxTokens: number;

//   constructor() {
//     this.apiKey = process.env.CLAUDE_API_KEY!;
//     this.apiUrl = 'https://api.anthropic.com/v1/messages';
//     this.defaultModel = process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307';
//     this.defaultMaxTokens = parseInt(process.env.CLAUDE_MAX_TOKENS || '1000');
    
//     if (!this.apiKey) {
//       console.warn('ADVERTENCIA: CLAUDE_API_KEY no está configurada en las variables de entorno');
//     }
//   }

//   /**
//    * Extrae datos de archivos usando la API de Claude
//    * @param files Lista de archivos a procesar
//    * @param userId ID del usuario para logging
//    * @returns Datos extraídos en formato JSON
//    */
//   async extractDataFromFiles(
//     files: Express.Multer.File[],
//     userId: string
//   ): Promise<any> {
//     try {
//       if (!this.apiKey) {
//         throw new Error('CLAUDE_API_KEY no está configurada');
//       }

//       // Registrar la solicitud
//       console.log(`Iniciando extracción de datos para usuario ${userId} con ${files.length} archivos`);
      
//       // Crear un mensaje para enviar a Claude
//       const systemPrompt = this.buildSystemPrompt();
      
//       // Preparar el mensaje con archivos adjuntos
//       const messages: Message[] = [
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: systemPrompt
//             }
//           ]
//         }
//       ];
      
//       // Añadir cada archivo como contenido del mensaje
//       files.forEach((file) => {
//         // Agregar archivo como media al mensaje
//         messages[0].content.push({
//           type: "image", // Claude trata tanto imágenes como PDFs como "image"
//           source: {
//             type: "base64",
//             media_type: file.mimetype,
//             data: file.buffer.toString('base64')
//           }
//         });
//       });

//       // Configurar la petición
//       const response = await axios.post<ClaudeResponse>(
//         this.apiUrl,
//         {
//           model: this.defaultModel,
//           max_tokens: this.defaultMaxTokens,
//           messages: messages,
//           temperature: 0 // Usar temperatura 0 para resultados más deterministas
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': this.apiKey,
//             'anthropic-version': '2023-06-01'
//           }
//         }
//       );

//       // Obtener el texto de la respuesta
//       const responseText = response.data.content[0].text || '';
      
//       // Intentar parsear la respuesta como JSON
//       try {
//         // Si Claude devuelve un JSON string, lo parseamos
//         return JSON.parse(responseText);
//       } catch (parseError) {
//         // Si no es JSON, devolvemos el texto como está
//         console.log('La respuesta no es un JSON válido, devolviendo texto plano');
//         return { rawText: responseText };
//       }
//     } catch (error: any) {
//       console.error('Error al llamar a la API de Claude:', error.message);
      
//       // Si hay una respuesta de error de la API, la capturamos
//       if (error.response) {
//         console.error('Detalles del error:', error.response.data);
//         throw new Error(`Error en la API de Claude: ${error.response.data.error?.message || 'Error desconocido'}`);
//       }
      
//       throw error;
//     }
//   }

//   /**
//    * Construye el prompt del sistema para enviar a Claude
//    * @returns Prompt del sistema
//    */
//   private buildSystemPrompt(): string {
//     return `
//       Por favor, extrae toda la información relevante de los archivos adjuntos.
      
//       INSTRUCCIONES IMPORTANTES:
//       1. Extrae texto, datos tabulares, campos clave/valor y cualquier otra información estructurada.
//       2. Si hay tablas, conviértelas a formato estructurado.
//       3. Identifica nombres, fechas, cantidades monetarias, direcciones y cualquier otro dato importante.
//       4. Si hay múltiples páginas o documentos, organiza la información por documento.
//       5. Devuelve ÚNICAMENTE un objeto JSON con los datos extraídos, sin ningún texto adicional.
//       6. La estructura del JSON debe ser clara y bien organizada para facilitar su procesamiento.
      
//       Por favor, devuelve toda la información en formato JSON válido, siguiendo un esquema similar a:
//       {
//         "documentos": [
//           {
//             "nombre": "nombre_del_archivo.ext",
//             "tipo": "factura|recibo|formulario|etc",
//             "datos": {
//               // Datos extraídos específicos según el tipo de documento
//             },
//             "texto_completo": "Texto completo extraído del documento (opcional)"
//           }
//         ]
//       }
//     `;
//   }
// }
