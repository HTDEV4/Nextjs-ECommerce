import { prisma } from "../server";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid'

// Hàm tạo Access Token và Refresh Token cho người dùng
function generateToken(userId: string, email: string, role: string) {
    // Tạo access token bằng JWT chứa thông tin người dùng (payload)
    const accessToken = jwt.sign({
        userId,      // ID người dùng
        email,       // Email người dùng
        role         // Vai trò (USER, SUPER_ADMIN, ...)
    },
        // '!' để giúp typescript biến này không phải là undefined.
        process.env.JWT_SECRET!,  // Khóa bí mật dùng để ký token (lấy từ biến môi trường)
        { expiresIn: "60m" }      // Token có thời hạn 60 phút
    );

    // Tạo refresh token (một chuỗi UUID ngẫu nhiên)
    const refreshToken = uuidV4();

    // Trả về cả access token và refresh token
    return { accessToken, refreshToken };
}

// Hàm setTokens: Lưu accessToken và refreshToken vào cookie của trình duyệt
async function setTokens(res: Response, accessToken: string, refreshToken: string) {
    // Đặt access token vào cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,                        // Chỉ truy cập qua HTTP, không thể truy cập bằng JavaScript (giúp chống XSS)
        secure: process.env.NODE_ENV === 'production', // Chỉ dùng HTTPS nếu ở môi trường production
        sameSite: 'strict',                    // Chỉ gửi cookie nếu cùng origin (giúp chống CSRF)
        maxAge: 60 * 60 * 1000,                // Hết hạn sau 1 giờ (tính bằng milliseconds)
    });

    // Đặt refresh token vào cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,                        // Bảo mật như access token
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,              // Hết hạn sau 7 ngày (tính bằng giây)
    });
}


// Handle Register
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        // Kiểm tra người dùng có tồn tại không
        const existingUser = await prisma.user.findUnique({ where: { email } });

        // Nếu người dùng có rồi
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User with this email exists!'
            })
            return;
        }

        // Độ mạnh của thuật toán (salt rounds)
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                name, email, password: hashedPassword, role: 'USER'
            }
        })

        res.status(201).json({
            message: 'User register successfully',
            success: true,
            userId: user.id,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed" });
    }
}

// Handle Login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        // trong db mà chúng ta config thì giá trị của nó là unique: duy nhất
        const extractCurrentUser = await prisma.user.findUnique({ where: { email } });

        // Kiểm tra người dùng nhập thông tin đúng không
        if (!extractCurrentUser || !(await bcrypt.compare(password, extractCurrentUser.password))) {
            res.status(401).json({
                success: false,
                error: 'Invalided credentials'
            })
            return;
        }

        // Create our access and refreshToke
        const { accessToken, refreshToken } = generateToken(extractCurrentUser.id, extractCurrentUser.email, extractCurrentUser.role);

        // Set our token
        await setTokens(res, accessToken, refreshToken);
        res.status(200).json({
            success: true,
            message: 'Login successfully',
            user: {
                id: extractCurrentUser.id,
                name: extractCurrentUser.name,
                email: extractCurrentUser.email,
                role: extractCurrentUser.role
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
}

// Hàm refreshAccessToken: Dùng để cấp lại access token mới khi access token cũ hết hạn
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    // Lấy refreshToken từ cookie
    const refreshToken = req.cookies.refreshToken;

    // Nếu không có refreshToken trong cookie, trả về lỗi 401 (unauthorized)
    if (!refreshToken) {
        res.status(401).json({
            success: false,
            error: 'Invalid refresh token'
        });
        return;
    }

    try {
        // Tìm người dùng có refreshToken tương ứng trong database
        const user = await prisma.user.findFirst({
            where: {
                refreshToken: refreshToken
            }
        });

        // Nếu không tìm thấy user với refresh token này -> token không hợp lệ
        if (!user) {
            res.status(401).json({
                success: false,
                error: "User not found"
            });
            return;
        }

        // Sinh accessToken và refreshToken mới
        const { accessToken, refreshToken: newRefreshToken } = generateToken(user.id, user.email, user.role);

        // Cập nhật lại cookie với accessToken và refreshToken mới
        await setTokens(res, accessToken, newRefreshToken);

        // Phản hồi thành công
        res.status(201).json({
            success: true,
            message: 'Refresh token refreshed successfully'
        });
    } catch (error) {
        // Nếu có lỗi xảy ra, log lỗi và trả về lỗi 500
        console.error(error);
        res.status(500).json({ error: "Refresh token error" });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({
        success: true,
        message: "User logged out successfully"
    })
}