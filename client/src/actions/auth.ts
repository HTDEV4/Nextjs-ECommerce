'use server'

import { protectLoginRules, protectSignupRules } from '@/arcjet';
import { request } from '@arcjet/next'

export const protectSignUpAction = async (email: string) => {

    const req = await request();
    const decision = await protectSignupRules.protect(req, { email });

    if (decision.isDenied()) {
        if (decision.reason.isEmail()) {
            const emailTypes = decision.reason.emailTypes;
            // Check coi email này có phải là email dùng 1 lần (tạm thời) không
            if (emailTypes.includes('DISPOSABLE')) {
                return {
                    error: 'Disposable email address are not allowed',
                    success: false,
                    status: 403,
                }
            } else if (emailTypes.includes('INVALID')) {
                // Check coi email này có đúng định dạng không
                return {
                    error: 'Invalid email',
                    success: false,
                    status: 403,
                }
            } else if (emailTypes.includes('NO_MX_RECORDS')) {
                /**
                 * - MX (Mail eXchange) record là một loại bản ghi DNS dùng để chỉ định máy chủ nhận email cho một tên miền.
                 * - Nói cách dễ hiểu: khi bạn gửi email tới abc@domain.com, máy chủ email (ví dụ: Gmail) sẽ kiểm tra tên miền domain.com có bản ghi MX không, để biết phải gửi email đó tới đâu.
                 * */
                return {
                    error: 'Email domain does not have valid MX Records! Please try with different email',
                    success: false,
                    status: 403,
                }
            }
        } else if (decision.reason.isBot()) {
            // Check coi có dùng bot để chạy đăng ký không
            return {
                error: 'Bot activity detected',
                success: false,
                status: 403,
            }
        } else if (decision.reason.isRateLimit()) {
            // Giới hạn số lần đăng ký trong cùng 1 IP
            return {
                error: 'Too many requests! Please try again later',
                success: false,
                status: 403,
            }
        }
    }

    return {
        success: true,
    };
};

export const protectSignInAction = async (email: string) => {

    const req = await request();
    const decision = await protectLoginRules.protect(req, { email });

    if (decision.isDenied()) {
        if (decision.reason.isEmail()) {
            const emailTypes = decision.reason.emailTypes;
            // Check coi email này có phải là email dùng 1 lần (tạm thời) không
            if (emailTypes.includes('DISPOSABLE')) {
                return {
                    error: 'Disposable email address are not allowed',
                    success: false,
                    status: 403,
                }
            } else if (emailTypes.includes('INVALID')) {
                // Check coi email này có đúng định dạng không
                return {
                    error: 'Invalid email',
                    success: false,
                    status: 403,
                }
            } else if (emailTypes.includes('NO_MX_RECORDS')) {
                /**
                 * - MX (Mail eXchange) record là một loại bản ghi DNS dùng để chỉ định máy chủ nhận email cho một tên miền.
                 * - Nói cách dễ hiểu: khi bạn gửi email tới abc@domain.com, máy chủ email (ví dụ: Gmail) sẽ kiểm tra tên miền domain.com có bản ghi MX không, để biết phải gửi email đó tới đâu.
                 * */
                return {
                    error: 'Email domain does not have valid MX Records! Please try with different email',
                    success: false,
                    status: 403,
                }
            }
        }
    }

    return {
        success: true,
    };
};