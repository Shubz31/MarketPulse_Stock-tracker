'use client'
import { CountrySelectField } from '@/components/forms/CountrySelectField'
import FooterLink from '@/components/forms/FooterLink'
import InputField from '@/components/forms/InputField'
import SelectField from '@/components/forms/SelectField'
import { Button } from '@/components/ui/button'
import { signUpWithEmail } from '@/lib/actions/auth.actions'
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants'

import { sign } from 'crypto'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const SignUp = () => {

        const router = useRouter();

    const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues:{
        fullName: '',
        email: '',
        password: '',
        country: '',
        investmentGoals: '',
        riskTolerance: '',
        preferredIndustry: '',
    },
    mode: 'onBlur'
  },)
  const onSubmit = async (data: SignUpFormData) => {
    try {
        console.log('Submitting sign up form...');
        const result = await signUpWithEmail(data);
        console.log('Sign up response:', result);
        
        if(result.success) {
            console.log('Sign up successful, redirecting...');
            // Add a small delay to ensure session is set before redirecting
            setTimeout(() => {
                console.log('Pushing to home page');
                router.push('/');
            }, 500);
        } else {
            console.log('Sign up failed with error:', result.error);
            toast.error('Sign up failed', {
                description: result.error || 'Failed to create account',
            });
        }
    } catch (e) {
        console.error('Sign up exception:', e);
        toast.error('Sign up failed. Please try again later.', {
            description: e instanceof Error ? e.message : 'Failed to create account',
        });
    }
  }
  return (
    <>
      <h1 className='form-title'>Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <InputField
            name='fullName'
            label='Full Name'
            placeholder='Enter your full name'
            register={register}
            error={errors.fullName}
            validation={{ required: 'Full name is required', minLength: 2 }}
        />

        <InputField
            name='email'
            label='Email'
            placeholder='Enter your email'
            register={register}
            error={errors.email}
            validation={{ required: 'Email name is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
        />

        <InputField
            name='password'
            label='Password'
            placeholder='Enter your password'
            type='password'
            register={register}
            error={errors.password}
            validation={{ required: 'Password is required', minLength: 6 }}
        />

        <CountrySelectField
            name='country'
            label='Country'
            control={control}
            error={errors.country}
            required
        />

        <SelectField
            name='investmentGoals'
            label='Investment Goals'
            placeholder='Select your investment goals'
            options={INVESTMENT_GOALS}
            control={control}
            error={errors.investmentGoals}
            required
        />

        <SelectField
            name='riskTolerance'
            label='Risk Tolerance'
            placeholder='Select your risk tolerance'
            options={RISK_TOLERANCE_OPTIONS}
            control={control}
            error={errors.riskTolerance}
        />

        <SelectField
            name='preferredIndustry'
            label='Preferred Industry'
            placeholder='Select your preferred industry'
            options={PREFERRED_INDUSTRIES}
            control={control}
            error={errors.preferredIndustry}
        />

        <Button type='submit' disabled={isSubmitting} className='w-full mt-5 yellow-btn'>
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>

        <FooterLink
            text='Already have an account?'
            linkText='Sign In'
            href='/sign-in'
        />

      </form>
    </>
  )
}

export default SignUp
