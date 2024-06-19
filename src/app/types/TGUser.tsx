// // Если у вас уже есть файл с типами, добавьте этот интерфейс туда.
// // Или создайте новый файл, например, types.ts, и разместите его где-нибудь в вашем проекте.

// // interface TGUser {
// //     initDataUnsafe?: {
// //       user?: {
// //         id: number| null;
// //         username: string| null;
// //       };
// //     };
// //   }

export type User = {
  id: number | null;
  username: string | null;
};

export type TGUser = User & Record<string, unknown>;
