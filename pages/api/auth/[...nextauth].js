import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "User Name" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const { username, password } = credentials
                const url = `${process.env.SERVER_HOST ?? 'localhost'}/api/auth/login`;
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "email": username,
                        password,
                    }),
                })
                    .catch(function (error) {
                        console.log(error);
                    });

                const user = await res.json();

                if (res.ok && user) {
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.user = token;

            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
}

export default NextAuth(authOptions)