import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "@hachi/database/client";
import * as schema from "@hachi/database/schema";
import { ac, owner, admin, editor, viewer } from "./permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
      organization: schema.organization,
      member: schema.member,
      invitation: schema.invitation,
      team: schema.team,
      teamMember: schema.teamMember,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Can enable later
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!process.env.GITHUB_CLIENT_ID,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
  },

  secret: process.env.BETTER_AUTH_SECRET || "",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  basePath: "/api/auth",
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean) as string[],

  advanced: {
    // Force secure cookies in production so SameSite=None is set correctly
    // for cross-domain requests between hachii.vercel.app and hachii-api.vercel.app.
    // BETTER_AUTH_URL must also be set to https:// for this to take full effect.
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (refresh session if older than this)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  user: {
    additionalFields: {
      name: {
        type: "string",
        required: false,
      },
      avatarUrl: {
        type: "string",
        required: false,
        fieldName: "avatar_url",
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const emailDomain = user.email.split("@")[1];
          if (!emailDomain) return;

          const matchingOrg = await db
            .select()
            .from(schema.organization)
            .where(eq(schema.organization.domain, emailDomain))
            .limit(1);

          const org = matchingOrg[0];
          if (org) {
            await auth.api.addMember({
              body: {
                userId: user.id,
                role: "viewer",
                organizationId: org.id,
              },
            });
            console.log(
              `[Domain] Auto-joined ${user.email} to org "${org.name}" (domain: ${emailDomain})`
            );
          }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          if (session.activeOrganizationId) {
            return { data: session };
          }

          const membership = await db
            .select()
            .from(schema.member)
            .where(eq(schema.member.userId, session.userId))
            .limit(1);

          const firstMembership = membership[0];
          if (firstMembership) {
            return {
              data: {
                ...session,
                activeOrganizationId: firstMembership.organizationId,
              },
            };
          }
          return { data: session };
        },
      },
    },
  },

  plugins: [
    organization({
      ac,
      roles: { owner, admin, editor, viewer },
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
      membershipLimit: 100,
      invitationExpiresIn: 172800, // 48h
      teams: {
        enabled: true,
        maximumTeams: 20,
      },
      schema: {
        organization: {
          additionalFields: {
            domain: {
              type: "string",
              required: false,
              input: true,
            },
          },
        },
      },
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite/${data.id}`;
        console.log(`[Org] Invite ${data.email} to ${data.organization.name}: ${inviteLink}`);
        // TODO: wire up email service
      },
    }),
  ],
});

export type Auth = typeof auth;
