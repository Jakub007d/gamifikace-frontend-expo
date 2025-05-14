import { API_URL } from "../constants";

/**
 * Odosiela požiadavku na registráciu nového používateľa na backend API.
 *
 * Táto funkcia odosiela POST požiadavku na endpoint `/register/` s údajmi používateľa.
 * V prípade úspechu vracia `true`, inak `false`. Loguje detaily do konzoly.
 *
 * @async
 * @function
 * @param {string} username - Užívateľské meno.
 * @param {string} email - E-mailová adresa.
 * @param {string} password - Heslo.
 * @param {string} password2 - Potvrdenie hesla.
 * @param {string} registration_code - Kód potrebný na registráciu (napr. školský alebo prístupový).
 *
 * @returns {Promise<boolean>} `true` ak bola registrácia úspešná, inak `false`.
 *
 * @example
 * const success = await handleRegister("jozef123", "jozef@email.com", "tajneHeslo", "tajneHeslo", "KOD123");
 */

export const handleRegister = async (
  username: String,
  email: String,
  password: String,
  password2: String,
  registration_code: String
) => {
  console.log(
    "Registering user:",
    username,
    email,
    password,
    password2,
    registration_code
  );
  try {
    const response = await fetch(API_URL + "/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        registration_code: registration_code,
        password: password,
        password2: password2,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Registrácia úspešná");
      return true;
    } else {
      console.error("Chyba pri registrácii", data);
      return false;
    }
  } catch (error) {
    console.error("Chyba spojenia s API:", error);
    return false;
  }
};
