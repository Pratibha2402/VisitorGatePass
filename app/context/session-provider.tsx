"use client";
import React, { useState, useContext, createContext, ReactNode } from "react";

export const SessionContext = createContext<any>(null);

export default function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: { status: string; user: any } | null;
}) {
  //   const [session, setSession] = useState(null);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): any {
  const context = useContext(SessionContext);
  // if (!context) {
  //   throw new Error("useSession must be used within a SessionContext");
  // }
  return context;
}
