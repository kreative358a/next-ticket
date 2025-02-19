// lek 148

/*
Klasa abstrakcyjna:
Jest jak klasa, ale nie może być bezpośrednio instancjonowana.
Innymi słowy, nie możemy powiedzieć o nowym błędzie niestandardowym.
Zamiast tego, niestandardowe lub abstrakcyjne klasy są używane do organizowania naszego kodu i w jakiś sposób określają wymagania dla podklas tej klasy.
Więc tak naprawdę jest on używany do ustawiania wymagań dla podklasy.
Fajną rzeczą w klasie abstrakcyjnej jest to, że kiedy przetłumaczymy ją na JavaScript w celu
faktycznego wykonania, faktycznie otrzymujemy definicję klasy.
Kiedy tłumaczymy interfejsy na JavaScript, wszystkie interfejsy znikają.
W rzeczywistości nie istnieją one w świecie JavaScript, ale klasy abstrakcyjne już tak.
Oznacza to, że możemy użyć klasy abstrakcyjnej z instancją check.
Jest to niezwykle istotne, ponieważ pamiętaj o naszym obszarze obsługi oprogramowania pośredniczącego.
*/

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
