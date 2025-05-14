import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/constants/props";

type UseUserResult = {
  user: User | null;
  loading: boolean;
};

/**
 * Hook `useUser` načíta uloženého používateľa z `AsyncStorage` (kľúč `"user"`).
 *
 * ✅ Podporuje dva režimy:
 * - **Štandardný režim**: `useUser()` → vráti `User | null`,
 * - **Rozšírený režim**: `useUser(true)` → vráti `{ user: User | null, loading: boolean }`.
 *
 * Vnútorné správanie:
 * - Po načítaní sa pokúsi parsovať JSON string na `User` objekt.
 * - Nastaví `loading` na `false` po dokončení načítania.
 * - Pri chybe v parsovaní vypíše chybu do konzoly.
 *
 * @returns {User | null | { user: User | null; loading: boolean }}
 *   - Podľa volania buď samotného používateľa, alebo objekt s `user` a `loading`.
 *
 * @example
 * // Jednoduché použitie
 * const user = useUser();
 *
 * // Použitie s loading stavom
 * const { user, loading } = useUser(true);
 */

export function useUser(): User | null;
export function useUser(full: true): UseUserResult;
export function useUser(full?: true): User | null | UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) {
        try {
          const parsedUser: User = JSON.parse(data);
          setUser(parsedUser);
        } catch (e) {
          console.error("Chyba pri parsovaní user objektu z AsyncStorage:", e);
        }
      }
      setLoading(false);
    });
  }, []);

  if (full) {
    return { user, loading };
  }
  return user;
}
