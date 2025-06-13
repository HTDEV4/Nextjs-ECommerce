import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs'
import { error } from "console";


const prisma = new PrismaClient()

async function main() {
    const email = "admin@gmail.com"
    const password = "123456"
    const name = "Super Admin"

    const existingSuperAmin = await prisma.user.findFirst({
        where: { role: 'SUPER_ADMIN' }
    })

    if (existingSuperAmin) {
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdminUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role: "SUPER_ADMIN",
        }
    })

    console.log('Super admin created successfully', superAdminUser.email);
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect()
    });