// lek 190
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// lek 191
interface UserPayload {
  id: string;
  email: string;
}

// Tak więc w tym przypadku mówimy TypeScript, że wewnątrz projektu Express znaleźć interfejs żądania, który został już tam zdefiniowany, ale bierzemy ten interfejs, który został już utworzony i chcemy dodać do niego tę dodatkową właściwość. Chcemy więc mieć właściwość o nazwie current user, która może być zdefiniowana. Może więc zostać zdefiniowany lub nie. A powodem, dla którego może, ale nie musi, być to, że użytkownik może nie być zalogowany.
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // jeśli nie ma obiektu sesji, lub jeśli nie ma właściwości JWT.
  if (!req.session?.jwt) {
    return next();
  }

  try {
    // const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    // res.send({ message: err });
  }

  next();
};
