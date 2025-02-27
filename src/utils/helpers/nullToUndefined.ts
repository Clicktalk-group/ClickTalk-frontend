/**
 * Transforme une valeur `null` en `undefined` pour répondre aux contraintes de typage.
 * @param value La valeur à convertir.
 * @returns La valeur convertie en `undefined` si elle est `null`, sinon retourne la valeur d'origine.
 */
export const nullToUndefined = <T>(value: T | null): T | undefined => {
    return value === null ? undefined : value;
  };
  