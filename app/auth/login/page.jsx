"use client";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import { signIn } from "next-auth/react";
import { useState } from "react";

const LoginPage = ({ searchParams }) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async () => {
        const result = await signIn("credentials", {
            username: userName,
            password: password,
            redirect: true,
            callbackUrl: "/",
        });
    };
    return (
        <div className={"flex flex-col justify-center items-center  h-screen bg-gradient-to-br gap-1"}>
            {searchParams?.message && <p className="text-red-700 bg-red-100 py-2 px-5 rounded-md">{searchParams?.message}</p>}
            <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
                <Input label="User Name" placeholder="John Doe" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <Input label="Password" type={"password"} placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={onSubmit}>Login</Button>
            </div>
        </div>
    );
};

export default LoginPage;
