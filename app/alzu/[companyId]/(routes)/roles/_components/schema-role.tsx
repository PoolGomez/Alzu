import { z } from "zod";

const PermissionsSchema = z.enum([
    "VIEW_DASHBOARD",

  "VIEW_PRODUCTS",
  "CREATE_PRODUCT",
  "EDIT_PRODUCT",
  "DELETE_PRODUCT",

  "VIEW_CATEGORIES",
  "CREATE_CATEGORY",
  "EDIT_CATEGORY",
  "DELETE_CATEGORY",

  "VIEW_PRESENTATIONS",
  "CREATE_PRESENTATION",
  "EDIT_PRESENTATION",
  "DELETE_PRESENTATION",

  "VIEW_ORDERS",
  "CREATE_ORDER",
  "EDIT_ORDER",
  "DELETE_ORDER",

  "VIEW_ROOMS",
  "CREATE_ROOM",
  "EDIT_ROOM",
  "DELETE_ROOM",

  "VIEW_TABLES",
  "CREATE_TABLE",
  "EDIT_TABLE",
  "DELETE_TABLE",
  
  "SELL",
//   "VIEW_COMPANY"
]); // Ejemplo de permisos

export const formSchemaRole = z.object({
  name: z.string().min(1),
  description: z.string(),
  // permissions: z.array(z.string()).refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one item.",
  // }),
  permissions: z.array(PermissionsSchema).optional().default([])
});