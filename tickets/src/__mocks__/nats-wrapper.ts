// lek 348
// export const natsWrapper = {
//   client: {
//     publish: (subject: string, data: string, callback: () => void) => {
//       callback();
//     },
//   },
// };

// lek 349
export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      // Akceptuje funkcję, która powinna być używana jako implementacja mock 'atrapy'.
      // Sama 'atrapa' będzie nadal rejestrować wszystkie wywołania i wystąpienia,
      // które pochodzą z niej samej – jedyną różnicą jest to,
      // że implementacja będzie również wykonywana, gdy 'atrapa' zostanie wywołana.
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
