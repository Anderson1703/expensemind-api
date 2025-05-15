import { z } from "zod";

export const Status = z.enum(['CREATED', 'UPDATED', 'DELETED']);
