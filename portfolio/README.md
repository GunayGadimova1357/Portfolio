This is a [Next.js](https://nextjs.org) portfolio project with a private admin dashboard powered by NextAuth credentials.

## Getting Started

First, create your local environment file:

```bash
cp .env.example .env.local
```

Set these values in `.env`:

```bash
AUTH_SECRET=your-random-secret
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-strong-password
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) with your browser to see the site.

The admin panel lives at `/en/dashboard/login`, `/ru/dashboard/login`, and `/az/dashboard/login`. Only the configured `ADMIN_EMAIL` + `ADMIN_PASSWORD` account can sign in.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
