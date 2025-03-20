
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AdminAuthProvider } from "./admin/AdminAuthProvider";
import { useAdminAuth } from "./admin/useAdminAuth";

// Reexport the provider and hook
export { AdminAuthProvider, useAdminAuth };

// Define the context type for internal use
export type AdminAuthContextType = {
  isAdmin: boolean;
  isChecking: boolean;
  signOut: () => Promise<void>;
  verifyAdmin: () => Promise<boolean>;
  refreshAdminSession: () => Promise<boolean>;
};

// Create the context with undefined default value
export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);
