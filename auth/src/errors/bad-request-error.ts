import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  // lek 162
  // public, TypeScript automatycznie pobierze tę właściwość lub ten argument
  // i zapisze go jako właściwość naszej instancji błędu złego żądania.
  // Jeśli spróbujemy odwołać się do tego komunikatu kropki wewnątrz super tutaj,
  // super zostanie wykonany, zanim TypeScript wskoczy
  // i zapisze odniesienie do komunikatu w naszej instancji.
  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
