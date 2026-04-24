import { getAuth } from "@/lib/better-auth/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry } = body;

        const auth = await getAuth();
        
        console.log('API Route: Auth instance obtained, attempting signup...');
        
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName,
            },
        });

        console.log('API Route: Better-auth signup response:', response);

        // Check if response contains error
        if (response?.error) {
            console.log('API Route: Response contains error:', response.error);
            return new Response(
                JSON.stringify({ success: false, error: response.error }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (response?.user) {
            console.log('API Route: Sending Inngest event for user creation...');
            
            // Import and send Inngest event
            const { inngest } = await import("@/lib/inngest/client");
            await inngest.send({
                name: "app/user.created",
                data: {
                    userId: response.user.id,
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry,
                },
            }).catch((err) => console.error("Inngest event failed:", err));
        }

        console.log('API Route: Sign up successful');
        
        return new Response(
            JSON.stringify({ success: true, data: response }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (e) {
        console.error("API Route: Sign up error:", e);
        return new Response(
            JSON.stringify({ success: false, error: "Sign up failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
