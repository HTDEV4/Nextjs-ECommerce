import Image from "next/image";
import banner from "../../../../public/images/banner2.jpg"
import logo from "../../../../public/images/logo1.png"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function RegisterPage() {
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
                    <form action="" className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                required
                                className="bg-[#ffede1]"
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
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="name">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="text"
                                placeholder="Enter your password"
                                required
                                className="bg-[#ffede1]"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-black text-white hover:bg-black transition-colors">
                            CREATE ACCOUNT
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
