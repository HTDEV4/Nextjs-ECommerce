"use client"


import Image from "next/image";
import banner from "../../../../public/images/banner2.jpg"
import logo from "../../../../public/images/logo1.png"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { protectSignUpAction } from "@/actions/auth";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { register, isLoading } = useAuthStore();
    const router = useRouter();

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const checkFirstLevelOfValidation = await protectSignUpAction(formData.email);

        if (!checkFirstLevelOfValidation.success) {
            toast.error(checkFirstLevelOfValidation.error);
            return;
        }

        const userId = await register(formData.name, formData.email, formData.password);

        if (userId) {
            toast.success('Registration Successfully!')
            router.push(`/auth/login`);
        }
    }

    return (
        <div className="min-h-screen bg-[#fff6f4] flex">
            {/* Banner */}
            <div className="hidden lg:block w-1/2 bg-[#ffede1] relative overflow-hidden">
                <Image
                    src={banner}
                    alt="Register"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    priority
                />
            </div>
            {/* Xử lí Form Đăng ký */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <Image
                            src={logo}
                            alt="Logo Register"
                            width={200}
                            height={50}
                        />
                    </div>
                    {/* Form Đăng ký */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                required
                                className="bg-[#ffede1]"
                                value={formData.name}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="name">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="Enter your email"
                                required
                                className="bg-[#ffede1]"
                                value={formData.email}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="name">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                className="bg-[#ffede1]"
                                value={formData.password}
                                onChange={handleOnChange}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full bg-black text-white hover:bg-black transition-colors">
                            {
                                isLoading ? 'Creating Account...' : (
                                    <>
                                        CREATE ACCOUNT
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )
                            }
                        </Button>
                        <p className="text-center text-[#3f3d56] text-sm">
                            Already have an account{" "}
                            <Link href={`/auth/login`} className="text-[#000] hover:underline font-bold">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
