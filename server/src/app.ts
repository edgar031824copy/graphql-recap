import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { expressMiddleware } from '@apollo/server/express4';
import { apolloServer, type GraphQLContext } from './graphql/index.js';
import { loginController, logoutController, meController } from './controllers/authController.js';

const PORT = process.env.PORT ?? 4000;

async function bootstrap() {
  const app = express();

  // credentials:true is required for cookies to be sent cross-origin
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(express.json());
  // Parses Cookie header into req.cookies — must come before any route that reads cookies
  app.use(cookieParser());

  app.post('/login', loginController);
  app.post('/logout', logoutController);
  app.get('/me', meController);

  await apolloServer.start();
  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      // context runs on every GraphQL request.
      // It reads the cookie, verifies the JWT, and returns { userId } for resolvers to use.
      // Returning null userId is not an error — unprotected queries still work fine.
      context: async ({ req }): Promise<GraphQLContext> => {
        const token = req.cookies?.token;
        if (!token) return { userId: null };
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
          return { userId: payload.sub };
        } catch {
          return { userId: null };
        }
      },
    }),
  );

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

bootstrap();
