'use server';

import {getAuth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const auth = await getAuth();
        console.log('Auth instance obtained, attempting signup...');
        const response = await auth!.api.signUpEmail({ body: { email, password, name: fullName } })
        console.log('Better-auth signup response:', response);

        // Check if response contains error
        if(response?.error) {
            console.log('Response contains error:', response.error);
            return { success: false, error: response.error }
        }

        if(response) {
            console.log('Sending Inngest event for user creation...');
            await inngest.send({
                name: 'app/user.created',
                data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
            }).catch((err) => console.error('Inngest event failed:', err))
        }

        console.log('Sign up successful, returning success response');
        return { success: true, data: response }
    } catch (e) {
        console.log('Sign up error:', e)
        return { success: false, error: 'Sign up failed' }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const auth = await getAuth();
        const response = await auth!.api.signInEmail({ body: { email, password } })

        if(response?.error) {
            return { success: false, error: response.error }
        }

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign in failed', e)
        return { success: false, error: 'Sign in failed' }
    }
}

export const signOut = async () => {
    try {
        const auth = await getAuth();
        await auth!.api.signOut({ headers: await headers() });
        return { success: true }
    } catch (e) {
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}